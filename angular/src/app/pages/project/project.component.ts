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
import { FloatLabel, FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { ProjectService } from '../../core/services/project.service';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { CommonModule } from '@angular/common';
import { getUserRole } from '../../core/helper/auth.helper';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  imports: [
    FloatLabel,
    SelectModule,
    ReactiveFormsModule,
    DatePickerModule,
    ButtonModule,
    TableModule,
    DialogModule,
    CommonModule,
    FormsModule,
    InputTextModule,
    FloatLabelModule,
    TextareaModule
  ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent {
  projectForm!: FormGroup;
  editProjectForm!: FormGroup;
  projects: any[] = [];
  showDialog = false;
  CreateProjectShowDialog = false;
  projectId = '';
  userRole: any;
  taskStatus: any[] = [
    { name: 'Pending', value: 'pending' },
    { name: 'In-Progress', value: 'in-progress' },
    { name: 'Completed', value: 'completed' },
  ];
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
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit() {
    this.projectForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
    });
    this.editProjectForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      status: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
    })

    this.fetchProjects();

    this.userRole = getUserRole();  
  }

  onCreate() {
    const payload = {
      ...this.projectForm.value,
    };
    this.projectService.createProject(payload).subscribe({
      next: (value) => {
        this.projectForm.reset();
        this.fetchProjects();
        this.CreateProjectShowDialog = false;
      },
      error: (err) => {
        alert(err.error.message);
      },
    });
  }

  fetchProjects() {
    this.projectService.getProject().subscribe({
      next: (res: any) => {
        this.projects = res.data;
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }

  onEdit(project: any, event: Event){
    event.stopPropagation();
    this.projectId = project.id
     this.showDialog = true;
     this.editProjectForm.patchValue({
      ...project,
      start_date: new Date(project.start_date),
      end_date: new Date(project.end_date)
     });
  }

  onEditSubmit(){
    this.projectService.updateProject(this.projectId, this.editProjectForm.value).subscribe({
      next:(res) => {
        this.editProjectForm.reset();
        this.showDialog = false;
        this.fetchProjects();
      },
      error:(err) => {
        alert(err.error.message);
      },
    })
  }

  onDelete(id:any, event: Event){
    event.stopPropagation();
    const confirmDelete = confirm('Are you sure wanted to delete ?')
    if (confirmDelete) {
      this.projectService.deleteProject(id).subscribe({
        next:(res:any) => {
          this.fetchProjects();
        },
        error:(err) => {
          alert(err.error.message)
        },
      })
    }
  }

  createProjectDialog(){
   this.CreateProjectShowDialog = true;
    
  }
  projectDetial(project: any){
    this.router.navigate([`/project/${project.id}`]);
  }
}
