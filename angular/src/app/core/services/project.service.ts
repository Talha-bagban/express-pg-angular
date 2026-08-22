import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  private baseURI = 'http://localhost:5000/api/v1';

  createProject(payload: any){
    return this.http.post(`${this.baseURI}/createProject`, payload)
  }

  getProject(){
    return this.http.get(`${this.baseURI}/getProjects`)
  }

  updateProject(id:any, formValue:any){
    return this.http.patch(`${this.baseURI}/updateProject/${id}`, formValue)
  }
  
  deleteProject(id:any){
    return this.http.delete(`${this.baseURI}/deleteProject/${id}`)
  }

  getProjectById(id: any){
    return this.http.get(`${this.baseURI}/getProjectById/${id}`)
  }

  getProjectTasks(id: any){
    return this.http.get(`${this.baseURI}/getProjectTasks/${id}`)
  }

  getProjectLog(id: any){
    return this.http.get(`${this.baseURI}/getProjectLog/${id}`)
  }

}
