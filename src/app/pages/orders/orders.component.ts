import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  selectedStatus: string = 'All Status';
  searchTerm: string = '';

  orders: any[] = [];
  loading = true;

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data.map(order => ({
          id: order._id, 
          displayId: '#ORD-' + order._id.substring(order._id.length - 4).toUpperCase(),
          customer: order.customer.name,
          customerEmail: order.customer.email,
          date: new Date(order.createdAt).toLocaleDateString(),
          items: order.items.length,
          total: 'GHS ' + order.totalAmount,
          status: order.status,
          statusClass: this.getStatusClass(order.status),
          payment: order.payment.method || 'Paystack' 
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading orders', err);
        this.loading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'delivered': return 'bg-green-100 text-green-700';
      case 'shipped': return 'bg-purple-100 text-purple-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'pending': return 'bg-orange-100 text-orange-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  }

  getCountByStatus(status: string): number {
    if (!this.orders) return 0;
    return this.orders.filter(o => o.status.toLowerCase() === status.toLowerCase()).length;
  }
}
