import { Component } from '@angular/core';
import { TaskService } from '../../core/services/task.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe, NgClass, NgFor } from '@angular/common';
import { Location } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { TaskCommentService } from '../../core/services/task-comment.service';
import { UserService } from '../../core/services/user.service';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-task-detail',
  imports: [DatePipe, ReactiveFormsModule, FloatLabel, ButtonModule, NgFor, NgClass, TextareaModule],
  templateUrl: './task-detail.component.html',
  styleUrl: './task-detail.component.scss',
})
export class TaskDetailComponent {
  commentForm!: FormGroup;
  taskId: string = '';
  taskById: any;
  comments: any;
  currenUser:any;
  activityLog: any;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private taskCommentService: TaskCommentService,
    private location: Location,
    private userService: UserService
  ) {}

  ngOnInit() {
     this.commentForm = this.fb.group({
      comment: ['', Validators.required],
    });

    this.taskId = this.route.snapshot.params['id'];
    this.currenUser = this.userService.getCurrentUser();
    this.fetchTaskById();
    this.fetchComments();
    this.fetchLog();

  }

  fetchTaskById() {
    this.taskService.getTaskById(this.taskId).subscribe({
      next: (res: any) => {
        this.taskById = res.data;
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }

  commentSubmit() {
    const payload = {
      ...this.commentForm.value,
      taskId: this.taskId
    }
    console.log(payload)
    this.taskCommentService.createComment(payload).subscribe({
      next: (res:any) => {
        console.log('comment', res)
        this.fetchComments();
        this.commentForm.reset();
      },
      error:(error) => {
         console.log(error.error.messsage);
      }
    })
  }
  

  fetchComments(){
    this.taskCommentService.getComments(this.taskId).subscribe({
      next: (res: any) => {
        this.comments = res.data;
      },
      error:(err) => {
        console.log(err.error.message);
      },
    })
  }
  back(){
    this.location.back();
  }
  isOwnComment(user_id: string): boolean {
    return (
      user_id ===
      this.currenUser.id
    );
  }

  fetchLog(){
    this.taskService.getLog(this.taskId).subscribe({
      next: (res: any) => {
        console.log('getLog:-',res)
        this.activityLog = res.data;
      },
      error: (err) => {
        
      },
    })
  }
}
