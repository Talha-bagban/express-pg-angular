import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private http: HttpClient) { }

  private baseURI = 'http://localhost:5000/api/v1';

  createDepartment(payload: any){
    return this.http.post(`${this.baseURI}/createDepartment`, payload);
  }
  
  getAllDepartment( page: number = 1, limit: number = 10){
    return this.http.get(`${this.baseURI}/getdepartments?page=${page}&limit=${limit}`);
  }

  updateDepartment(id:any, payload:any){
    return this.http.patch(`${this.baseURI}/updateDepartment/${id}`, payload);
  }

  deleteDepartment(id:any){
    return this.http.delete(`${this.baseURI}/deleteDepartment/${id}`)
  }

}
