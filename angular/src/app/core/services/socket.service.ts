import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  
  socket!: Socket;

  private notificationSubject = new Subject<any>();
  readonly notification$ = this.notificationSubject.asObservable();

  constructor() {}

  connect(userId: string) {
    
    if (this.socket) {return;} //Checks if socket already exists. Checks if socket already exists.if yes: Don't create another connection.

    this.socket = io('http://localhost:5000', { // Creates a Socket.IO client. At this moment, it tries to connect to your backend.
      transports: ['websocket'],
      reconnection: false,
    });

    this.socket.connect(); //Starts the connection. Browser sends:Connect Request to Node.js Socket Server

    this.socket.on('connect', () => { // Runs after backend accepts the connection.
      console.log('Socket connected');
      this.socket?.emit('join', userId); // Frontend sends Event, join, Data, userId
    });

    this.socket.on('new-notification', (notification) => {
      this.notificationSubject.next(notification);
    });

    this.socket.on('disconnect', () => { // Runs when Browser closed, Internet lost, Logout
      console.log('Socket Disconnected');
    });

    this.socket.on('connect_error', (err) => {
      console.log(' Socket Error:', err);
    });
  }

  // disconnect() {
  //   this.socket?.disconnect();
  //   this.socket = null;
  // }

}
