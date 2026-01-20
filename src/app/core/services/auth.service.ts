import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Check authentication status on service initialization
    this.checkAuthStatus();
  }

  private hasToken(): boolean {
    return !!localStorage.getItem('authToken');
  }

  private checkAuthStatus(): void {
    this.isAuthenticatedSubject.next(this.hasToken());
  }

  isAuthenticated(): boolean {
    return this.hasToken();
  }

  login(token: string): void {
    localStorage.setItem('authToken', token);
    this.isAuthenticatedSubject.next(true);
  }

  logout(): void {
    localStorage.removeItem('authToken');
    this.isAuthenticatedSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
}