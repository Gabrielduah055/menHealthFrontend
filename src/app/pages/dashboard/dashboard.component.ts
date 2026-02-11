import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { ProductService } from '../../core/services/product.service';
import { BlogService } from '../../core/services/blog.service';
import { OrderService } from '../../core/services/order.service';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: any[] = [];
  recentPosts: any[] = [];
  recentComments: any[] = [];
  topProducts: any[] = [];
  recentOrders: any[] = [];
  socialStats: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private productService: ProductService,
    private blogService: BlogService,
    private orderService: OrderService
  ) {
    // Initialize stats with zeros
    this.stats = [
        { label: 'Total Revenue', value: 'GHS 0.00', subtext: 'Total earnings', change: '0%', isPositive: true, icon: 'uil-money-bill', bg: 'bg-purple-100', text: 'text-purple-600' },
        { label: 'Active Products', value: 0, subtext: 'In inventory', change: '0%', isPositive: true, icon: 'uil-shopping-bag', bg: 'bg-orange-100', text: 'text-orange-600' },
        { label: 'Total Orders', value: 0, subtext: 'All time', change: '0%', isPositive: true, icon: 'uil-shopping-cart', bg: 'bg-green-100', text: 'text-green-600' },
        { label: 'Total Customers', value: 0, subtext: 'Registered users', change: '0%', isPositive: true, icon: 'uil-users-alt', bg: 'bg-blue-100', text: 'text-blue-600' }
    ];
    this.initMockData();
  }

  ngOnInit() {
    this.fetchDashboardData();
  }

  initMockData() {
    // Keep these mock until real API exists
    this.recentComments = []; 
    this.socialStats = [
        { platform: 'Facebook', followers: '0 followers', change: '0%', isPositive: true, icon: 'uil-facebook-f', bg: 'bg-blue-50', text: 'text-blue-600' },
        { platform: 'Instagram', followers: '0 followers', change: '0%', isPositive: true, icon: 'uil-instagram', bg: 'bg-pink-50', text: 'text-pink-600' },
        { platform: 'Twitter', followers: '0 followers', change: '0%', isPositive: true, icon: 'uil-twitter', bg: 'bg-sky-50', text: 'text-sky-600' }
    ];
  }

  fetchDashboardData() {
    forkJoin({
      stats: this.dashboardService.getStats().pipe(
        catchError((err) => {
          console.error('Error fetching stats', err?.error?.message || err.message || err);
          return of({
            totalRevenue: 0,
            totalProducts: 0,
            totalOrders: 0,
            totalCustomers: 0
          });
        })
      ),
      products: this.productService.getProducts().pipe(
        catchError((err) => {
          console.error('Error fetching products', err?.error?.message || err.message || err);
          return of([]);
        })
      ),
      blogs: this.blogService.getBlogs().pipe(
        catchError((err) => {
          console.error('Blogs API failed:', err?.error?.message || err.message || err);
          return of([]);
        })
      ),
      orders: this.orderService.getOrders().pipe(
        catchError((err) => {
          console.error('Orders API failed:', err?.error?.message || err.message || err);
          return of([]);
        })
      )
    }).subscribe({
      next: (data) => {
        // Process Stats
        if (data.stats) {
            this.stats = [
                { label: 'Total Revenue', value: 'GHS ' + (data.stats.totalRevenue || 0).toLocaleString(), subtext: 'Total earnings', change: '+12.5%', isPositive: true, icon: 'uil-money-bill', bg: 'bg-purple-100', text: 'text-purple-600' },
                { label: 'Active Products', value: data.stats.totalProducts || 0, subtext: 'In inventory', change: '+8.2%', isPositive: true, icon: 'uil-shopping-bag', bg: 'bg-orange-100', text: 'text-orange-600' },
                { label: 'Total Orders', value: data.stats.totalOrders || 0, subtext: 'All time', change: '+5.4%', isPositive: true, icon: 'uil-shopping-cart', bg: 'bg-green-100', text: 'text-green-600' },
                { label: 'Total Customers', value: data.stats.totalCustomers || 0, subtext: 'Registered users', change: '+24.8%', isPositive: true, icon: 'uil-users-alt', bg: 'bg-blue-100', text: 'text-blue-600' }
            ];
        }

        // Process Recent Posts (Take first 4)
        if (data.blogs && data.blogs.length > 0) {
            this.recentPosts = data.blogs.slice(0, 4).map((blog: any) => ({
                title: blog.title,
                url: `healthpulse.com/blog/${blog.slug}`,
                status: blog.status === 'published' ? 'Published' : 'Draft',
                statusColor: blog.status === 'published' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600',
                comments: 0, 
                date: new Date(blog.createdAt).toLocaleDateString()
            }));
        }

        // Process Top Products (Take first 4)
        if (data.products && data.products.length > 0) {
            this.topProducts = data.products.slice(0, 4).map((product: any) => ({
                name: product.name,
                stock: product.stockQty + ' units',
                price: 'GHS ' + product.price,
                sold: '0 sold', 
                icon: 'uil-shopping-bag',
                bg: 'bg-purple-100',
                text: 'text-purple-600'
            }));
        }

        // Process Recent Orders (Take first 4)
        if (data.orders && data.orders.length > 0) {
            this.recentOrders = data.orders.slice(0, 4).map((order: any) => ({
                orderId: order._id,
                id: order._id.substring(0, 8), // Short ID
                customer: order.customer.name,
                avatar: 'https://ui-avatars.com/api/?name=' + order.customer.name,
                price: 'GHS ' + order.totalAmount,
                status: order.status,
                statusColor: this.getStatusColor(order.status)
            }));
        }
      },
      error: (err) => {
        console.error('Error fetching dashboard data', err);
        // Stats will remain at initialized zero values
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
        case 'delivered': return 'bg-blue-50 text-blue-600';
        case 'shipped': return 'bg-green-50 text-green-600';
        case 'processing': return 'bg-yellow-50 text-yellow-600';
        case 'cancelled': return 'bg-red-50 text-red-600';
        default: return 'bg-gray-50 text-gray-600';
    }
  }
}
