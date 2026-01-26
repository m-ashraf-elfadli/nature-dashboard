import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
interface AwardSliderItem {
  name: string;
  year: string;
  image: string;
}
@Component({
  selector: 'app-awards-slider',
  imports: [CarouselModule],
  templateUrl: './awards-slider.component.html',
  styleUrl: './awards-slider.component.scss'
})
export class AwardsSliderComponent {
  hoveredAwardIndex: number | null = null;

  awards: AwardSliderItem[] = [
    {
      name: 'Best Nature Project',
      year: '2021',
      image: 'images/awards/Award.png',
    },
    {
      name: 'Green Excellence',
      year: '2022',
      image: 'images/awards/Award.png',
    },
    {
      name: 'Eco Innovation',
      year: '2023',
      image: 'images/awards/Award.png',
    },
    {
      name: 'Sustainability Award',
      year: '2024',
      image: 'images/awards/Award.png',
    },
        {
      name: 'Eco Innovation',
      year: '2023',
      image: 'images/awards/Award.png',
    },
        {
      name: 'Eco Innovation',
      year: '2023',
      image: 'images/awards/Award.png',
    },
        {
      name: 'Eco Innovation',
      year: '2023',
      image: 'images/awards/Award.png',
    },
        {
      name: 'Eco Innovation',
      year: '2023',
      image: 'images/awards/Award.png',
    },
        {
      name: 'Eco Innovation',
      year: '2023',
      image: 'images/awards/Award.png',
    },
        {
      name: 'Eco Innovation',
      year: '2023',
      image: 'images/awards/Award.png',
    },
        {
      name: 'Eco Innovation',
      year: '2023',
      image: 'images/awards/Award.png',
    },
  ];

  carouselOptions: OwlOptions = {
    loop: true,
    margin: 24,
    autoplay: true,
    autoplayTimeout: 3000,
    autoplayHoverPause: true,
    dots: false,
    nav: true,
    responsive: {
      0: { items: 2 },
      576: { items: 4 },
      768: { items: 4 },
      1200: { items: 6 },
    },
  };

  onHover(index: number) {
    this.hoveredAwardIndex = index;
  }

  onLeave() {
    this.hoveredAwardIndex = null;
  }
}
