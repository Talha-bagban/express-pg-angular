import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeepComponent } from './employeep.component';

describe('EmployeepComponent', () => {
  let component: EmployeepComponent;
  let fixture: ComponentFixture<EmployeepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeepComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
