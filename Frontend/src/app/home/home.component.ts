import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Import RouterModule!
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome'
import {EmployeeDetails} from '../models/employee.models';
import { ResourceService } from '../Service/resource.service';
import Swal from 'sweetalert2';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule, FontAwesomeModule, MatTableModule, MatIconModule, MatToolbarModule, MatCardModule], // Add RouterModule here
})
export class HomeComponent implements OnInit {
   displayedColumns: string[] = ['name', 'email', 'department', 'joiningDate', 'mobileNumber', 'actions'];
  resources: any[] = [];

  constructor(private resourceService: ResourceService, private router: Router) {}
  ngOnInit() {
    this.getResources();
  }

  getResources() {
    axios.get('http://localhost:5075/api/home')
      .then(response => this.resources = response.data)
      .catch(error => console.error('API error:', error));
  }
  editResource(resource: any) {
    // Implement logic to navigate to an edit page or open an edit modal
    console.log('Edit resource', resource);
  }
  goToEdit(employee: EmployeeDetails): void {
    console.log('Setting resource: in edit ', employee);
    // Store the selected resource in the shared service
    this.resourceService.setEmployee(employee);
    // Navigate to the edit page (e.g., /edit/123)
    this.router.navigate(['/edit', employee.id]);
  }
  deleteResource(id: number) {
    console.log(id,"id dede");
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5075/api/home/${id}`)
          .then(response => {
            Swal.fire(
              'Deleted!',
              'The Employee has been deleted.',
              'success'
            );
            window.location.reload(); // Refresh the page
          })
          .catch(error => {
            console.error('API error:', error);
            Swal.fire(
              'Error!',
              'Something went wrong while deleting the resource.',
              'error'
            );
          });
  
        console.log('Delete resource with ID:', id);
      }
    });
  }
  
  
}
