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
  private router = inject(Router);

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\+?\d{10,15}$/)]),
    address: new FormControl('', Validators.required),
    paymentMethod: new FormControl('', Validators.required),
  });

  isFormValid = toSignal(this.form.statusChanges, { initialValue: this.form.status });
  isCartEmpty = computed(() => this.cartService.cartItems().length === 0);
  isButtonDisabled = computed(() => this.isFormValid() !== 'VALID' || this.isCartEmpty());

  placeOrder(): void {
    console.log('form: ', this.form);
    console.log('form: ', this.form.valid);

    if (this.form.valid && !this.isCartEmpty()) {
      console.log('Order placed', this.form.value);
      // TODO: Implement order submission logic
    }
  }

  goBackToMenu(): void {
    this.router.navigate(['/']);
  }
}
