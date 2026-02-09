import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { ApiService } from '../services/api.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private api = inject(ApiService);
  private translate = inject(TranslateService);

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() { }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(credentials: { username: string, password: string }) {
    return this.api.post<any>('users/signin', credentials).pipe(
      tap(res => {
        const token = `${res.data.token_type} ${res.data.token}`;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout() {
    return this.api.post('users/logout', {}).pipe(
      tap(() => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        this.isAuthenticatedSubject.next(false);
      })
    );
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getUser(): any | null {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }
}
