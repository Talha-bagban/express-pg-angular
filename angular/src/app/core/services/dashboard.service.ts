import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, shareReplay, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

    private baseURI = 'http://localhost:5000/api/v1';

    // dashboard$!: Observable<any>;
     private dashboardSubject = new BehaviorSubject<any>(null);

    constructor(private http: HttpClient) { 
      // this.dashboard$ = this.http.get(`${this.baseURI}/dashboard`).pipe(
      //   shareReplay(1)
      // )
    }


    getDashboard(){
      const cache = this.dashboardSubject.value;
        if (cache) {
          console.log('📦 From Angular Cache');
          return of(cache);
        }
        console.log('🌐 Calling API');
      return this.http.get(`${this.baseURI}/dashboard`).pipe(
        tap((res) => {
          this.dashboardSubject.next(res)
          // console.log('res:' ,res);
        })
      )
    }
    // getDashboard(){
    //   return this.http.get(`${this.baseURI}/dashboard`);
    // }
    getCalendarEvents(){
      return this.http.get(`${this.baseURI}/calendar/events`)
    }

}
