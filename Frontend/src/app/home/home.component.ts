import { Component, OnInit, ViewChild } from '@angular/core';
import axios from 'axios';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Import RouterModule!
import { EmployeeDetails } from '../models/employee.models';
import { ResourceService } from '../Service/resource.service';
import Swal from 'sweetalert2';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUserPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';

declare var bootstrap: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    MatSortModule,
    MatPaginatorModule,
    MatTableModule,
    MatIconModule,
    MatToolbarModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
  ], // Add RouterModule here
})
export class HomeComponent implements OnInit {
  token: string | null = null;
  faUserPlus = faUserPlus;
  faEdit = faEdit;
  faTrash = faTrash;

  resource: {
    id: number | null;
    Name: string;
    Email: string;
    Department: string;
    JoiningDate: string | Date | null; // <- allow null and Date
    CountryCode: string;
    MobileNumber: string;
  } = {
    id: null,
    Name: '',
    Email: '',
    Department: '',
    JoiningDate: null, // ok now
    CountryCode: '+91',
    MobileNumber: '',
  };

  originalResource: EmployeeDetails | null = null;
  displayedColumns: string[] = [
    'name',
    'email',
    'department',
    'joiningDate',
    'mobileNumber',
    'actions',
  ];
  resources = new MatTableDataSource<EmployeeDetails>([]);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  editing = false; // true if editing an existing record
  constructor(
    private resourceService: ResourceService,
    private router: Router
  ) {}
  ngOnInit() {
    this.token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (role !== 'Admin' && role !== 'SuperAdmin') {
      this.displayedColumns = this.displayedColumns.filter(
        (c) => c !== 'actions'
      );
    }

    this.getResources();
  }

  ngAfterViewInit() {
    this.resources.sort = this.sort;
    this.resources.paginator = this.paginator;

    this.paginator._changePageSize(10);
  }

  getResources() {
    const token = localStorage.getItem('token');

    axios
      .get('http://localhost:5075/api/home', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => (this.resources.data = response.data))
      .catch((error) => console.error('API error:', error));
  }

  editResource(resource: any) {
    // Implement logic to navigate to an edit page or open an edit modal
    console.log('Edit resource', resource);
  }
  // goToEdit(employee: EmployeeDetails): void {
  //   console.log('Setting resource: in edit ', employee);
  //   // Store the selected resource in the shared service
  //   this.resourceService.setEmployee(employee);
  //   // Navigate to the edit page (e.g., /edit/123)
  //   this.router.navigate(['/edit', employee.id]);
  // }
  goToEdit(employee: EmployeeDetails) {
    this.editing = true; // Edit mode

    const [country, mobile] = employee.mobileNumber.includes('-')
      ? employee.mobileNumber.split('-')
      : [employee.CountryCode || '+91', employee.mobileNumber];

    const formattedDate = employee.joiningDate
      ? new Date(employee.joiningDate).toISOString().split('T')[0] // yyyy-MM-dd
      : '';
    this.resource = {
      id: employee.id,
      Name: employee.name,
      Email: employee.email,
      Department: employee.department,
      JoiningDate: formattedDate,
      CountryCode: country,
      MobileNumber: mobile,
    };
    this.originalResource = {
      id: this.resource.id!,
      name: this.resource.Name,
      email: this.resource.Email,
      department: this.resource.Department,
      joiningDate: this.resource.JoiningDate,
      mobileNumber: `${this.resource.CountryCode}-${this.resource.MobileNumber}`,
      CountryCode: this.resource.CountryCode,
    };

    const modalEl = document.getElementById('addEmployeeModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  deleteResource(id: number) {
    console.log(id, 'id dede');
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://localhost:5075/api/home/${id}`, {
            headers: {
              Authorization: `Bearer ${this.token}`,
            },
          })
          .then((response) => {
            Swal.fire('Deleted!', 'The Employee has been deleted.', 'success');
            window.location.reload(); // Refresh the page
          })
          .catch((error) => {
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
  openAddEmployeeModal() {
    this.editing = false; // Add mode
    this.resource = {
      id: null,
      Name: '',
      Email: '',
      Department: '',
      JoiningDate: null,
      CountryCode: '+91',
      MobileNumber: '',
    };

    const modalEl = document.getElementById('addEmployeeModal');
    if (modalEl) {
      const modal = new bootstrap.Modal(modalEl);
      modal.show();
    }
  }

  private normalizeDate(dateStr: string | null): string | null {
    if (!dateStr) return null;
    return new Date(dateStr).toISOString().split('T')[0]; // keep only yyyy-MM-dd
  }

  private areEqual(payload: any, original: any): boolean {
    return (
      payload.name === original.name &&
      payload.email === original.email &&
      payload.department === original.department &&
      this.normalizeDate(payload.joiningDate) ===
        this.normalizeDate(original.joiningDate) &&
      payload.mobileNumber === original.mobileNumber
    );
  }

  submitResource() {
    const payload = {
      id: this.resource.id ?? 0,
      name: this.resource.Name,
      email: this.resource.Email,
      department: this.resource.Department,
      joiningDate: this.resource.JoiningDate
        ? new Date(this.resource.JoiningDate).toISOString()
        : null,
      mobileNumber: `${this.resource.CountryCode}-${this.resource.MobileNumber}`,
    };

    console.log(payload, 'payload');
    console.log(this.originalResource, 'originalResource');

    if (this.editing) {
      if (
        this.originalResource &&
        this.areEqual(payload, this.originalResource)
      ) {
        Swal.fire(
          'No changes detected',
          'You did not change any fields.',
          'info'
        );
        return;
      }
      axios
        .put(`http://localhost:5075/api/Update/${payload.id}`, payload, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then(() => {
          Swal.fire(
            'Updated!',
            'The resource was updated successfully.',
            'success'
          ).then(() => window.location.reload());
        })
        .catch(() => Swal.fire('Error!', 'Something went wrong.', 'error'));
    } else {
      axios
        .post('http://localhost:5075/api/add', payload, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then(() => {
          Swal.fire(
            'Added!',
            'The resource was added successfully.',
            'success'
          ).then(() => window.location.reload());
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            Swal.fire(
              'Duplicate Email',
              error.response.data.message,
              'warning'
            );
          } else {
            Swal.fire('Error!', 'Something went wrong.', 'error');
          }
        });
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
  goMenu() {
    this.router.navigate(['/']);
  }
  isAdmin(): boolean {
    const role = localStorage.getItem('role');
    return role === 'Admin' || role === 'SuperAdmin';
  }
  applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.resources.filter = filterValue.trim().toLowerCase();
}

}
