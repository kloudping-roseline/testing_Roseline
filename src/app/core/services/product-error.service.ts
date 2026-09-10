import { Injectable, signal, WritableSignal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class ProductErrorService {
  public productNotFoundSig: WritableSignal<boolean> = signal(false);
}
