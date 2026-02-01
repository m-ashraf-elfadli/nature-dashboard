import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { AwardsService } from '../../../services/awards.service';
import { environment } from '../../../../environments/environment.prod';
import { CommonModule } from '@angular/common';
interface AwardSliderItem {
  id: string;
  name: string;
  description: string;
  awardDate: string;
  image: string;
  status: boolean;
  organizationLogos: any[];
}
@Component({
  selector: 'app-awards-slider',
  imports: [CarouselModule, CommonModule],
  standalone: true,
  templateUrl: './awards-slider.component.html',
  styleUrl: './awards-slider.component.scss',
})
export class AwardsSliderComponent {
  constructor(private awardsService: AwardsService) {}
  hoveredAwardIndex: number | null = null;
  mediaUrl = environment.mediaUrl;
  awards: any[] = [];

  carouselOptions: OwlOptions = {
    loop: true,
    margin: 24,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    dots: false,
    nav: false,
    responsive: {
      0: { items: 2 },
      576: { items: 4 },
      768: { items: 4 },
      1200: { items: 6 },
    },
  };

  ngOnInit() {
    this.getAwards();
  }

  onHover(index: number) {
    this.hoveredAwardIndex = index;
  }

  onLeave() {
    this.hoveredAwardIndex = null;
  }
  getAwards() {
    this.awardsService.getAllAwards().subscribe({
      next: (res) => {
        this.awards = res.result;
        console.log(this.awards);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}
