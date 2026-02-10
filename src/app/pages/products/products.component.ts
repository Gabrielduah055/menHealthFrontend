import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'All Categories';
  selectedStock: string = 'Stock Status';

  products: any[] = [];
  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data.map(product => ({
          id: product._id,
          displayId: 'PROD-' + product._id.substring(product._id.length - 4).toUpperCase(),
          name: product.name,
          category: 'Health', 
          price: 'GHS ' + product.price,
          status: product.stockQty > 10 ? 'In Stock' : (product.stockQty > 0 ? 'Low Stock' : 'Out of Stock'),
          statusClass: product.stockQty > 10 ? 'bg-green-100 text-green-700' : (product.stockQty > 0 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'),
          image: product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/500x500?text=No+Image'
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.loading = false;
      }
    });
  }
}
