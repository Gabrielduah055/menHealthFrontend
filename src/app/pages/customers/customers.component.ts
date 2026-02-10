import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../core/services/customer.service';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {
  customers: any[] = [];
  loading = true;

  constructor(private customerService: CustomerService) {}

  ngOnInit() {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data.map((customer, index) => ({
          id: index + 1, // Since there's no real ID
          name: customer.name,
          initials: this.getInitials(customer.name),
          initialsBg: this.getRandomColor(index),
          email: customer.email,
          phone: customer.phone,
          location: customer.location ? customer.location.split(',')[0] : 'Unknown', // Simple logic
          joinDate: new Date(customer.joinDate).toLocaleDateString(),
          totalOrders: customer.totalOrders,
          totalSpend: 'GHS ' + customer.totalSpend.toLocaleString(),
          status: 'Active',
          statusColor: 'bg-green-100 text-green-700'
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading customers', err);
        this.loading = false;
      }
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  getRandomColor(index: number): string {
    const colors = [
      'bg-purple-100 text-purple-600',
      'bg-blue-100 text-blue-600',
      'bg-green-100 text-green-600',
      'bg-orange-100 text-orange-600',
      'bg-pink-100 text-pink-600'
    ];
    return colors[index % colors.length];
  }
}
