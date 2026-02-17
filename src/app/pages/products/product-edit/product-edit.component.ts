import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit, AfterViewInit {
  @ViewChild('descriptionEditor') descriptionEditor!: ElementRef<HTMLDivElement>;
  productId = '';
  loading = true;
  saving = false;
  errorMessage = '';
  successMessage = '';

  // Product fields
  productTitle = '';
  description = '';
  regularPrice = '';
  stockQuantity = 0;
  sku = '';
  status = 'ACTIVE';

  // Reviews summary (kept as requested)
  averageRating = 4.8;
  reviewsCount = 0;

  existingImages: string[] = [];
  selectedFiles: File[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.productId) {
      this.loading = false;
      this.errorMessage = 'Product ID is missing.';
      return;
    }
    this.loadProduct();
  }

  loadProduct() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.getProduct(this.productId).subscribe({
      next: (product) => {
        this.productTitle = product.name || '';
        this.description = product.description || '';
        this.regularPrice = product.price?.toString() || '0';
        this.stockQuantity = Number(product.stockQty || 0);
        this.sku = product.slug || '';
        this.status = product.isActive ? 'ACTIVE' : 'INACTIVE';
        this.existingImages = Array.isArray(product.images) ? [...product.images] : [];
        this.reviewsCount = product.reviewsCount || 0;
        this.averageRating = product.averageRating || 4.8;
        this.loading = false;
        // Load description into the editor
        setTimeout(() => {
          if (this.descriptionEditor?.nativeElement && this.description) {
            this.descriptionEditor.nativeElement.innerHTML = this.description;
          }
        });
      },
      error: (err) => {
        console.error('Error loading product', err);
        this.errorMessage = err?.error?.message || 'Unable to load product details.';
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    if (this.description && this.descriptionEditor?.nativeElement) {
      this.descriptionEditor.nativeElement.innerHTML = this.description;
    }
  }

  execFormat(command: string) {
    document.execCommand(command, false);
    this.descriptionEditor?.nativeElement.focus();
  }

  execFormatBlock(tag: string) {
    document.execCommand('formatBlock', false, tag);
    this.descriptionEditor?.nativeElement.focus();
  }

  execInsertLink() {
    const url = prompt('Enter the URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
    this.descriptionEditor?.nativeElement.focus();
  }

  onDescriptionInput(event: Event) {
    const el = event.target as HTMLElement;
    this.description = el.innerHTML;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    if (files.length > 0) {
      this.selectedFiles = [...this.selectedFiles, ...files];
    }
    input.value = '';
  }

  removeExistingImage(index: number) {
    this.existingImages = this.existingImages.filter((_, idx) => idx !== index);
  }

  removeSelectedImage(index: number) {
    this.selectedFiles = this.selectedFiles.filter((_, idx) => idx !== index);
  }

  onSaveProduct() {
    if (!this.productTitle.trim()) {
      this.errorMessage = 'Product name is required.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('name', this.productTitle);
    formData.append('description', this.description);
    formData.append('slug', this.sku || this.productTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    formData.append('price', this.regularPrice || '0');
    formData.append('stockQty', String(this.stockQuantity || 0));
    formData.append('isActive', String(this.status === 'ACTIVE'));

    this.existingImages.forEach((image) => {
      formData.append('images', image);
    });
    this.selectedFiles.forEach((file) => {
      formData.append('images', file);
    });

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: () => {
        this.saving = false;
        this.successMessage = 'Product updated successfully.';
        this.selectedFiles = [];
        this.loadProduct();
      },
      error: (err) => {
        console.error('Error updating product', err);
        this.errorMessage = err?.error?.message || 'Failed to update product.';
        this.saving = false;
      }
    });
  }

  goBackToProducts() {
    this.router.navigate(['/products']);
  }
}
