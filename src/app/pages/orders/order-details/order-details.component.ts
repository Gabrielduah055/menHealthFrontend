import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent {
  orderId: string = '#84920';
  orderDate: string = 'October 24, 2023 at 2:15 PM';
  status: string = 'Pending';
  
  customer = {
    name: 'Jane Stevens',
    initials: 'JS',
    since: '2021',
    email: 'jane.stevens@example.com',
    phone: '+1 (555) 012-3456',
    address: '123 Wellness Blvd, Ste 402\nPalo Alto, CA 94301\nUnited States',
  };

  items = [
    {
      name: 'Premium Whey Protein',
      variant: 'Vanilla Blast - 2kg',
      sku: 'WHEY-001',
      price: '$45.00',
      quantity: 1,
      total: '$45.00',
      image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60'
    },
    {
      name: 'Daily Multivitamins',
      variant: '60 Capsules',
      sku: 'VIT-042',
      price: '$25.00',
      quantity: 2,
      total: '$50.00',
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60'
    }
  ];

  shipping = {
    method: 'Express Shipping (2-3 Days)',
    carrier: 'FedEx Health-Logistics',
    tracking: '#FX-8293-1022'
  };

  summary = {
    subtotal: '$95.00',
    shipping: '$12.00',
    tax: '$7.60',
    total: '$114.60'
  };

  timeline = [
    { status: 'Pending', date: 'Oct 24, 14:15', completed: true, icon: 'uil-clock' },
    { status: 'Paid', date: 'Oct 24, 14:30', completed: true, icon: 'uil-money-bill' },
    { status: 'Shipped', date: 'Estimated Oct 25', completed: false, icon: 'uil-truck' },
    { status: 'Delivered', date: 'Estimated Oct 27', completed: false, icon: 'uil-box' }
  ];

  payment = {
    method: 'Visa ending in 4242',
    expiry: 'Expires 04/26',
    status: 'PAID',
    transactionId: 'TX_8293841923',
    billingZip: '94301'
  };
}
