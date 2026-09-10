import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, Component, HostListener, signal } from "@angular/core";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-scroll-top",
  standalone: true,
  imports: [CommonModule, ButtonModule],
  template: `
    @if (visible()) {
      <p-button
        styleClass="border-circle fixed bottom-0 right-0 m-4 z-5"
        icon="pi pi-arrow-up"
        severity="warning"
        (onClick)="scrollToTop()"
      />
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollTopComponent {
  public visible = signal<boolean>(false);

  @HostListener("window:scroll")
  public onWindowScroll(): void {
    this.visible.set(window.scrollY > 400);
  }

  public scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
