import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TaskCommentService {

  constructor(private http: HttpClient) { }

  private baseURI = 'http://localhost:5000/api/v1';


  createComment(payload: any){
    return this.http.post(`${this.baseURI}/createComment`, payload)
  }

  getComments(taskId:string){
    return this.http.get(`${this.baseURI}/getComments/${taskId}`,);
  }


}
