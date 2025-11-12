import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface User {
  username: string;
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
    MatButtonModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  token: string | null = null;
  users: User[] = [];
  roles: string[] = ['Admin', 'User', 'Manager'];
  displayedColumns: string[] = ['username', 'role', 'changeRole'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.http.get<User[]>('http://localhost:5075/api/auth/GetUsers',{
      headers:{
        Authentication: `Bearer ${this.token}`
      }
    })
      .subscribe(data => this.users = data);
      console.log(this.users);
  }

  changeRole(username: string, newRole: string): void {
    this.http.put(`http://localhost:5075/api/auth/RoleChange?userName=${username}&newRole=${newRole}`, {})
      .subscribe(() => {
        console.log(`Role updated for ${username}`);
        this.fetchUsers();
      });
  }
}