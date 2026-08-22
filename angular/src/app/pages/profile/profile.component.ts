import { Component } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';
import { getUserRole } from '../../core/helper/auth.helper';
import { DialogModule } from 'primeng/dialog';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [
    DialogModule,
    ReactiveFormsModule,
    SelectModule,
    ButtonModule,
    FloatLabelModule,
    PasswordModule,
    InputTextModule,
    CommonModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  profileEditForm!: FormGroup;
  changePswdForm!: FormGroup;
  userRole: any;
  currenUser: any;
  showDialog = false;
  changePswdshowDialog = false;
  taskStatus: any[] = [
    { name: 'Active', value: 'active' },
    { name: 'In-active', value: 'in-active' },
  ];

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    this.profileEditForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(50)]],
      lastname: ['', [Validators.required, Validators.minLength(2),Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      status: ['', [Validators.required]],
    });
    this.changePswdForm = this.fb.group({
      oldPassword: ['', [Validators.required, Validators.minLength(4)]],
      newPassword: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(20)]],
      renewPassword: ['', [Validators.required, Validators.minLength(4)]],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );
    this.userRole = getUserRole();
    // this.currenUser = this.userService.getCurrentUser(); // old
    
    this.userService.currentUser$.subscribe(user => {  // new
      this.currenUser = user;
    })
  }

   passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
      const newPassword = group.get('newPassword')?.value;
      const renewPassword = group.get('renewPassword')?.value;

      return newPassword === renewPassword
        ? null
        : { passwordMismatch: true };
    }

  editOpenDialog(currenUser: any) {
    this.showDialog = true;
    this.profileEditForm.patchValue(currenUser);
  }

  changePswdOpenDialog() {
    this.changePswdshowDialog = true;
  }

  editProfileSubmit() {
    // console.log(this.profileEditForm.value);
    this.userService
      .updateProfile(this.currenUser.id, this.profileEditForm.value)
      .subscribe({
        next: (res: any) => {
          this.showDialog = false;
          this.profileEditForm.reset();
          // console.log(res);
          this.userService.setCurrentUser(res.data);
          // this.currenUser = this.userService.getCurrentUser(); //old
        },
        error: (err) => {
          console.log(err.error);
        },
      });
  }

  submitChangePswd() {
    this.userService.changeUserPassword(this.changePswdForm.value).subscribe({
      next: (res) => {
        this.changePswdForm.reset();
        this.changePswdshowDialog = false;
      },
      error: (err) => {
        console.log(err.error);
      },
    });
  }
}
