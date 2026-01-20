import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private mobileMenuOpenSubject = new BehaviorSubject<boolean>(false);
  public mobileMenuOpen$ = this.mobileMenuOpenSubject.asObservable();

  private sidebarCollapsedSubject = new BehaviorSubject<boolean>(false);
  public sidebarCollapsed$ = this.sidebarCollapsedSubject.asObservable();

  toggleMobileMenu(state?: boolean) {
    if (state !== undefined) {
      this.mobileMenuOpenSubject.next(state);
    } else {
      this.mobileMenuOpenSubject.next(!this.mobileMenuOpenSubject.value);
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpenSubject.next(false);
  }

  getMobileMenuState(): boolean {
    return this.mobileMenuOpenSubject.value;
  }

  toggleSidebarCollapse(state?: boolean) {
    if (state !== undefined) {
      this.sidebarCollapsedSubject.next(state);
    } else {
      this.sidebarCollapsedSubject.next(!this.sidebarCollapsedSubject.value);
    }
  }

  getSidebarCollapsedState(): boolean {
    return this.sidebarCollapsedSubject.value;
  }
}
