import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) {}

  private baseURI = 'http://localhost:5000/api/v1';

  createTask(payload: any){
    return this.http.post(`${this.baseURI}/createTask`, payload)
  }

  getAllTask(){
    return this.http.get(`${this.baseURI}/getAllTask`)
  }

  getMyTasks(){
    return this.http.get(`${this.baseURI}/getMyTasks`)
  }

  getTaskById(id: any){
    return this.http.get(`${this.baseURI}/getTaskById/${id}`)
  }

  updateTask(id:any, payload:any){
    return this.http.patch(`${this.baseURI}/updateTask/${id}`, payload)
  }

  updateTaskStatus(id:any, payload:any){
    return this.http.patch(`${this.baseURI}/updateTaskStatus/${id}/status`, payload)
  }

  deleteTask(id:any){
    return this.http.delete(`${this.baseURI}/deleteTask/${id}`)
  }

  getLog(taskId: any){
    return this.http.get(`${this.baseURI}/getLog/${taskId}`)
  }
}
