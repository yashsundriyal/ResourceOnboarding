import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import axios from 'axios';
import { EmployeeDetails } from '../models/employee.models.js' ; // adjust path as needed

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class EditComponent implements OnInit {
  employee: EmployeeDetails = {
    id: 0,
    name: '',
    email: '',
    department: '',
    joiningDate: null,
    mobileNumber: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    let fetchedEmployee: EmployeeDetails | null = null;

    const storedEmployee = localStorage.getItem('currentEmployee');
    console.log(storedEmployee,"stored");
    if (storedEmployee) {
      fetchedEmployee = JSON.parse(storedEmployee);
    }

    if (fetchedEmployee) {
      this.employee = fetchedEmployee;
      this.mapEmployeeProperties();
    }

    console.log(this.employee, 'Final mapped employee');
  }

  updateEmployee(): void {
    axios
      .put(
        `http://localhost:5075/api/Update/${this.employee.id}`,
        this.employee
      )
      .then((response) => {
        console.log('Employee updated:', response.data);
        localStorage.removeItem('currentEmployee'); // Clear storage
        this.router.navigate(['/']);
      })
      .catch((error) => console.error('Error updating employee:', error));
  }

  formatDate(date: any): string | null {
    if (!date) return null;
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    const formattedMonth = month.length < 2 ? '0' + month : month;
    const formattedDay = day.length < 2 ? '0' + day : day;

    return [year, formattedMonth, formattedDay].join('-');
  }

  mapEmployeeProperties(): void {
    console.log(this.employee, 'in mapEmployeeProperties');
    this.employee = {
      id: this.employee.id,
      name: this.employee.name,
      email: this.employee.email,
      department: this.employee.department,
      joiningDate: this.employee.joiningDate
        ? this.formatDate(this.employee.joiningDate)
        : null,
      mobileNumber: this.employee.mobileNumber
    };
  }
  
  goBack() {
    this.router.navigate(['/']);
  }
}
