import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent {
  // Product Data
  productTitle: string = 'Digital Blood Pressure Monitor';
  description: string = 'Professional-grade digital blood pressure monitor with adjustable cuff and large LCD display. Features heartbeat detection and memory storage for two users. Clinically validated for accuracy and reliability.';
  brand: string = 'HealthEase';
  category: string = 'Medical Devices';
  
  regularPrice: string = '69.99';
  salePrice: string = '49.99';
  sku: string = 'HE-BPM-2024';
  
  stockQuantity: number = 482;
  lowStockAlert: number = 50;

  status: string = 'ACTIVE';
  visibility: string = 'Public';

  productImages = [
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60',
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  ];

  activeTab: string = 'General Info';
  tabs = ['General Info', 'Inventory & Pricing', 'Shipping & Logistics'];

  incrementStock() {
    this.stockQuantity++;
  }

  decrementStock() {
    if (this.stockQuantity > 0) this.stockQuantity--;
  }
}
