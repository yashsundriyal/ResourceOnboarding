import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../add/add.component';

declare var bootstrap: any;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  constructor(private router: Router, private dialog: MatDialog) {}

  openDashboard() {
    this.router.navigate(['/home']);
  }

 
}


