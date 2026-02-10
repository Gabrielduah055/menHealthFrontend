import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
}

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/admin/auth`;
  private currentUserSubject: BehaviorSubject<AdminUser | null>;
  public currentUser$: Observable<AdminUser | null>;

  constructor(private http: HttpClient, private router: Router) {
    const storedUser = sessionStorage.getItem('adminUser');
    this.currentUserSubject = new BehaviorSubject<AdminUser | null>(storedUser ? JSON.parse(storedUser) : null);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AdminUser | null {
    return this.currentUserSubject.value;
  }

  login(credentials: { email: string; password: string }): Observable<AdminUser> {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/878f4f3b-cbb0-40d7-8e65-1ddb684cc19e', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'auth.service.ts:32', message: 'AuthService.login called', data: { email: credentials.email, apiUrl: this.apiUrl }, timestamp: Date.now() }) }).catch(() => { });
    // #endregion
    return this.http.post<AdminUser>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/878f4f3b-cbb0-40d7-8e65-1ddb684cc19e', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'auth.service.ts:34', message: 'AuthService.login success tap', data: { hasToken: !!user?.token }, timestamp: Date.now() }) }).catch(() => { });
        // #endregion
        if (user && user.token) {
          sessionStorage.setItem('adminUser', JSON.stringify(user));
          this.currentUserSubject.next(user);
        }
      })
    );
  }

  logout() {
    sessionStorage.removeItem('adminUser');
    this.currentUserSubject.next(null);
    this.router.navigate(['/admin/login']);
  }

  getToken(): string | null {
    const user = this.currentUserValue;
    return user ? user.token : null;
  }

  isAuthenticated(): boolean {
    return !!this.currentUserValue;
  }
}
