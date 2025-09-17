import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import axios from 'axios';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
})
export class AddComponent {
  resource = {
    Name: '',
    Email: '',
    Department: '',
    JoiningDate: null,
    MobileNumber: ''
  };
 
  constructor(private router: Router) {}
 
  addResource() {
    console.log(this.resource,"resource");
    
    axios.post('http://localhost:5075/api/add', this.resource)
      .then((response) => {
        console.log(response,"response");
        Swal.fire({
          title: 'Resource Added!',
          text: 'The resource was added successfully.',
          icon: 'success',
          confirmButtonText: 'OK'
        })
              this.router.navigate(['/']);
      })
      .catch(error => {
        console.error(error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an issue adding the resource.',
          icon: 'error',
          confirmButtonText: 'Try Again'
        });
      });
  }
  goBack() {
    this.router.navigate(['/home']);
  }
}