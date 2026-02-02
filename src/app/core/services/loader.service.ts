import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private activeRequests = signal(0);
  private showTimestamp: number | null = null;
  private minDisplayTime = 100;
  public loading = signal(false);

  show() {
    this.activeRequests.update((count) => count + 1);
    if (!this.loading()) {
      this.showTimestamp = Date.now();
      this.loading.set(true);
    }
  }

  hide() {
    this.activeRequests.update((count) => Math.max(0, count - 1));

    if (this.activeRequests() === 0) {
      const elapsed = this.showTimestamp
        ? Date.now() - this.showTimestamp
        : this.minDisplayTime;
      const remaining = Math.max(0, this.minDisplayTime - elapsed);

      setTimeout(() => {
        this.loading.set(false);
        this.showTimestamp = null;
      }, remaining);
    }
  }
}
