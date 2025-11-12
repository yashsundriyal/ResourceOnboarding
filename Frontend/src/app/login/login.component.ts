import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    console.log("Triggered!");
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please enter both username and password.';
      return;
    }

    const { username, password } = this.loginForm.value;

    this.http.post('http://localhost:5075/api/auth/login', { username, password })
      .subscribe({
        next: (res: any) => {
          console.log(res);
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          console.log("role",res.role);
          console.log('Login successful');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.log(err);
          if (err.status === 401) {
            this.errorMessage = err.error || 'Invalid username or password.';
          } else {
            this.errorMessage = 'An error occurred. Please try again.';
          }
        }
      });
  }
}
