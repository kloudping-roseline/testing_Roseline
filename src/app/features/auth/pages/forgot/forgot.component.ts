import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, DestroyRef, OnDestroy, OnInit, inject, signal } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { Store } from "@ngrx/store";

import { InputTextModule } from "primeng/inputtext";
import { ButtonModule } from "primeng/button";

import { resetPassword } from "../../store/auth.actions";
import { AuthState } from "../../interfaces/auth.interface";
import { selectForgotSuccess } from "../../store/auth.selectors";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

@Component({
  selector: "app-forgot",
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  template: `
    <div class="flex justify-content-center align-items-center px-2 min-h-40rem">
      <div class="card w-30rem shadow-6 p-6">
        @if (!forgotStepSig()) {
          <form [formGroup]="forgotForm" autocomplete="on">
            <div class="flex justify-content-between align-items-center mb-3">
              <p-button
                icon="pi pi-arrow-left"
                size="small"
                rounded="true"
                routerLink="/auth/iniciar-sesion"
                title="Back"
                [text]="true"
              />
              <h2 class="text-3xl font-bold white-space-nowrap m-0">Forgot my password</h2>
            </div>
            <div class="flex justify-content-center">
              <i class="pi pi-lock text-8xl text-color-secondary mt-4 mb-2"></i>
            </div>
            <div class="flex flex-column justify-content-between gap-4">
              <p class="text-500 px-3">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              <div class="flex flex-column gap-2 px-3">
                <span class="w-full p-float-label">
                  <input
                    pInputText
                    id="email"
                    name="email"
                    type="text"
                    class="w-full"
                    autocomplete="email"
                    formControlName="email"
                  />
                  <label for="email">Email</label>
                </span>
                @if (forgotForm.get("email")?.invalid && forgotForm.get("email")?.touched) {
                  <small class="p-error block" *ngIf="forgotForm.get('email')?.errors?.['required']">
                    Email is required.
                  </small>
                  <small class="p-error block" *ngIf="forgotForm.get('email')?.errors?.['email']">
                    Invalid email.
                  </small>
                }
              </div>
              <p-button
                styleClass="w-full mt-3"
                severity="secondary"
                label="Reset password"
                (onClick)="onForgotPasswordClick()"
              />
            </div>
          </form>
        } @else {
          <div class="flex flex-column justify-content-center align-items-center gap-2">
            <i class="pi pi-check-circle text-8xl text-color-secondary"></i>
            <p class="text-500 px-3">
              The password reset link has been sent successfully to your email address.
            </p>
          </div>
          <p-button
            styleClass="w-full mt-5"
            severity="secondary"
            label="Back to sign in"
            routerLink="/auth/iniciar-sesion"
          />
        }
      </div>
    </div>
  `,
  styles: `
    .min-h-40rem {
      min-height: 40rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ForgotComponent implements OnInit, OnDestroy {
  private readonly _formBuilder = inject(FormBuilder);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _store = inject(Store<{ auth: AuthState }>);

  public forgotStepSig = signal<boolean>(false);

  public readonly forgotForm: FormGroup = this._formBuilder.group({
    email: this._formBuilder.control("", {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    this._store
      .select(selectForgotSuccess)
      .pipe(takeUntilDestroyed(this._destroyRef))
      .subscribe((success) => {
        if (success) {
          this.forgotStepSig.set(success);
        }
      });
  }

  ngOnDestroy(): void {
    this.forgotStepSig.set(false);
  }

  public onForgotPasswordClick(): void {
    const email = this.forgotForm.value;
    if (this.forgotForm.valid) {
      this._store.dispatch(resetPassword(email));
    } else {
      this.forgotForm.markAllAsTouched();
    }
  }
}
