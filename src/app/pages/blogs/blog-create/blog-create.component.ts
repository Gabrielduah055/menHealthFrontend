import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../core/services/blog.service';
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

  categories: any[] = [];
  selectedCategory: string = '';

  tags: string[] = [];
  newTag: string = '';
  selectedFile: File | null = null;
  filePreview: string | ArrayBuffer | null = null;

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ 'align': [] }],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['image', 'video'],
        ['link', 'code-block']
      ]
    },
    blotFormatter: {}
  };


  constructor(private blogService: BlogService, private router: Router, private http: HttpClient) {
    this.fetchCategories();
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

  onSubmit() {
    const formData = new FormData();
    formData.append('title', this.postTitle);
    formData.append('content', this.postContent);
    formData.append('excerpt', this.excerpt || this.postContent.substring(0, 150) + '...');

    const slug = this.postTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now();
    formData.append('slug', slug);

    if (this.selectedCategory) {
      formData.append('category', this.selectedCategory);
    }

    formData.append('allowComments', String(this.allowComments));

    this.tags.forEach(tag => formData.append('tags', tag));

    if (this.selectedFile) {
      formData.append('coverImage', this.selectedFile);
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

  saveDraft() {
    // Logic for draft vs publish could be added here
    this.onSubmit();
  }
}
