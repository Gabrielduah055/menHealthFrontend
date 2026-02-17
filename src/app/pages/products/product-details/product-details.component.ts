import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('detailDescriptionEditor') detailDescriptionEditor!: ElementRef<HTMLDivElement>;
  productId = '';
  loading = true;
  saving = false;
  isEditMode = false;
  errorMessage = '';
  successMessage = '';

  // View model
  productName = '';
  description = '';
  slug = '';
  price = 0;
  stockQty = 0;
  isActive = true;
  images: string[] = [];
  selectedImageIndex = 0;

  // Edit model
  editName = '';
  editDescription = '';
  editSlug = '';
  editPrice = 0;
  editStockQty = 0;
  editIsActive = true;
  editExistingImages: string[] = [];
  newThumbnailFiles: File[] = [];
  newThumbnailPreviews: string[] = [];
  replacementMainImageFile: File | null = null;
  replacementMainImagePreview: string | null = null;
  editErrorMessage = '';

  // Rich text editor active format tracking
  activeFormats: Record<string, boolean> = {
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    insertUnorderedList: false,
    insertOrderedList: false,
  };

  private selectionListener = () => this.updateActiveFormats();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) { }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id') || '';
    if (!this.productId) {
      this.loading = false;
      this.errorMessage = 'Product ID is missing.';
      return;
    }
    this.loadProduct();
  }

  get mainImage(): string {
    if (this.images.length === 0) return '';
    return this.images[this.selectedImageIndex] || this.images[0];
  }

  get thumbnails(): string[] {
    return this.images.slice(0, 4);
  }

  private loadProduct() {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.productService.getProduct(this.productId).subscribe({
      next: (product) => {
        this.productName = product.name || '';
        this.description = product.description || '';
        this.slug = product.slug || '';
        this.price = Number(product.price || 0);
        this.stockQty = Number(product.stockQty || 0);
        this.isActive = !!product.isActive;
        this.images = Array.isArray(product.images) ? [...product.images] : [];
        if (this.selectedImageIndex > this.images.length - 1) this.selectedImageIndex = 0;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading product details', err);
        this.errorMessage = err?.error?.message || 'Failed to load product.';
        this.loading = false;
      },
    });
  }

  enterEditMode() {
    this.isEditMode = true;
    this.editName = this.productName;
    this.editDescription = this.description;
    this.editSlug = this.slug;
    this.editPrice = this.price;
    this.editStockQty = this.stockQty;
    this.editIsActive = this.isActive;
    this.editExistingImages = [...this.images];
    this.newThumbnailFiles = [];
    this.newThumbnailPreviews = [];
    this.replacementMainImageFile = null;
    this.replacementMainImagePreview = null;
    this.editErrorMessage = '';

    // Load edit description into contentEditable after view updates
    setTimeout(() => {
      if (this.detailDescriptionEditor?.nativeElement && this.editDescription) {
        this.detailDescriptionEditor.nativeElement.innerHTML = this.editDescription;
      }
    });
  }

  cancelEditMode() {
    this.isEditMode = false;
    this.editErrorMessage = '';
  }

  ngAfterViewInit() {
    document.addEventListener('selectionchange', this.selectionListener);
  }

  ngOnDestroy() {
    document.removeEventListener('selectionchange', this.selectionListener);
  }

  updateActiveFormats() {
    const commands = ['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList'];
    for (const cmd of commands) {
      this.activeFormats[cmd] = document.queryCommandState(cmd);
    }
  }

  execFormat(command: string) {
    this.detailDescriptionEditor?.nativeElement.focus();
    document.execCommand(command, false);
    this.updateActiveFormats();
    this.syncEditDescription();
  }

  execFormatBlock(tag: string) {
    this.detailDescriptionEditor?.nativeElement.focus();
    document.execCommand('formatBlock', false, tag);
    this.syncEditDescription();
  }

  execInsertLink() {
    const url = prompt('Enter the URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
    this.detailDescriptionEditor?.nativeElement.focus();
    this.syncEditDescription();
  }

  onDetailDescriptionInput(event: Event) {
    const el = event.target as HTMLElement;
    this.editDescription = el.innerHTML;
    this.updateActiveFormats();
  }

  private syncEditDescription() {
    if (this.detailDescriptionEditor?.nativeElement) {
      this.editDescription = this.detailDescriptionEditor.nativeElement.innerHTML;
    }
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  setMainFromExisting(index: number) {
    if (index < 0 || index >= this.editExistingImages.length) return;
    const [selected] = this.editExistingImages.splice(index, 1);
    this.editExistingImages.unshift(selected);
  }

  removeExistingImage(index: number) {
    this.editExistingImages = this.editExistingImages.filter((_, i) => i !== index);
  }

  onReplaceMainImage(event: any) {
    if (!event.target.files || event.target.files.length === 0) return;
    this.replacementMainImageFile = event.target.files[0];
    const replacementMainImageFile = this.replacementMainImageFile;
    const reader = new FileReader();
    reader.onload = () => {
      this.replacementMainImagePreview = typeof reader.result === 'string' ? reader.result : null;
    };
    if (replacementMainImageFile) {
      reader.readAsDataURL(replacementMainImageFile);
    }
    event.target.value = '';
  }

  onAddThumbnails(event: any) {
    if (!event.target.files) return;
    const files = Array.from(event.target.files) as File[];
    const existingThumbCount = Math.max(this.editExistingImages.length - 1, 0);
    const maxNewThumbSlots = 3 - existingThumbCount - this.newThumbnailFiles.length;

    if (files.length > maxNewThumbSlots) {
      this.editErrorMessage = `You can add only ${Math.max(maxNewThumbSlots, 0)} more thumbnail(s).`;
      event.target.value = '';
      return;
    }

    files.forEach((file) => {
      this.newThumbnailFiles.push(file);
      const reader = new FileReader();
      reader.onload = () => {
        const result = typeof reader.result === 'string' ? reader.result : '';
        if (result) this.newThumbnailPreviews.push(result);
      };
      reader.readAsDataURL(file);
    });
    this.editErrorMessage = '';
    event.target.value = '';
  }

  removeNewThumbnail(index: number) {
    this.newThumbnailFiles = this.newThumbnailFiles.filter((_, i) => i !== index);
    this.newThumbnailPreviews = this.newThumbnailPreviews.filter((_, i) => i !== index);
  }

  saveChanges() {
    const finalExistingImages = [...this.editExistingImages];

    if (this.replacementMainImageFile) {
      // Existing main image is replaced with uploaded file.
      finalExistingImages.shift();
    }

    const finalCount =
      finalExistingImages.length +
      (this.replacementMainImageFile ? 1 : 0) +
      this.newThumbnailFiles.length;

    if (finalCount === 0) {
      this.editErrorMessage = 'Main image is required.';
      return;
    }

    if (finalCount > 4) {
      this.editErrorMessage = 'Maximum 4 images allowed (1 main + 3 thumbnails).';
      return;
    }

    this.saving = true;
    this.editErrorMessage = '';
    this.errorMessage = '';
    this.successMessage = '';

    const formData = new FormData();
    formData.append('name', this.editName);
    formData.append('description', this.editDescription);
    formData.append('slug', this.editSlug || this.editName.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    formData.append('price', String(this.editPrice || 0));
    formData.append('stockQty', String(this.editStockQty || 0));
    formData.append('isActive', String(this.editIsActive));

    finalExistingImages.forEach((image) => formData.append('images', image));

    const replacementMainImageFile = this.replacementMainImageFile;
    if (replacementMainImageFile) {
      // Uploaded files are appended after existing images by backend.
      // We prepend the replacement main image by keeping existing main removed above.
      formData.append('images', replacementMainImageFile);
    }
    this.newThumbnailFiles.forEach((file) => formData.append('images', file));

    this.productService.updateProduct(this.productId, formData).subscribe({
      next: () => {
        this.saving = false;
        this.isEditMode = false;
        this.successMessage = 'Product updated successfully.';
        this.loadProduct();
      },
      error: (err) => {
        console.error('Error updating product', err);
        this.editErrorMessage = err?.error?.message || 'Failed to update product.';
        this.saving = false;
      },
    });
  }

  goBackToProducts() {
    this.router.navigate(['/products']);
  }
}
