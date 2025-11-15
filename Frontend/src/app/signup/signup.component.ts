import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { environment } from '../../environment';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      emailId: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.errorMessage = 'Please fill all fields correctly.';
      return;
    }

    this.http.post(`${environment.apiUrl}/api/auth/signup`, this.signupForm.value)
      .subscribe({
        next: () => {
          Swal.fire('Success!', 'Account created successfully!', 'success')
            .then(() => this.router.navigate(['/']));
        },
        error: (err) => {
          if (err.status === 409) {
            this.errorMessage = err.error.message;
            Swal.fire('Conflict', err.error.message, 'warning');
          } else {
            this.errorMessage = 'Something went wrong. Please try again.';
            Swal.fire('Error', 'Something went wrong.', 'error');
          }
        }
      });
  }
}
