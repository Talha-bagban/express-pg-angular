import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DepartmentService } from '../../core/services/department.service';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { getUserRole } from '../../core/helper/auth.helper';
import { SelectModule } from 'primeng/select';
import { DashboardService } from '../../core/services/dashboard.service';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-department',
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    ButtonModule,
    TableModule,
    DialogModule,
    CommonModule,
    SelectModule,
    FormsModule,
    InputTextModule
  ],
  templateUrl: './department.component.html',
  styleUrl: './department.component.scss',
})
export class DepartmentComponent {
  departmentForm!: FormGroup;
  updateform!: FormGroup;
  allDept: any[] = [];
  showDialog = false;
  createDepartmentDialog = false;
  currenDeptId = 0;
  userRole: any;
  isAdmin: any;
  search: string = '';
  taskStatus: any[] = [
    { name: 'Active', value: 'active' },
    { name: 'In-active', value: 'in-active' },
  ];
  statusOptions = [
    {
      name: 'All',
      value: null,
    },
    {
      name: 'Active',
      value: 'active',
    },
    {
      name: 'Inactive',
      value: 'in-active',
    },
  ];

  constructor(
    private deptService: DepartmentService,
    private fb: FormBuilder,
    private dashService: DashboardService
  ) {}

  ngOnInit() {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    });
    this.updateform = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(50)]],
      status: ['', [Validators.required]],
    });

    this.fetchDepartment();

    this.userRole = getUserRole();
    this.isAdmin = this.userRole === 'admin';
  }

  createDepartment() {
    const payload = {
      ...this.departmentForm.value,
    };
    this.deptService.createDepartment(payload).subscribe({
      next: (res) => {
        this.departmentForm.reset();
        console.log('department create successfully', res);
        this.fetchDepartment();
        this.createDepartmentDialog = false;
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  page = 1;
  limit = 20;

  totalRecords = 0;
  fetchDepartment() {
    this.deptService.getAllDepartment(this.page, this.limit).subscribe({
      next: (res: any) => {
        this.allDept = res.data;
        this.totalRecords = res.totalRecords;
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }
  onPageChange(event: any) {
    this.page = event.first / event.rows + 1;
    this.limit = event.rows;
    this.fetchDepartment();
  }

  onEditDept(department: any) {
    this.showDialog = true;
    this.currenDeptId = department.id;
    this.updateform.patchValue(department);
  }

  updateDept() {
    this.deptService
      .updateDepartment(this.currenDeptId, this.updateform.value)
      .subscribe({
        next: (res) => {
          console.log('Department Updated Successfully', res);
          this.fetchDepartment();
          this.updateform.reset();
          this.showDialog = false;
        },
        error: (err) => {
          console.log(err.error);
        },
      });
  }

  deleteDept(id: any) {
    let conf = confirm('Sure You want to delete department');

    if (conf) {
      this.deptService.deleteDepartment(id).subscribe({
        next: (res) => {
          this.fetchDepartment();
        },
        error: (err) => {
          console.log(err.error);
        },
      });
    }
  }

  addDepartmentDialog() {
    this.createDepartmentDialog = true;
  }

  getStatusLabel(statusValue: string) {
    const status = this.taskStatus.find((s) => s.value === statusValue);
    return status ? status.name : statusValue;
  }
}
