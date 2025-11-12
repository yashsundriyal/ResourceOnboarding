import { Component } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './Service/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true, 
  imports: [RouterOutlet, RouterModule, CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] 
})
export class AppComponent {
  title = 'Employee Management';

  constructor(private auth: AuthService, private router: Router) {}

   showSignOut(): boolean {
    const path = this.router.url;
    return path === '/' || path === '/signup';
  }

  logout() {
    this.auth.logout(); 
  }
}