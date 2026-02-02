// loader.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoaderService } from '../../services/loader.service';
@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, ProgressSpinnerModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}
}
