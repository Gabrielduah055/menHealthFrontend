import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.css']
})
export class CommentsComponent implements OnInit {
  comments: any[] = [];
  loading = true;
  searchTerm: string = '';
  
  replyContent: string = '';
  replyingToId: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchComments();
  }

  fetchComments() {
    this.http.get<any[]>('https://menhealthbackend.onrender.com/api/admin/comments').subscribe({
      next: (data) => {
        this.comments = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading comments', err);
        this.loading = false;
      }
    });
  }

  toggleApprove(commentId: string) {
    this.http.patch(`https://menhealthbackend.onrender.com/api/admin/comments/${commentId}/approve`, {}).subscribe({
      next: () => this.fetchComments(),
      error: (err) => console.error('Error approving comment', err)
    });
  }

  deleteComment(commentId: string) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    this.http.delete(`https://menhealthbackend.onrender.com/api/admin/comments/${commentId}`).subscribe({
      next: () => this.fetchComments(),
      error: (err) => console.error('Error deleting comment', err)
    });
  }

  replyToComment(commentId: string) {
    if (!this.replyContent) return;
    this.http.post(`https://menhealthbackend.onrender.com/api/admin/comments/${commentId}/reply`, { content: this.replyContent }).subscribe({
      next: () => {
        this.replyContent = '';
        this.replyingToId = null;
        this.fetchComments();
      },
      error: (err) => console.error('Error replying', err)
    });
  }

  get filteredComments() {
    if (!this.searchTerm) return this.comments;
    return this.comments.filter(c => 
      c.content.toLowerCase().includes(this.searchTerm.toLowerCase()) || 
      c.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (c.postId && c.postId.title.toLowerCase().includes(this.searchTerm.toLowerCase()))
    );
  }
}
