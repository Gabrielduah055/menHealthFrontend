import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = `${environment.apiUrl}/admin/blogs`;

  constructor(private http: HttpClient) { }

  getBlogs(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getBlog(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createBlog(blogData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, blogData);
  }

  updateBlog(id: string, blogData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, blogData);
  }

  deleteBlog(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // View tracking
  incrementView(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/view`, {});
  }
}
