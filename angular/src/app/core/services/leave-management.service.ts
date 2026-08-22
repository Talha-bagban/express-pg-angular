import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LeaveManagementService {

    constructor(private http: HttpClient) { }

    private baseURI = 'http://localhost:5000/api/v1';

    applyLeave(payload: any){
        return this.http.post(`${this.baseURI}/applyLeave`, payload)
    }
    
    getMyLeaves(){
        return this.http.get(`${this.baseURI}/leave/my`);
    }

    leaves(){
        return this.http.get(`${this.baseURI}/leaves`);
    }

    updateLeaveStatus(leaveId:string, status: string){
        return this.http.patch(`${this.baseURI}/updateLeaveStatus/${leaveId}/status`, {status})
    }

    updateLeave(id: string, payload: any){
        return this.http.patch(`${this.baseURI}/updateleave/${id}`, payload)
    }
}
