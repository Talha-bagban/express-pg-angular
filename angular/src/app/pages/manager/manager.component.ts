import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { getUserRole } from '../../core/helper/auth.helper';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { SelectModule } from 'primeng/select';
import { DepartmentService } from '../../core/services/department.service';
import { EmployeeService } from '../../core/services/employee.service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-manager',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    CommonModule,
    TableModule,
    ButtonModule,
    FloatLabelModule,
    PasswordModule,
    SelectModule,
    FormsModule,
    InputTextModule
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.scss',
})
export class ManagerComponent {
  managerForm!: FormGroup;
  updatemanagerForm!: FormGroup;
  userRole: any;
  isAdmin:any;
  addManagerShowDialog = false;
  updateManagerShowDialog = false;
  managerList: any[] = [];
  departments: any[] = [];
  managerId = '';
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
    private deptService: DepartmentService,
    private employeeService: EmployeeService,
  ) {}

  ngOnInit() {
    this.managerForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      department_id: ['', [Validators.required]],
    });
    this.updatemanagerForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      department_id: ['', [Validators.required]],
      status: ['', [Validators.required]]
    });
    this.fetchManager();
    this.userRole = getUserRole();
    this.isAdmin = this.userRole === 'admin';
  }

  fetchManager() {
    this.employeeService.getAllManager().subscribe({
      next: (res: any) => {
        this.managerList = res.data;
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
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  onCreateManager() {
    const payload = {
      ...this.managerForm.value,
    };
    this.employeeService.createManager(payload).subscribe({
      next: (res) => {
        this.fetchManager();
        console.log('Register User Successfully', res);
        this.addManagerShowDialog = false;
        this.managerForm.reset();
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  addManagerDialog() {
    this.addManagerShowDialog = true;
    this.fetchDepartment();
  }
  onEditManager(manager: any) {
    this.updateManagerShowDialog = true;
    this.managerId = manager.id;
    this.updatemanagerForm.patchValue(manager);
    console.log('manager :-', manager);
    this.fetchDepartment();
  }
  onUpdateManager() {
    this.employeeService
      .updateManager(this.managerId, this.updatemanagerForm.value)
      .subscribe({
        next: (res) => {
          this.fetchManager();
          this.updateManagerShowDialog = false;
        },
        error: (err) => {
          console.log(err.error.message);
        },
      });
  }
  deleteEmployee(id: any) {
    const deleteConfirm = confirm('Are your sure wante to delete employee');
    if (deleteConfirm) {
      this.employeeService.deleteManger(id).subscribe({
        next: (res) => {
          this.fetchManager();
        },
        error: (err) => {
          console.log(err.error.message);
        },
      });
    }
  }

  getStatusLabel(statusValue: string) {
    const status = this.taskStatus.find(
      s => s.value === statusValue
    );
    return status ? status.name : statusValue;
  }

}
