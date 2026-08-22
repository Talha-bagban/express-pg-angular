import { Component, ViewChild } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { getUserRole } from '../../core/helper/auth.helper';
import { BadgeModule } from 'primeng/badge';
import { PopoverModule } from 'primeng/popover';
import { ToastModule } from 'primeng/toast';
import { NotificationService } from '../../core/services/notification.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    CommonModule,
    BadgeModule,
    PopoverModule,
    ToastModule,
    ButtonModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent {
  @ViewChild('op') op: any;
  unreadCount = 0;
  notifications: any[] = [];

  userRole: any;
  currenUser: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.userRole = getUserRole();
    // this.fetchNotifications();
    this.userService.currentUser$.subscribe((user) => {
      this.currenUser = user;
    });

    // const currentUser = this.userService.getCurrentUser();
    //  if (currentUser) {
    //   this.socketService.connect(currentUser.id);
    // }
    this.notificationService.loadNotifications();
    
    this.notificationService.notifications$.subscribe(data => {
      this.notifications = data;
      // this.unreadCount++;
    });
    this.notificationService.unreadCount$.subscribe(count => {
      this.unreadCount = count;
    })
    
  }
  // ngOnDestroy() {
  //   // console.log('closing socket - new-notification');
  //   this.socketService.socket?.off('new-notification');
  // }

  // fetchNotifications() {
  //   this.notificationService.getNotifications().subscribe({
  //     next: (res: any) => {
  //       this.notifications = res.data;
  //       this.unreadCount = res.unreadCount;
  //     },
  //     error(err) {
  //       console.log(err);
  //     },
  //   });
  // }

  openNotifications(event: Event) {
    this.op.toggle(event);
  }

  markAsRead(notification: any){
    this.notificationService.markAsRead(notification);
  }

  // markAsRead(notification: any) {
  //   if (notification.is_read) return;
  //   this.notificationService.markAllNotificationsAsRead().subscribe({
  //     next: (res) => {
  //       notification.is_read = true;
  //       this.unreadCount--;
  //     },
  //     error: (err) => {
  //       console.log(err);
  //     },
  //   });
  // }

  logout() {
    this.userService.logoutUser();
    this.router.navigate(['/login']);
  }
}
