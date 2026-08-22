import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { EmployeeService } from '../../core/services/employee.service';
import { TaskService } from '../../core/services/task.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ProjectService } from '../../core/services/project.service';
import { CommonModule } from '@angular/common';
import { getUserRole } from '../../core/helper/auth.helper';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';
import {TextareaModule } from 'primeng/textarea';


@Component({
  selector: 'app-task',
  imports: [
    ReactiveFormsModule,
    FloatLabelModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    TableModule,
    DialogModule,
    CommonModule,
    FormsModule,
    ProgressSpinnerModule,
    InputTextModule,
    TextareaModule
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent {
  taskForm!: FormGroup;
  editTaskform! : FormGroup;
  taskStatus: any[] = [
    { name: 'Pending', value: 'pending' },
    { name: 'In-Progress', value: 'in-progress' },
    { name: 'Completed', value: 'completed' },
  ];
  priority: any[] = [
    { name: 'High', id: 'high' },
    { name: 'Medium', id: 'medium' },
    { name: 'Low', id: 'low' },
  ];
  employees: any = [];
  tasks: any[]= [];
  projects: any[] = [];
  showDialog = false;
  createTaskShowDialog= false;
  loading = false;
  editTaskId = '';
  userRole : any;
  search: string = '';
  statusOptions = [
    {
      name: 'All',
      value: null
    },
    {
      name: 'Pending',
      value: 'pending'
    },
    {
      name: 'In-Progress',
      value: 'in-progress'
    },
    {
      name: 'Completed',
      value: 'completed'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private taskService: TaskService,
    private projectService: ProjectService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      priority: ['', [Validators.required]],
      assigned_to: ['', [Validators.required]],
      project: ['', [Validators.required]],
      due_date: ['', [Validators.required]],
    });

    this.editTaskform = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      priority: ['', [Validators.required]],
      assigned_to: ['', [Validators.required]],
      project_id: ['', [Validators.required]],
      status: ['', [Validators.required]],
      due_date: ['', [Validators.required]]
    });
    this.fetchTasks();

    this.userRole = getUserRole();

  }

  fetchEmployees() {
    this.employeeService.getAllEmployee().subscribe({
      next: (res: any) => {
        this.employees = res.data;
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }
  fetchTasks(){
    this.loading = true;
    this.taskService.getAllTask().subscribe({
      next: (res: any) => {
        this.tasks = res.data;
    this.loading = false;
      },
      error: (err) => {
        alert(err.error.message);
    this.loading = false;
      },
    })
  }

  fetchProjects(){
    this.projectService.getProject().subscribe({
      next:(res: any) => {
        this.projects = res.data;
      },
      error(err) {
        alert(err.error.message);
      },
    })
  }

  onCreate() {
    console.log(this.taskForm.value);
    const payload = {
      ...this.taskForm.value
    }
    
    this.taskService.createTask(payload).subscribe({
      next: (res) => {
        this.taskForm.reset();
        this.fetchTasks();
        this.createTaskShowDialog= false;
      },
      error: (err) => {
        alert(err.error.message);
      },
    })
  }

  editTask(task: any, event: Event){
    event.stopPropagation();
    if(this.userRole !== 'employee'){
      this.fetchEmployees();
      this.fetchProjects();
    }
    this.showDialog = true;
    this.editTaskId = task.id;
    this.editTaskform.patchValue({
      ...task,
      due_date: new Date(task.due_date)
    });
    console.log('task', task);
  }

  onEditSubmit(){
    if(this.userRole === 'employee'){
      const payload = {
        status: this.editTaskform.value.status
      };
      this.taskService.updateTaskStatus(this.editTaskId, payload).subscribe({
        next:(res) => {
          console.log(res);
          this.showDialog = false;
          this.fetchTasks();
        },
        error:(err) => {
          console.log(err.error.message)
        },
      })
    }
    else{
      this.taskService.updateTask(this.editTaskId, this.editTaskform.value).subscribe({
        next: (value) => {
          this.showDialog = false;
          this.fetchTasks();
        },
        error:(err) => {
          alert(err.error.message);
        },
      })
    }
    
  }
  
  deleteTask(id: any,  event: Event){
    event.stopPropagation();
   const confirmDelete = confirm('Are you sure want to delete task ?');

    if(confirmDelete){
       this.taskService.deleteTask(id).subscribe({
        next :(res) => {
          this.fetchTasks();
        },
        error:(err) => {
          alert(err.error.message)
        },
      })
    }

  }

  getStatusLabel(statusValue: string) {
    const status = this.taskStatus.find(
      s => s.value === statusValue
    );
    return status ? status.name : statusValue;
  }
  
  openCreateTask(){
    this.createTaskShowDialog= true;
    this.fetchEmployees();
    this.fetchProjects();
  }

  isOverdue(task: any){
    return (
      new Date(task.due_date) < new Date()
      &&
      task.status !=='completed'
    );
  }

  getStatusByClass(status: string): any{
    switch(status) {
      case 'pending':
        return 'bg-danger';
      case 'in-progress':
        return 'bg-warning';
      case 'completed':
        return 'bg-success';
    }
  }

  getPriorityByClass(priority: string): any{
    switch(priority) {
      case 'high':
        return 'bg-danger';
        
      case 'low':
        return 'bg-success';
        
      case 'medium':
        return 'bg-warning';
    }
  }

  taskDetail(task: any){
    // console.log('task', task);
    this.router.navigate([`/task/${task.id}`])
  }
}
