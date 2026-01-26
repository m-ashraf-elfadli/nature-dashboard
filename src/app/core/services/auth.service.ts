import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  
  private baseUrl = 'https://lavenderblush-reindeer-325183.hostingersite.com';

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  login(credentials: { username: string, password: string }) {
    return this.http.post<any>(`${this.baseUrl}/api/users/signin`, credentials).pipe(
      tap(res => {
        const token = `${res.data.token_type} ${res.data.token}`;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout() {
    return this.http.post(`${this.baseUrl}/api/users/logout`, {}).pipe(
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

  isAuthenticated(): boolean {
    return this.hasToken();
  }
}
