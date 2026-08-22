import { Component, ViewChild } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { PopoverModule } from 'primeng/popover';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DashboardService } from '../../core/services/dashboard.service';
import { getUserRole } from '../../core/helper/auth.helper';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { NotificationService } from '../../core/services/notification.service';
import { BadgeModule } from 'primeng/badge';
import { AttendanceService } from '../../core/services/attendance.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { Router } from '@angular/router';

interface User {
  id: number;
  firstname: string;
  email: string;
  role: string;
  status: string;
}

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    ReactiveFormsModule,
    InputTextModule,
    FloatLabelModule,
    BadgeModule,
    PopoverModule,
    ToastModule,
    FullCalendarModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  editform!: FormGroup;
  currentUserId: any = 0;
  unreadCount = 0;
  userList: User[] = [];
  notifications: any[] = [];
  dashboardData: any;
  userRole: any;
  isAdmin: any;
  showDialog = false;

  check_in: any;
  check_out: any;

  calendarOptions: any = {
    plugins: [dayGridPlugin],
    eventDidMount: (info: any) => {
      info.el.title = info.event.title;
    },
    initialView: 'dayGridMonth',
    displayEventTime: false,
    events: [],
    eventClick: (info: any) => {

      const type = info.event.extendedProps.type;

      if(type === 'TASK'){
        this.router.navigate(['/task']);
      }

      if(type === 'LEAVE'){
        this.router.navigate(['/leave-management']);
      }

      if(type === 'PROJECT'){
        this.router.navigate(['/project']);
      }

    }
  };

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private dashService: DashboardService,
    private notificationService: NotificationService,
    private attendanceService: AttendanceService,
    private messageService: MessageService,
    private router : Router
  ) {}

  ngOnInit() {
    this.editform = this.fb.group({
      firstname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      // city: ['', [Validators.required]],
      // address: ['', [Validators.required]],
    });
    if(this.userRole === 'admin'){
      this.fetchUsers();
    }
    this.fetchdashboard();
    this.fetchTodayAttendace();
    this.fetchCalendarEvents();
    this.userRole = getUserRole();
    this.isAdmin = this.userRole === 'admin';
  }

  fetchCalendarEvents() {
    this.dashService.getCalendarEvents().subscribe({
      next: (res: any) => {
        this.calendarOptions = {
          ...this.calendarOptions,
          events: res.data.map((e: any) => ({
            id: e.id, 
            title:  e.type === 'TASK' ? `📝 ${e.title}` : e.type === 'LEAVE' ? `📴 ${e.title}` :  `📁 ${e.title}` ,
            date: e.event_date,
            type: e.type,
            backgroundColor: e.type === 'TASK' ? '#3b82f6' : e.type === 'LEAVE' ? '#22c55e' : '#f59e0b'
          })),
        };

        // console.log('calendar',this.calendarOptions)
      },
      error(err) {},
    });
  }

  fetchUsers() {
    const params = {
      page: 1,
      limit: 50,
    };
    this.userService.getAllUser(params).subscribe({
      next: (res: any) => {
        this.userList = res.data;
      },
      error: (err) => {
        // console.log(err.error);
      },
    });
  }

  openDialog(user: any) {
    this.showDialog = true;
    this.currentUserId = user.id;
    console.log('user', user);
    this.editform.patchValue({
      firstname: user.firstname,
      email: user.email,
    });
  }

  onSubmit() {
    this.currentUserId;
    this.userService
      .updateUser(this.currentUserId, this.editform.value)
      .subscribe({
        next: (res: any) => {
          console.log(res);
          const index = this.userList.findIndex(
            (u) => u.id === this.currentUserId,
          );
          this.userList[index] = res.data;
          this.showDialog = false;
        },
        error: (err) => {
          console.log(err.error);
        },
      });
  }

  deleteUser(userId: number) {
    let confirmDelete = confirm('are you sure want to delete');
    if (confirmDelete) {
      this.userService.deletUser(userId).subscribe({
        next: (res) => {
          console.log(res);
          this.fetchUsers();
        },
        error: (err) => {
          console.log(err.error);
        },
      });
    }
  }

  fetchdashboard() {
    this.dashService.getDashboard().subscribe({
      next: (res: any) => {
        this.dashboardData = res.data[0];
      },
      error: (err) => {
        console.log(err.error.message);
      },
    });
  }

  fetchTodayAttendace() {
    this.attendanceService.getTodayAttendance().subscribe({
      next: (res: any) => {
        this.check_in = res?.data?.check_in;
        this.check_out = res?.data?.chech_out;
      },
      error: (err) => {},
    });
  }

  checkIn() {
    const checkInDate = new Date();
    this.attendanceService.checkIn(checkInDate).subscribe({
      next: (res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.fetchTodayAttendace();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
      },
    });
  }
  checkOut() {
    const checkOutDate = new Date();
    this.attendanceService.checkOut(checkOutDate).subscribe({
      next: (res: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: res.message,
        });
        this.fetchTodayAttendace();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: err.error.message,
        });
      },
    });
  }
}
