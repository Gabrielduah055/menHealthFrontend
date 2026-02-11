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
  selectedStock: string = 'All Stock';
  selectedSort: string = 'Newest';

  allProducts: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = ['All Categories'];
  loading = true;
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.allProducts = data.map((product) => {
          const stockQty = Number(product.stockQty ?? 0);
          const priceValue = Number(product.price ?? 0);
          const categoryValue =
            typeof product.category === 'object' ? product.category?.name : product.category;

          return {
          id: product._id,
          displayId: 'PROD-' + product._id.substring(product._id.length - 4).toUpperCase(),
          name: product.name,
          category: categoryValue || 'General',
          createdAt: product.createdAt ? new Date(product.createdAt).getTime() : 0,
          updatedAt: product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A',
          priceValue,
          price: 'GHS ' + priceValue.toLocaleString(),
          stockQty,
          status: stockQty > 10 ? 'In Stock' : (stockQty > 0 ? 'Low Stock' : 'Out of Stock'),
          statusClass: stockQty > 10 ? 'bg-green-100 text-green-700' : (stockQty > 0 ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'),
          image: product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/500x500?text=No+Image'
          };
        });

        this.categories = [
          'All Categories',
          ...Array.from(new Set(this.allProducts.map((product) => product.category))).sort()
        ];

        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products', err);
        this.errorMessage = err?.error?.message || 'Unable to load products. Please try again.';
        this.loading = false;
      }
    });
  }

  applyFilters() {
    let list = [...this.allProducts];
    const query = this.searchTerm.trim().toLowerCase();

    if (query) {
      list = list.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.displayId.toLowerCase().includes(query)
      );
    }

    if (this.selectedCategory !== 'All Categories') {
      list = list.filter((product) => product.category === this.selectedCategory);
    }

    if (this.selectedStock !== 'All Stock') {
      list = list.filter((product) => product.status === this.selectedStock);
    }

    switch (this.selectedSort) {
      case 'Oldest':
        list.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'Price: Low to High':
        list.sort((a, b) => a.priceValue - b.priceValue);
        break;
      case 'Price: High to Low':
        list.sort((a, b) => b.priceValue - a.priceValue);
        break;
      case 'Name: A-Z':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        list.sort((a, b) => b.createdAt - a.createdAt);
        break;
    }

    this.filteredProducts = list;
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedCategory = 'All Categories';
    this.selectedStock = 'All Stock';
    this.selectedSort = 'Newest';
    this.applyFilters();
  }

  get hasActiveFilters(): boolean {
    return !!this.searchTerm.trim() || this.selectedCategory !== 'All Categories' || this.selectedStock !== 'All Stock' || this.selectedSort !== 'Newest';
  }
}
