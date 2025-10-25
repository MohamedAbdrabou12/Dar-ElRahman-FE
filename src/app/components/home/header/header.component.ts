import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-header',
  standalone: true,
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: string = '';
  constructor() {}
  ngOnInit(): void {
    const session_token = localStorage.getItem('token');
    console.log(session_token ? this.decodeJwt(session_token) : 'Empty');
    this.currentUser = session_token
      ? this.decodeJwt(session_token).sub
      : this.currentUser;
  }
  decodeJwt(token: string): any {
    try {
      const [header, payload, signature] = token.split('.');
      // Decode the Base64-encoded payload
      const decodedPayload = atob(payload);
      console.log("The authenticated user is:-", decodedPayload);
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Failed to decode JWT:', error);
      return null;
    }
  }
}
