import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true, // Add this if you’re using a standalone component
  imports: [RouterOutlet, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'] // Fix the typo (was `styleUrl`)
})
export class AppComponent {
  title = 'ResourceOnboarding';
}