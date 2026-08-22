import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  private baseURI = 'http://localhost:5000/api/v1';

  private currentUserSubject = new BehaviorSubject<any>(this.getCurrentUser());
  readonly currentUser$ = this.currentUserSubject.asObservable();

  registerUser(payload: any) {
    return this.http.post(`${this.baseURI}/createUser`, payload);
  }

  loginUser(payload: any) {
    return this.http.post(`${this.baseURI}/loginUser`, payload);
  }

  logoutUser() {
    return localStorage.clear();
  }

  getAllUser(params: any) {
    return this.http.get(`${this.baseURI}/users`, { params });
  }

  updateUser(id: number, formValue: any) {
    return this.http.patch(`${this.baseURI}/updateUser/${id}`, formValue);
  }

  deletUser(id: number) {
    return this.http.delete(`${this.baseURI}/users/${id}`);
  }

   updateProfile(id: any, payload: any) {
    return this.http.patch(`${this.baseURI}/updateProfile/${id}`, payload);
  }

  getCurrentUser() {
    const currentUser = localStorage.getItem('user');

    return currentUser ? JSON.parse(currentUser) : null;
  }
  
  // setCurrentUser(user: any) {
  //   localStorage.setItem('user', JSON.stringify(user));
  // }

  setCurrentUser(user: any | null){
    if(user){
      localStorage.setItem('user', JSON.stringify(user));
    }
    else{
      localStorage.removeItem('user');
    }
    this.currentUserSubject.next(user);
  }

  changeUserPassword( payload: any){
    return this.http.patch(`${this.baseURI}/changeUserPassword`, payload)
  }
}
