import { Component } from '@angular/core';
import { TableModule } from 'primeng/table';
import { AttendanceService } from '../../core/services/attendance.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-attendance',
  imports: [TableModule, DatePipe],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss'
})
export class AttendanceComponent {
  attendanceList : any[] = [];

  constructor(private attendanceService: AttendanceService){}

  ngOnInit(){
    this.fetchAllAttendance();
  }

  fetchAllAttendance(){
    this.attendanceService.getAllAttendance().subscribe({
      next: (res:any) => {
        this.attendanceList = res.data;
      },
      error:(err) => {
        console.log(err)
      },
    })
  }
} 
