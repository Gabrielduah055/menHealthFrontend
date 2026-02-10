import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-add',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent {
  productName: string = '';
  description: string = '';
  selectedCategory: string = '';
  selectedBrand: string = '';
  selectedStatus: string = 'Active'; 
  price: number = 0;
  stockQty: number = 0;
  
  tags: string[] = ['Organic', 'Vitamins'];
  newTag: string = '';
  
  expiryDate: string = '';
  selectedFiles: File[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  onFileSelected(event: any) {
    if (event.target.files) {
      this.selectedFiles = Array.from(event.target.files);
    }
  }

  addTag() {
    if (this.newTag && !this.tags.includes(this.newTag)) {
      this.tags.push(this.newTag);
      this.newTag = '';
    }
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter(t => t !== tag);
  }

  onSubmit() {
    const formData = new FormData();
    formData.append('name', this.productName);
    formData.append('description', this.description);
    
    // Generate a simple slug
    const slug = this.productName.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    formData.append('slug', slug);
    
    formData.append('price', this.price.toString());
    formData.append('stockQty', this.stockQty.toString());
    formData.append('isActive', (this.selectedStatus === 'Active').toString());
    
    // Append tags as separate fields or JSON string? 
    // Sending as JSON string is often safer with FormData/Multer mix
    // But let's append individually which usually results in an array on backend
    this.tags.forEach(tag => formData.append('tags', tag));

    this.selectedFiles.forEach(file => {
      formData.append('images', file);
    });
    
    this.productService.createProduct(formData).subscribe({
      next: (res) => {
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error creating product:', err);
        // Handle error (e.g. show message)
      }
    });
  }
}
