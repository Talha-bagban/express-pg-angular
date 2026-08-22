import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { authGuard } from './core/guard/auth.guard';
import { LayoutComponent } from './pages/layout/layout.component';
import { DepartmentComponent } from './pages/department/department.component';
import { EmployeepComponent } from './pages/employee/employeep.component';
import { TaskComponent } from './pages/task/task.component';
import { ProjectComponent } from './pages/project/project.component';
import { ManagerComponent } from './pages/manager/manager.component';
import { TaskDetailComponent } from './pages/task-detail/task-detail.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ProjectDetailComponent } from './pages/project-detail/project-detail.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { LeaveManagementComponent } from './pages/leave-management/leave-management.component';
import { PracticeComponent } from './pages/practice/practice.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: '',
        component: LayoutComponent,
        canActivateChild: [authGuard],
        children: [
            {
                path: 'practice',
                component: PracticeComponent
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'department',
                component: DepartmentComponent
            },
            {
                path: 'manager',
                component: ManagerComponent
            },
            {
                path: 'employee',
                component: EmployeepComponent
            },
            {
                path: 'task',
                component: TaskComponent
            },
            {
                path: 'task/:id',
                component: TaskDetailComponent
            },
            {
                path: 'project',
                component: ProjectComponent
            },
            {
                path: 'project/:id',
                component: ProjectDetailComponent
            },
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'attendance',
                component: AttendanceComponent
            },
            {
                path: 'leave-management',
                component: LeaveManagementComponent
            }
        ]
    }
];
