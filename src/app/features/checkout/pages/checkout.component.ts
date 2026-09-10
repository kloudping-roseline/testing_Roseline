import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, computed, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterModule } from "@angular/router";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Store } from "@ngrx/store";

import { ButtonModule } from "primeng/button";
import { DividerModule } from "primeng/divider";
import { InputTextModule } from "primeng/inputtext";
import { RadioButtonModule } from "primeng/radiobutton";
import { MessageService } from "primeng/api";

import { Product } from "../../../core";
import { CartState } from "../../cart/store/cart.reducer";
import { clearCart } from "../../cart/store/cart.actions";
import { selectProducts } from "../../cart/store/cart.selectors";

@Component({
  selector: "app-checkout",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    RadioButtonModule,
  ],
  template: `
    <div class="flex flex-column gap-3 px-2 md:px-0">
      <h1 class="text-2xl font-semibold">Checkout</h1>
      @if (cartSig().length) {
        <div class="flex flex-column lg:flex-row gap-3">
          <div class="card w-12 lg:w-7 px-3 py-4 md:px-4">
            <h2 class="text-xl mt-0">Shipping information</h2>
            <p-divider />
            <form [formGroup]="shippingForm" class="flex flex-column gap-4">
              <div>
                <span class="w-full p-float-label">
                  <input pInputText id="fullName" type="text" class="w-full" formControlName="fullName" />
                  <label for="fullName">Full name</label>
                </span>
                @if (isInvalid("fullName")) {
                  <small class="p-error block mt-1">Full name is required.</small>
                }
              </div>
              <div>
                <span class="w-full p-float-label">
                  <input pInputText id="address" type="text" class="w-full" formControlName="address" />
                  <label for="address">Address</label>
                </span>
                @if (isInvalid("address")) {
                  <small class="p-error block mt-1">Address is required.</small>
                }
              </div>
              <div class="flex flex-column sm:flex-row gap-4">
                <div class="w-full sm:w-6">
                  <span class="w-full p-float-label">
                    <input pInputText id="city" type="text" class="w-full" formControlName="city" />
                    <label for="city">City</label>
                  </span>
                  @if (isInvalid("city")) {
                    <small class="p-error block mt-1">City is required.</small>
                  }
                </div>
                <div class="w-full sm:w-6">
                  <span class="w-full p-float-label">
                    <input pInputText id="postalCode" type="text" class="w-full" formControlName="postalCode" />
                    <label for="postalCode">Postal code</label>
                  </span>
                  @if (isInvalid("postalCode")) {
                    <small class="p-error block mt-1">Postal code is required.</small>
                  }
                </div>
              </div>
              <div>
                <span class="w-full p-float-label">
                  <input pInputText id="phone" type="text" class="w-full" formControlName="phone" />
                  <label for="phone">Phone</label>
                </span>
                @if (isInvalid("phone")) {
                  <small class="p-error block mt-1">Phone is required.</small>
                }
              </div>
            </form>
            <p-divider />
            <h2 class="text-xl">Payment method</h2>
            <div class="flex flex-column sm:flex-row gap-4">
              <div class="flex align-items-center gap-2">
                <p-radioButton
                  name="paymentMethod"
                  value="priceSpecial"
                  [(ngModel)]="paymentMethod"
                  [ngModelOptions]="{ standalone: true }"
                  inputId="priceSpecial"
                />
                <label for="priceSpecial">Bank transfer or deposit</label>
              </div>
              <div class="flex align-items-center gap-2">
                <p-radioButton
                  name="paymentMethod"
                  value="priceList"
                  [(ngModel)]="paymentMethod"
                  [ngModelOptions]="{ standalone: true }"
                  inputId="priceList"
                />
                <label for="priceList">Credit or debit card</label>
              </div>
            </div>
          </div>
          <div class="card w-12 lg:w-5 px-3 py-4 md:px-4 h-fit">
            <h2 class="text-xl mt-0">Order summary</h2>
            <p-divider />
            @for (item of cartSig(); track item.id_cart) {
              <div class="flex justify-content-between gap-2 mb-2">
                <span class="text-overflow-ellipsis overflow-hidden white-space-nowrap">{{ item.title }}</span>
                <span class="font-semibold white-space-nowrap">
                  {{
                    (paymentMethod === "priceList" ? item.price_list : item.price_special)
                      | currency: "ARS" : "symbol"
                  }}
                </span>
              </div>
            }
            <p-divider />
            <div class="flex justify-content-between">
              <span>Subtotal</span>
              <span>{{ subtotal() | currency: "ARS" : "symbol" }}</span>
            </div>
            <div class="flex justify-content-between text-green-400">
              <span>Shipping</span>
              <span>{{ shipping | currency: "ARS" : "symbol" }}</span>
            </div>
            <p-divider />
            <div class="flex justify-content-between text-xl font-bold">
              <span>Total</span>
              <span>{{ total() | currency: "ARS" : "symbol" }}</span>
            </div>
            <p-button
              styleClass="w-full mt-4"
              severity="warning"
              label="Place order"
              (onClick)="placeOrder()"
            />
          </div>
        </div>
      } @else {
        <div class="flex flex-column justify-content-center align-items-center gap-3 card py-6">
          <i class="pi pi-shopping-cart text-8xl text-color-secondary"></i>
          <p class="font-bold text-xl m-0 text-color-secondary">Your cart is empty</p>
          <p-button label="Back to shop" severity="warning" routerLink="/tienda/pagina/1" />
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CheckoutComponent {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _store = inject(Store<{ cart: CartState }>);
  private readonly _messageService = inject(MessageService);
  private readonly _router = inject(Router);

  public cartSig = signal<Product[]>([]);
  public paymentMethod: "priceSpecial" | "priceList" = "priceSpecial";
  public readonly shipping: number = 7999;

  public readonly shippingForm: FormGroup = this._formBuilder.group({
    fullName: ["", Validators.required],
    address: ["", Validators.required],
    city: ["", Validators.required],
    postalCode: ["", Validators.required],
    phone: ["", Validators.required],
  });

  public subtotal = computed<number>(() => {
    const key = this.paymentMethod === "priceList" ? "price_list" : "price_special";
    return this.cartSig().reduce((acc, item) => acc + item[key], 0);
  });

  public total = computed<number>(() => {
    return this.cartSig().length ? this.subtotal() + this.shipping : 0;
  });

  constructor() {
    this._store
      .select(selectProducts)
      .pipe(takeUntilDestroyed())
      .subscribe((products) => {
        this.cartSig.set(products);
      });
  }

  public isInvalid(controlName: string): boolean {
    const control = this.shippingForm.get(controlName);
    return !!control && control.invalid && control.touched;
  }

  public placeOrder(): void {
    if (this.shippingForm.invalid) {
      this.shippingForm.markAllAsTouched();
      return;
    }

    this._store.dispatch(clearCart());
    this._messageService.add({
      severity: "success",
      summary: "Order placed",
      detail: "Your order has been placed successfully.",
    });
    this._router.navigateByUrl("/");
  }
}
