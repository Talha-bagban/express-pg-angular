import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { SelectModule } from 'primeng/select';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FloatLabelModule,
    ButtonModule,
    SelectModule,
    PasswordModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  register!: FormGroup;
  role: any[] | undefined;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.register = this.fb.group({
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      role: ['', [Validators.required]],
    });

    this.role = [
      { name: 'admin', code: 'AD' },
      { name: 'manager', code: 'MGR' },
      { name: 'employee', code: 'EE' },
    ];
  }

  onSubmit() {
    console.log(this.register.value);
    const payload = {
      ...this.register.value,
    };
    this.userService.registerUser(payload).subscribe({
      next: (res) => {
        console.log('Register User Successfully', res);
        this.router.navigateByUrl('/login');
        this.register.reset();
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }
}
