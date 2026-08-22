import { Component } from '@angular/core';
import { ProjectService } from '../../core/services/project.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { ProjectCommentService } from '../../core/services/project-comment.service';
import { UserService } from '../../core/services/user.service';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-project-detail',
  imports: [DatePipe, TableModule, ReactiveFormsModule, FloatLabelModule, TextareaModule, ButtonModule, CommonModule,ProgressBarModule  ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss',
})
export class ProjectDetailComponent {
  commentForm!: FormGroup; 
  currenUser:any;
  projectId: string = '';
  projectByID: any;
  projectTaskList: any;
  projectCommentList: any[] =[];
  activityLog: any[]=[];

  constructor(
    private projectService: ProjectService,
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private fb: FormBuilder,
    private projectCommentService: ProjectCommentService
  ) {}

  ngOnInit() {
    this.commentForm = this.fb.group({
      comment: ['', [Validators.required]]
    })

    this.projectId = this.route.snapshot.params['id'];
    this.currenUser = this.userService.getCurrentUser();
    this.fetchProjectById();
    this.fetchProjectTasks();
    this.fetchProjectComments();
    this.fetchProjectLog();
  }

  fetchProjectById() {
    this.projectService.getProjectById(this.projectId).subscribe({
      next: (res: any) => {
        this.projectByID = res.data;
        // console.log(this.projectByID);
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  fetchProjectTasks() {
    this.projectService.getProjectTasks(this.projectId).subscribe({
      next: (res: any) => {
        this.projectTaskList = res.data;
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }

  taskDetail(task: any) {
    console.log('task', task);
    this.router.navigate([`/task/${task.id}`]);
  }

  back() {
    this.location.back();
  }

  isOwnComment(user_id: string): boolean {
    return (
      user_id ===
      this.currenUser.id
    );
  }

  ProjectCommentSubmit(){
    const payload = {
      ...this.commentForm.value,
      projectId: this.projectId
    }
    this.projectCommentService.createProjectComment(payload).subscribe({
      next: (res) => {
        this.fetchProjectComments();
        this.commentForm.reset();
      },
      error: (err) => {
        console.log(err.error);
      },
    })
  }

  fetchProjectComments(){
    this.projectCommentService.getProjectComments(this.projectId).subscribe({
      next: (res:any) => {
        this.projectCommentList = res.data;
      },
      error:(err) => {
        console.log(err.error.message)
      },
    })
  }

  fetchProjectLog(){
    this.projectService.getProjectLog(this.projectId).subscribe({
      next: (res: any) => {
        // console.log('project-log:-', res)
        this.activityLog = res.data;
      },
      error: (err) => {
        console.log(err.error.message);
      },
    })
  }
}
