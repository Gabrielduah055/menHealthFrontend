import { Routes } from '@angular/router';
import { LoginComponent } from './admin/login/login.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { OrdersComponent } from './pages/orders/orders.component';
import { OrderDetailsComponent } from './pages/orders/order-details/order-details.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { CustomerDetailsComponent } from './pages/customers/customer-details/customer-details.component';
import { BlogsComponent } from './pages/blogs/blogs.component';
import { BlogCreateComponent } from './pages/blogs/blog-create/blog-create.component';
import { BlogEditComponent } from './pages/blogs/blog-edit/blog-edit.component';
import { LinksComponent } from './pages/links/links.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { OthersComponent } from './pages/others/others.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductAddComponent } from './pages/products/product-add/product-add.component';
import { ProductDetailsComponent } from './pages/products/product-details/product-details.component';
import { ProductEditComponent } from './pages/products/product-edit/product-edit.component';
import { CommentsComponent } from './pages/comments/comments.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'admin/login', component: LoginComponent },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'orders/:id', component: OrderDetailsComponent },
      { path: 'orders', component: OrdersComponent },
      { path: 'customers/:id', component: CustomerDetailsComponent },
      { path: 'customers', component: CustomersComponent },
      { path: 'blogs/create', component: BlogCreateComponent },
      { path: 'blogs/edit/:id', component: BlogEditComponent },
      { path: 'blogs', component: BlogsComponent },
      { path: 'products/add', component: ProductAddComponent },
      { path: 'products/edit/:id', component: ProductEditComponent },
      { path: 'products/:id', component: ProductDetailsComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'comments', component: CommentsComponent },
      { path: 'links', component: LinksComponent },
      { path: 'logout', component: LogoutComponent },
      { path: 'others', component: OthersComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'admin/login' }
];
