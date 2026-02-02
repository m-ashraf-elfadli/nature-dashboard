import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-card-total',
  standalone: true,
  templateUrl: './card-total.component.html',
  styleUrl: './card-total.component.scss',
})
export class CardTotalComponent implements OnChanges {
  @Input({ required: true }) title!: string;
  @Input({ required: true }) count!: number;
  @Input({ required: true }) icon!: string;

  animatedCount = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['count']) {
      this.animateCounter();
    }
  }

  private animateCounter() {
    const duration = 500;
    const frameRate = 16;
    const totalFrames = duration / frameRate;
    const increment = this.count / totalFrames;

    let current = 0;

    const timer = setInterval(() => {
      current += increment;

      if (current >= this.count) {
        this.animatedCount = this.count;
        clearInterval(timer);
      } else {
        this.animatedCount = Math.floor(current);
      }
    }, frameRate);
  }
}
