import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { EmployeeService } from '../../core/services/employee.service';
import { TableModule } from 'primeng/table';
import { DepartmentService } from '../../core/services/department.service';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { getUserRole } from '../../core/helper/auth.helper';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-employeep',
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule,
    TableModule,
    SelectModule,
    DialogModule,
    CommonModule,
    FormsModule,
    InputTextModule
  ],
  templateUrl: './employeep.component.html',
  styleUrl: './employeep.component.scss',
})
export class EmployeepComponent {
  employeeForm!: FormGroup;
  editEmployeeform!: FormGroup;
  employeeCurrentId = '';
  showDialog = false;
  addEmployeeShowDialog = false;
  employeeList: any[] = [];
  departments: any[] = [];
  userRole: any;
  isAdmin: any;
  taskStatus: any[] = [
    { name: 'Active', value: 'active' },
    { name: 'In-active', value: 'in-active' },
  ];
  search: string = '';
  statusOptions = [
    {
      name: 'All',
      value: null
    },
    {
      name: 'Active',
      value: 'active'
    },
    {
      name: 'Inactive',
      value: 'in-active'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private deptService: DepartmentService,
  ) {}

  ngOnInit() {
    this.employeeForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      department_id: ['', [Validators.required]],
    });
    this.editEmployeeform = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      department_id: ['', [Validators.required]],
      status: ['']
    });
    this.fetchEmployees();
    this.userRole = getUserRole();
    this.isAdmin = this.userRole === 'admin';
  }

  onSubmit() {
    console.log( 'employeeForm Value' ,this.employeeForm.value);
    const payload = {
      ...this.employeeForm.value,
    };
    this.employeeService.createEmployee(payload).subscribe({
      next: (res) => {
        console.log('Created employee Successfully', res);
        this.employeeForm.reset();
        this.fetchEmployees();
        this.addEmployeeShowDialog = false;
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  fetchEmployees() {
    this.employeeService.getAllEmployee().subscribe({
      next: (res: any) => {
        this.employeeList = res.data;
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }

  fetchDepartment() {
    this.deptService.getAllDepartment().subscribe({
      next: (res: any) => {
        this.departments = res.data;
        console.log('department:-' ,res.data)
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  onEdit(employee: any) {
    this.fetchDepartment();
    this.employeeCurrentId = employee.id;
    this.showDialog = true;
    this.editEmployeeform.patchValue(employee);
    console.log(employee);
  }

  onEditSubmit() {
    this.employeeService
      .updateEmployee(this.employeeCurrentId, this.editEmployeeform.value)
      .subscribe({
        next: (res) => {
          this.fetchEmployees();
          this.showDialog = false;
        },
        error: (err) => {
          console.log(err.error);
        },
      });
  }

  deleteEmployee(id: any) {
    const deleteConfirm = confirm('Are your sure wante to delete employee');

    if (deleteConfirm) {
      this.employeeService.deleteEmployee(id).subscribe({
        next: (res) => {
          this.fetchEmployees();
        },
        error: (err) => {
          console.log(err.error);
        },
      });
    }
  }

  addemployeeDialog() {
    this.addEmployeeShowDialog = true;
    this.fetchDepartment();
  }

  getStatusLabel(statusValue: string) {
    const status = this.taskStatus.find(
      s => s.value === statusValue
    );
    return status ? status.name : statusValue;
  }
}
