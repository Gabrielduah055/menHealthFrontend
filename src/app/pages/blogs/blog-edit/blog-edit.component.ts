import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BlogService } from '../../../core/services/blog.service';
import { QuillModule } from 'ngx-quill';
import { HttpClient } from '@angular/common/http';
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
  allowComments: boolean = true;
  
  // Comments
  comments: any[] = [];
  newAdminReply: string = '';
  replyingToCommentId: string | null = null;

  quillConfig = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ 'align': [] }],
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
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.postId = this.route.snapshot.paramMap.get('id') || '';
    this.fetchCategories();
    this.fetchPost();
    this.fetchComments();
  }

  fetchCategories() {
    this.http.get<any[]>('https://menhealthbackend.onrender.com/api/categories').subscribe({
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
            this.selectedCategory = post.category;
            this.tags = post.tags || [];
            this.coverImageUrl = post.coverImageUrl;
            this.allowComments = post.allowComments;
            this.publishDate = post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published';
        },
        error: (err) => console.error('Error fetching post', err)
    });
  }

  fetchComments() {
    if (!this.postId) return;
    this.http.get<any[]>(`https://menhealthbackend.onrender.com/api/admin/comments/blogs/${this.postId}`).subscribe({
        next: (comments) => this.comments = comments,
        error: (err) => console.error('Error fetching comments', err)
    });
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

  onUpdate() {
    const formData = new FormData();
    formData.append('title', this.postTitle);
    formData.append('content', this.postContent);
    formData.append('excerpt', this.excerpt);
    formData.append('slug', this.slug);
    if (this.selectedCategory) formData.append('category', this.selectedCategory);
    this.tags.forEach(tag => formData.append('tags', tag));
    formData.append('allowComments', String(this.allowComments));
    
    this.blogService.updateBlog(this.postId, formData).subscribe({
        next: (res) => alert('Post updated successfully'),
        error: (err) => console.error('Error updating post', err)
    });
  }

  // Comment Actions
  toggleApprove(commentId: string) {
      this.http.patch(`https://menhealthbackend.onrender.com/api/admin/comments/${commentId}/approve`, {}).subscribe({
          next: () => this.fetchComments(),
          error: (err) => console.error('Error approving comment', err)
      });
  }

  deleteComment(commentId: string) {
      if(!confirm('Are you sure?')) return;
      this.http.delete(`https://menhealthbackend.onrender.com/api/admin/comments/${commentId}`).subscribe({
          next: () => this.fetchComments(),
          error: (err) => console.error('Error deleting comment', err)
      });
  }

  replyToComment(commentId: string) {
      if (!this.newAdminReply) return;
      this.http.post(`https://menhealthbackend.onrender.com/api/admin/comments/${commentId}/reply`, { content: this.newAdminReply }).subscribe({
          next: () => {
              this.newAdminReply = '';
              this.replyingToCommentId = null;
              this.fetchComments();
          },
          error: (err) => console.error('Error replying', err)
      });
  }
}
