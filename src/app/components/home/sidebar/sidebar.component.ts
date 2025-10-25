import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {RouterLink, RouterLinkActive, RouterModule} from '@angular/router';
import {AppRoutes} from 'src/app/constants/app-routes';
import {AuthService} from 'src/app/services/auth.service';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive, MatTooltipModule],
})
export class SidebarComponent {
  public readonly AppRoutes = AppRoutes;
  isMinimized = false;

  constructor(protected authService: AuthService) {
  }

  toggleSidebar() {
    this.isMinimized = !this.isMinimized;
  }
}
