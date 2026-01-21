import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
export interface TableRow {
  id: number;
  // For avatar-and-name
  name: string;
  image?: string; // avatar image URL

  // For country
  country?: string;
  countryFlag?: string;

  // For services / chips
  services?: string[];

  // For locale
  locale?: {
    code: string;
    flag: string;
  }[];

  // For status toggle
  active: boolean;

  // For badges

  // Any other generic field for text, text-editor, image, etc.
  [key: string]: any;
}
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'nature-dashboard';
}
