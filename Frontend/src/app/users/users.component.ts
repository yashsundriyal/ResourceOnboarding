import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';
import { environment } from '../../environment';

interface User {
  userName: string;
  role: string;
}

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  token: string | null = null;
  currentRole: string | null = null;
  users: User[] = [];
  roles: string[] = ['Admin', 'User'];
  displayedColumns: string[] = ['username', 'role', 'changeRole'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.currentRole = localStorage.getItem('role');
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http
      .get<User[]>(`${environment.apiUrl}/api/auth/GetUsers`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
      })
      .subscribe((data) => {
        this.users = data;
        console.log(this.users);
      });
  }

  changeRole(username: string, newRole: string): void {
    Swal.fire({
      title: `Change role of ${username}?`,
      text: `Set role to "${newRole}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, change it',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        const body = { userName: username, role: newRole };
        console.log(body,"body");
        this.http
          .put(`${environment.apiUrl}/api/auth/RoleChange`, body, {
            headers: {
              Authorization: `Bearer ${this.token}`,
              'Content-Type': 'application/json', // critical
            },
          })
          .subscribe({
            next: () => {
              Swal.fire(
                'Updated!',
                `${username}'s role set to ${newRole}`,
                'success'
              );
            },
            error: (err) => {
              const msg = err.error?.message || 'Could not update role';
              Swal.fire('Error', msg, 'error');
            },
          });
      }
    });
  }
}