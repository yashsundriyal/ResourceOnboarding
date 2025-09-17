import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AddComponent } from '../add/add.component';

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

  openAddEmployeeModal() {
  const dialogRef = this.dialog.open(AddComponent, {
    width: '800px',      // fixed reasonable width
    maxHeight: '90vh',   // prevent dialog from exceeding viewport height
    panelClass: 'custom-dialog-panel' // optional: for extra styling
  });

  dialogRef.afterClosed().subscribe(res => {
    // optional: refresh dashboard or handle post-add
  });
}

}
