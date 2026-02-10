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

  constructor(private blogService: BlogService) {}

  ngOnInit() {
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
}
