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
  mainImageFile: File | null = null;
  mainImagePreview: string | null = null;
  thumbnailFiles: File[] = [];
  thumbnailPreviews: string[] = [];
  imageErrorMessage = '';
  isSubmitting = false;

  constructor(private productService: ProductService, private router: Router) {}

  onMainImageSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.mainImageFile = event.target.files[0];
      const selectedMainImageFile = this.mainImageFile;
      const reader = new FileReader();
      reader.onload = () => {
        this.mainImagePreview = typeof reader.result === 'string' ? reader.result : null;
      };
      if (selectedMainImageFile) {
        reader.readAsDataURL(selectedMainImageFile);
      }
      this.imageErrorMessage = '';
    }
    event.target.value = '';
  }

  onThumbnailsSelected(event: any) {
    if (!event.target.files) return;
    const incoming = Array.from(event.target.files) as File[];
    const nextTotal = this.thumbnailFiles.length + incoming.length;
    if (nextTotal > 3) {
      this.imageErrorMessage = 'You can add up to 3 thumbnails only.';
      event.target.value = '';
      return;
    }

    incoming.forEach((file) => {
      this.thumbnailFiles.push(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        if (result) this.thumbnailPreviews.push(result);
      };
      reader.readAsDataURL(file);
    });
    this.imageErrorMessage = '';
    event.target.value = '';
  }

  removeMainImage() {
    this.mainImageFile = null;
    this.mainImagePreview = null;
  }

  removeThumbnail(index: number) {
    this.thumbnailFiles = this.thumbnailFiles.filter((_, i) => i !== index);
    this.thumbnailPreviews = this.thumbnailPreviews.filter((_, i) => i !== index);
  }

  private validateImages(): boolean {
    if (!this.mainImageFile) {
      this.imageErrorMessage = 'Main image is required.';
      return false;
    }
    if (this.thumbnailFiles.length > 3) {
      this.imageErrorMessage = 'You can add up to 3 thumbnails only.';
      return false;
    }
    this.imageErrorMessage = '';
    return true;
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
    if (!this.validateImages()) return;
    this.isSubmitting = true;

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

    // First image is main image, next images are thumbnails (max 3).
    formData.append('images', this.mainImageFile as File);
    this.thumbnailFiles.forEach(file => {
      formData.append('images', file);
    });
    
    this.productService.createProduct(formData).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error('Error creating product:', err);
        this.imageErrorMessage = err?.error?.message || 'Failed to create product.';
        this.isSubmitting = false;
      }
    });
  }
}
