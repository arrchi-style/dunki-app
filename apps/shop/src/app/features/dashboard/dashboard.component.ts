import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RestaurantDetailComponent } from '../restaurant-detail/restaurant-detail.component';

@Component({
  selector: 'app-dashboard',
  imports: [RestaurantDetailComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Dashboard {}
