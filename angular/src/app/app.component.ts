import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './core/services/socket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular';

  constructor( private socketService: SocketService){}

  ngOnInit(){
      const user = JSON.parse(
      localStorage.getItem('user') || '{}'
      );
      
      if (user?.id) {
        this.socketService.connect(user.id);
      }
  }

}
