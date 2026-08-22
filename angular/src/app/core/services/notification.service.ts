import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<any[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private unreadCountSubject = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSubject.asObservable();

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
  ) {
    this.socketService.notification$.subscribe((notification) => {
      const notifications = this.notificationsSubject.value;
      this.notificationsSubject.next([notification, ...notifications]);

      this.unreadCountSubject.next(this.unreadCountSubject.value + 1);
    });
  }

  private baseURI = 'http://localhost:5000/api/v1';

  loadNotifications() {
    this.getNotifications().subscribe((res) => {
      this.notificationsSubject.next(res.data);
      this.unreadCountSubject.next(res.unreadCount);
    });
  }

  markAsRead(notification: any) {
    if (notification.is_read) return;

    this.markAllNotificationsAsRead().subscribe({
      next: () => {
        const notifications = this.notificationsSubject.value;

        const updated = notifications.map((item) => {
          if (item.id === notification.id) {
            return {
              ...item,
              is_read: true,
            };
          }
          return item;
        });

        this.notificationsSubject.next(updated);
        this.unreadCountSubject.next(this.unreadCountSubject.value - 1);
      },
    });
  }

  getNotifications() {
    return this.http.get<any>(`${this.baseURI}/getNotifications`);
  }

  markAllNotificationsAsRead() {
    return this.http.patch(`${this.baseURI}/notifications/read-all`, {});
  }
}
