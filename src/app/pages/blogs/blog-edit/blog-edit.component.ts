import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../core/services/blog.service';
import { AuthService } from '../../../core/services/auth.service';
import { QuillModule } from 'ngx-quill';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
// @ts-ignore
import Quill from 'quill';
// @ts-ignore
import BlotFormatter from 'quill-blot-formatter';

Quill.register('modules/blotFormatter', BlotFormatter);

@Component({
  selector: 'app-blog-edit',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, QuillModule],
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css']
})
export class BlogEditComponent implements OnInit {
  postId: string = '';
  postTitle: string = '';
  postContent: string = '';
  excerpt: string = '';
  
  categories: any[] = [];
  selectedCategory: string = '';
  
  tags: string[] = [];
  newTag: string = '';
  
  slug: string = '';
  status: string = 'draft';
  publishDate: string = '';
  coverImageUrl: string = '';
  selectedFile: File | null = null;
  filePreview: string | null = null;
  allowComments: boolean = true;
  regenerateStructured: boolean = false;

  sections: { title: string; body: string }[] = [{ title: '', body: '' }];
  quote: string = '';
  readTime: string = '';
  topics: string[] = [];
  newTopic: string = '';
  featuredLabel: string = '';
  isFeatured: boolean = false;
  existingGallery: string[] = [];
  galleryFiles: File[] = [];
  galleryPreviews: string[] = [];

  authorName = 'Admin';
  authorRole = 'Administrator';
  authorAvatarLabel = 'AD';
  
  // Comments
  comments: any[] = [];
  newAdminReply: string = '';
  replyingToCommentId: string | null = null;

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ 'align': [] }],
        [{ 'header': [2, 3, false] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['image', 'video'],
        ['link', 'code-block']
      ]
    },
    blotFormatter: {} 
  };

  constructor(
    private blogService: BlogService, 
    private route: ActivatedRoute, 
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.setAuthorDetailsFromSession();
  }

  private setAuthorDetailsFromSession() {
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

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchCategories();
    this.fetchPost();
    this.fetchComments();
  }

  fetchCategories() {
    this.http.get<any[]>(`${environment.apiUrl}/categories`).subscribe({
        next: (cats) => this.categories = cats,
        error: (err) => console.error('Error fetching categories', err)
    });
  }

  fetchPost() {
    if (!this.postId) return;
    this.blogService.getBlog(this.postId).subscribe({
        next: (post) => {
            this.postTitle = post.title;
            this.postContent = post.content;
            this.excerpt = post.excerpt;
            this.slug = post.slug;
            this.status = post.status;
            this.selectedCategory = typeof post.category === 'object' ? post.category?._id : post.category;
            this.tags = post.tags || [];
            this.coverImageUrl = post.coverImageUrl;
            this.allowComments = post.allowComments;
            this.publishDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published';
            this.sections = post.sections && post.sections.length > 0 ? post.sections : [{ title: '', body: '' }];
            this.quote = post.quote || '';
            this.readTime = post.readTime || '';
            this.topics = post.topics || [];
            this.featuredLabel = post.featuredLabel || '';
            this.isFeatured = !!post.isFeatured;
            this.existingGallery = post.gallery || [];

            if (post.author) {
                this.authorName = post.author.name || this.authorName;
                this.authorRole = post.author.role || this.authorRole;
                this.authorAvatarLabel = post.author.avatarLabel || this.authorAvatarLabel;
            }
        },
        error: (err) => console.error('Error fetching post', err)
    });
  }

  fetchComments() {
    if (!this.postId) return;
    this.http.get<any[]>(`${environment.apiUrl}/admin/comments/blogs/${this.postId}`).subscribe({
        next: (comments) => this.comments = comments,
        error: (err) => console.error('Error fetching comments', err)
    });
  }

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.filePreview = typeof reader.result === 'string' ? reader.result : null;
      };
      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
    }
  }

  get coverImagePreviewUrl(): string {
    return this.filePreview || this.coverImageUrl;
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

  removeExistingGallery(index: number) {
    this.existingGallery.splice(index, 1);
  }

  onUpdate() {
    const formData = new FormData();
    formData.append('title', this.postTitle);
    formData.append('content', this.postContent);
    formData.append('excerpt', this.excerpt);
    formData.append('slug', this.slug);
    if (this.selectedCategory) formData.append('category', this.selectedCategory);
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
    formData.append('allowComments', String(this.allowComments));
    if (this.selectedFile) formData.append('coverImage', this.selectedFile);
    formData.append('gallery', JSON.stringify(this.existingGallery));
    if (this.galleryFiles.length > 0) {
      this.galleryFiles.forEach((file) => formData.append('galleryImages', file));
    }
    
    this.blogService.updateBlog(this.postId, formData).subscribe({
        next: (res) => alert('Post updated successfully'),
        error: (err) => console.error('Error updating post', err)
    });
  }

  // Comment Actions
  toggleApprove(commentId: string) {
      this.http.patch(`${environment.apiUrl}/admin/comments/${commentId}/approve`, {}).subscribe({
          next: () => this.fetchComments(),
          error: (err) => console.error('Error approving comment', err)
      });
  }

  deleteComment(commentId: string) {
      if(!confirm('Are you sure?')) return;
      this.http.delete(`${environment.apiUrl}/admin/comments/${commentId}`).subscribe({
          next: () => this.fetchComments(),
          error: (err) => console.error('Error deleting comment', err)
      });
  }

  replyToComment(commentId: string) {
      if (!this.newAdminReply) return;
      this.http.post(`${environment.apiUrl}/admin/comments/${commentId}/reply`, { content: this.newAdminReply }).subscribe({
          next: () => {
              this.newAdminReply = '';
              this.replyingToCommentId = null;
              this.fetchComments();
          },
          error: (err) => console.error('Error replying', err)
      });
  }
}
