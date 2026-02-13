import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../core/services/blog.service';
import { AuthService } from '../../../core/services/auth.service';
import { QuillModule } from 'ngx-quill';
import { HttpClient } from '@angular/common/http';
// @ts-ignore
import Quill from 'quill';
// @ts-ignore
import BlotFormatter from 'quill-blot-formatter';
import { environment } from '../../../../environments/environment';

Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-blog-create',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, QuillModule],
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.css']
})
export class BlogCreateComponent {
  postTitle: string = '';
  postContent: string = '';
  excerpt: string = '';
  allowComments: boolean = true;
  regenerateStructured: boolean = false;

  categories: any[] = [];
  selectedCategory: string = '';

  tags: string[] = [];
  newTag: string = '';
  topics: string[] = [];
  newTopic: string = '';
  sections: { title: string; body: string }[] = [{ title: '', body: '' }];
  quote: string = '';
  readTime: string = '';
  featuredLabel: string = '';
  isFeatured: boolean = false;

  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;
  galleryFiles: File[] = [];
  galleryPreviews: string[] = [];

  authorName = 'Admin';
  authorRole = 'Administrator';
  authorAvatarLabel = 'AD';

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ 'align': [] }],
        [{ 'header': [2, 3, false] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['image', 'video'],
        ['link', 'code-block']
      ]
    },
    blotFormatter: {}
  };


  constructor(
    private blogService: BlogService,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.fetchCategories();
    this.setAuthorDetails();
  }

  private setAuthorDetails() {
    const currentUser = this.authService.currentUserValue;
    if (!currentUser) return;
    this.authorName = currentUser.name || this.authorName;
    this.authorRole = currentUser.authorRole || this.authorRole;
    this.authorAvatarLabel =
      currentUser.avatarLabel || this.buildAvatarLabel(this.authorName);
  }

  private buildAvatarLabel(name: string): string {
    const initials = name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
    return initials || 'AD';
  }

  fetchCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe({
      next: (cats) => {
        this.categories = cats;
        if (cats.length > 0) this.selectedCategory = cats[0]._id;
      },
      error: (err) => console.error('Error fetching categories', err)
    });
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      // Preview
      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = reader.result;
      };
      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
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

  addTopic() {
    if (this.newTopic && !this.topics.includes(this.newTopic)) {
      this.topics.push(this.newTopic);
      this.newTopic = '';
    }
  }

  removeTopic(topic: string) {
    this.topics = this.topics.filter(t => t !== topic);
  }

  addSection() {
    this.sections.push({ title: '', body: '' });
  }

  removeSection(index: number) {
    if (this.sections.length === 1) {
      this.sections = [{ title: '', body: '' }];
      return;
    }
    this.sections.splice(index, 1);
  }

  moveSection(index: number, direction: number) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= this.sections.length) return;
    const temp = this.sections[targetIndex];
    this.sections[targetIndex] = this.sections[index];
    this.sections[index] = temp;
  }

  onGallerySelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files) as File[];
      files.forEach((file) => {
        this.galleryFiles.push(file);
        const reader = new FileReader();
        reader.onload = () => {
          if (reader.result) this.galleryPreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeGalleryFile(index: number) {
    this.galleryFiles.splice(index, 1);
    this.galleryPreviews.splice(index, 1);
  }

  private submitPost(status: 'draft' | 'published') {
    const formData = new FormData();
    formData.append('title', this.postTitle);
    formData.append('content', this.postContent);
    formData.append('excerpt', this.excerpt || this.postContent.substring(0, 150) + '...');
    formData.append('status', status);

    const slug = this.postTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    formData.append('slug', slug);

    if (this.selectedCategory) {
      formData.append('category', this.selectedCategory);
    }

    formData.append('allowComments', String(this.allowComments));

    this.tags.forEach(tag => formData.append('tags', tag));
    formData.append('topics', JSON.stringify(this.topics));
    formData.append(
      'sections',
      JSON.stringify(this.sections.filter(section => section.title || section.body))
    );
    formData.append('quote', this.quote);
    formData.append('readTime', this.readTime);
    formData.append('featuredLabel', this.featuredLabel);
    formData.append('isFeatured', String(this.isFeatured));
    formData.append('regenerateStructured', String(this.regenerateStructured));

    if (this.selectedFile) {
      formData.append('coverImage', this.selectedFile);
    }
    if (this.galleryFiles.length > 0) {
      this.galleryFiles.forEach((file) => formData.append('galleryImages', file));
    }

    this.blogService.createBlog(formData).subscribe({
      next: (res) => {
        this.router.navigate(['/blogs']);
      },
      error: (err) => {
        console.error('Error creating blog:', err);
      }
    });
  }

  onSubmit() {
    this.submitPost('published');
  }

  saveDraft() {
    this.submitPost('draft');
  }
}
