import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {

    constructor(private http: HttpClient) { }

    private baseURI = 'http://localhost:5000/api/v1';

    checkIn(checkInDate: any){
        return this.http.post(`${this.baseURI}/checkInAttendance`, {checkInDate})
    }

    checkOut(checkOutDate: any){
        return this.http.post(`${this.baseURI}/checkOutAttendance` ,{checkOutDate});
    }

    getAllAttendance(){
        return this.http.get(`${this.baseURI}/getAllAttendance`);
    }

    getTodayAttendance(){
        return this.http.get(`${this.baseURI}/getTodayAttendance`);
    }

}
