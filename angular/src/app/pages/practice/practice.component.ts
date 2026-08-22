import { Component } from '@angular/core';
import { filter, from, map, of } from 'rxjs';

@Component({
  selector: 'app-practice',
  imports: [],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.scss'
})
export class PracticeComponent {

  noList$ = of([11,12,13,14,15,16,17,18,19,20]);

  constructor() {
    this.noList$.pipe(
      map((result: number[]) => result.filter(m => m % 2 == 0) )
    ).subscribe((res: number[]) => {
      console.log(res);
    })
  }
}
