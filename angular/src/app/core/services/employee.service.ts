import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  private baseURI = 'http://localhost:5000/api/v1';

  createEmployee(payload: any) {
    return this.http.post(`${this.baseURI}/createEmployee`, payload);
  }
  getAllEmployee(){
    return this.http.get(`${this.baseURI}/getAllEmployee`)
  }
  deleteEmployee(id: any){
    return this.http.delete(`${this.baseURI}/deleteEmployee/${id}`, {})
  }
  updateEmployee(id:any, formValue: any){
    return this.http.patch(`${this.baseURI}/updateEmployee/${id}`, formValue)
  }

  createManager(payload:any){
    return this.http.post(`${this.baseURI}/createManager`, payload);
  }
  getAllManager(){
    return this.http.get(`${this.baseURI}/getAllManger`)
  }
  updateManager(id: any, formValue: any){
    return this.http.patch(`${this.baseURI}/updateManager/${id}`, formValue)
  }
  deleteManger(id: any){
    return this.http.delete(`${this.baseURI}/deleteManger/${id}`, {})
  }

}
