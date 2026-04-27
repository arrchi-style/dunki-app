import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { CartService } from '../restaurant-detail/data-access/cart.service';
import { CheckoutService } from './data-access/checkout.service';
import { OrderForm } from './data-access/order.model';

@Component({
  selector: 'app-checkout',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
  ],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutComponent {
  cartService = inject(CartService);
  checkoutService = inject(CheckoutService);
  private router = inject(Router);

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]),
    address: new FormControl('', Validators.required),
    paymentMethod: new FormControl('', Validators.required),
  });

  isFormValid = toSignal(this.form.statusChanges, { initialValue: this.form.status });
  isCartEmpty = computed(() => this.checkoutService.isCartEmpty());
  isButtonDisabled = computed(() => this.isFormValid() !== 'VALID' || this.isCartEmpty() || this.checkoutService.isProcessing());

  async placeOrder(): Promise<void> {
    if (this.form.valid && !this.isCartEmpty() && !this.checkoutService.isProcessing()) {
      try {
        const orderForm: OrderForm = {
          name: this.form.value.name!,
          phone: this.form.value.phone!,
          address: this.form.value.address!,
          paymentMethod: this.form.value.paymentMethod! as 'cash' | 'card'
        };

        const result = await this.checkoutService.processOrder(orderForm);

        if (result.success) {
          console.log('Order placed successfully:', result.order);
          // Navigate back to menu or show success message
          this.router.navigate(['/']);
        } else {
          console.error('Order failed:', result.error);
          // Show error message to user
        }
      } catch (error) {
        console.error('Order processing error:', error);
      }
    }
  }

  goBackToMenu(): void {
    this.router.navigate(['/']);
  }
}
