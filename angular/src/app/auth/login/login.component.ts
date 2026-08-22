import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-login',
  imports: [
    FloatLabelModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    PasswordModule,
    InputTextModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private route: Router,
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  onLogin() {
    const payload = {
      ...this.loginForm.value,
    };
    this.loading = true;
    this.userService.loginUser(payload).subscribe({
      next: (res: any) => {
        this.loading = false;
        // console.log('login in successfully', res);
        localStorage.setItem('accessToken', res.accessToken);
        // localStorage.setItem('user', JSON.stringify(res.user)); //old
        this.userService.setCurrentUser(res.user);
        this.route.navigateByUrl('/dashboard');
      },
      error: (err) => {
        this.loading = false;
        console.log(err.error);
      },
    });
  }
}
