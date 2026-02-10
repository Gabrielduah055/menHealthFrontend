import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-customer-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent {
  customer = {
    name: 'Alex Johnson',
    type: 'Premium Member',
    since: 'January 12, 2023',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 908-1234',
    address: '123 Wellness Way, Suite 400\nSan Francisco, CA 94105',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    totalSpent: '$1,245.20',
    ordersCount: 12,
    supportTickets: 1
  };

  orders = [
    { id: '#HP-9921', date: 'Oct 12, 2023', status: 'Delivered', statusColor: 'bg-green-100 text-green-700', items: 'Multitamins, Whey Protein', total: '$124.50' },
    { id: '#HP-8842', date: 'Sep 05, 2023', status: 'Delivered', statusColor: 'bg-green-100 text-green-700', items: 'Omega-3 Fish Oil', total: '$45.00' },
    { id: '#HP-7712', date: 'Aug 14, 2023', status: 'Returned', statusColor: 'bg-red-100 text-red-700', items: 'Yoga Mat - Pro Grip', total: '$89.20' },
    { id: '#HP-6523', date: 'Jul 20, 2023', status: 'Delivered', statusColor: 'bg-green-100 text-green-700', items: 'Kettlebell 15lbs, Resistance Bands', total: '$65.50' },
    { id: '#HP-5501', date: 'Jun 10, 2023', status: 'Delivered', statusColor: 'bg-green-100 text-green-700', items: 'Organic Protein Bars (Box of 12)', total: '$32.00' }
  ];

  notes = [
    { text: 'Prefers eco-friendly packaging only. Requested early delivery for Whey Protein subscriptions.', author: 'Admin Sarah', date: 'Oct 15, 2023' },
    { text: 'Enquired about bulk discounts for gym membership affiliation.', author: 'Admin Mike', date: 'Sep 22, 2023' }
  ];

  activeTab: string = 'Order History';
  tabs = ['Order History', 'Health Profile', 'Refunds & Tickets'];
}
