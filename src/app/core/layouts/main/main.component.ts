import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { SidebarService } from '../../services/sidebar.service';

@Component({
  selector: 'app-main',
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  sidebarCollapsed = false;
  constructor(private sidebarService: SidebarService) {}

  ngOnInit() {
    this.sidebarService.sidebarCollapsed$.subscribe((collapsed) => {
      this.sidebarCollapsed = collapsed;
    });
  }
}
