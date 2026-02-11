import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BlogService } from '../../core/services/blog.service';

@Component({
  selector: 'app-blogs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent implements OnInit {
  blogs: any[] = [];
  loading = true;
  deletingBlogId: string | null = null;

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.loadBlogs();
  }

  loadBlogs() {
    this.loading = true;
    this.blogService.getBlogs().subscribe({
      next: (data) => {
        this.blogs = data.map(blog => ({
          id: blog._id,
          title: blog.title,
          status: blog.status === 'published' ? 'Published' : 'Draft',
          statusColor: blog.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700',
          author: 'Admin',
          date: new Date(blog.createdAt).toLocaleDateString(),
          views: blog.views || 0,
          comments: 0
        }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading blogs', err);
        this.loading = false;
      }
    });
  }

  onDeleteBlog(blogId: string) {
    if (this.deletingBlogId) return;
    if (!confirm('Are you sure you want to delete this blog post?')) return;

    this.deletingBlogId = blogId;
    this.blogService.deleteBlog(blogId).subscribe({
      next: () => {
        this.blogs = this.blogs.filter((blog) => blog.id !== blogId);
        this.deletingBlogId = null;
      },
      error: (err) => {
        console.error('Error deleting blog', err);
        this.deletingBlogId = null;
      }
    });
  }
}
