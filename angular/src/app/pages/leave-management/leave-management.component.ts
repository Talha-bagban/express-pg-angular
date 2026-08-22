import { DatePipe, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { getUserRole } from '../../core/helper/auth.helper';
import { DialogModule } from 'primeng/dialog';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { LeaveManagementService } from '../../core/services/leave-management.service';
import { TableModule } from 'primeng/table';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-leave-management',
  imports: [
    NgIf,
    DialogModule,
    ReactiveFormsModule,
    FloatLabelModule,
    DatePickerModule,
    ButtonModule,
    SelectModule,
    TextareaModule,
    TableModule,
    DatePipe,
  ],
  templateUrl: './leave-management.component.html',
  styleUrl: './leave-management.component.scss',
})
export class LeaveManagementComponent {
  applyLeaveForm!: FormGroup;
  editLeaveForm!:FormGroup;
  userRole: any;
  currentUser: any;
  currentLeaveId: string = '';
  leaveTypes: any[] = [
    { label: 'Sick Leave', value: 'SICK' },
    { label: 'Casual Leave', value: 'CASUAL' },
    { label: 'Annual Leave', value: 'ANNUAL' },
    { label: 'Unpaid Leave', value: 'UNPAID' },
  ];
  leaves: any[] = [];
  applyLeave = false;
  editLeaveDialog = false;

  constructor(
    private fb: FormBuilder,
    private leaveService: LeaveManagementService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.applyLeaveForm = this.fb.group({
      leave_type: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      reason: ['', [Validators.required]],
    });
    this.editLeaveForm = this.fb.group({
      leave_type: ['', [Validators.required]],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      reason: ['', [Validators.required]],
    })

    this.userRole = getUserRole();
    this.currentUser = this.userService.getCurrentUser();
    if (this.userRole === 'employee') {
      this.fetchMyLeave();
    } else {
      this.fetchLeaves();
    }
  }

  onApply() {
    const payload = {
      ...this.applyLeaveForm.value,
    };
    this.leaveService.applyLeave(payload).subscribe({
      next: (res: any) => {
        console.log('applyLeaveForm', res);
        this.applyLeaveForm.reset();
        this.applyLeave = false;
        this.fetchMyLeave();
      },
      error: (err) => {
        console.log('applyLeaveForm', err);
      },
    });
  }
  
  fetchMyLeave() {
    this.leaveService.getMyLeaves().subscribe({
      next: (res: any) => {
        this.leaves = res.data;
      },
      error: (err) => {
        console.log('myleaves', err);
      },
    });
  }

  fetchLeaves() {
    this.leaveService.leaves().subscribe({
      next: (res: any) => {
        this.leaves = res.data;
      },
      error: (err) => {},
    });
  }

  updateStatus(leaveId: string, status: string, user_id: string) {
    this.leaveService.updateLeaveStatus(leaveId, status).subscribe({
      next: (res: any) => {
        this.fetchLeaves();
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  
   onEdit(){
    const payload = {
      ...this.editLeaveForm.value
    };
    this.leaveService.updateLeave(this.currentLeaveId, payload).subscribe({
      next: (res: any) => {
        this.editLeaveDialog = false;
        this.editLeaveForm.reset();
        this.fetchMyLeave();
      },
      error: (err) => {
      },
    })
  }

  createProjectDialog() {
    this.applyLeave = true;
  }

  editLeave(leave: any){
    this.editLeaveDialog = true;
    this.currentLeaveId = leave.id;
    this.editLeaveForm.patchValue({
      ...leave,
       start_date: new Date(leave.start_date),
      end_date: new Date(leave.end_date)
    });
  }
 
}
