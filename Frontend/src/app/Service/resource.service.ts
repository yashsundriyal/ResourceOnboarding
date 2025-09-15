// resource.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EmployeeDetails } from '../models/employee.models';
@Injectable({
  providedIn: 'root'
})
export class ResourceService {
  // BehaviorSubject to store the current employee (or null if none)
  private employeeSubject = new BehaviorSubject<EmployeeDetails | null>(null);
  currentEmployee$ = this.employeeSubject.asObservable();

  setEmployee(employee: EmployeeDetails): void {
    console.log(employee, "in setEmployee in service");
    this.employeeSubject.next(employee);
    localStorage.setItem('currentEmployee', JSON.stringify(employee)); // Store in localStorage
  }
}
