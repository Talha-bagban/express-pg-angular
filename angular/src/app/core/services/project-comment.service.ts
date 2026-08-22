import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProjectCommentService {

  constructor(private http: HttpClient) { }

  private baseURI = 'http://localhost:5000/api/v1';

  createProjectComment(payload: any){
    return this.http.post(`${this.baseURI}/createProjectComment`, payload)
  }
  getProjectComments(projectId: string){
    return this.http.get(`${this.baseURI}/getProjectComments/${projectId}`)
  }

}
