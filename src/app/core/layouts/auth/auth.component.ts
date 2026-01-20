import { Component } from '@angular/core';
import { LoginComponent } from "../../../features/componenets/login/login.component";

@Component({
  selector: 'app-auth',
  imports: [LoginComponent],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent {

}
