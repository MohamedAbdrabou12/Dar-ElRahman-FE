import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile/profile.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  currentUser: string = '';
  userEmail: string = '';
  userGender: string = '';
  profilePictureUrl: string = '';
  isDropdownOpen: boolean = false;
  isUploadingPicture: boolean = false;

  constructor(public authService: AuthService, private profileService: ProfileService) {}
  ngOnInit(): void {
    this.currentUser = this.authService.getFullName() || '';
    this.userGender = this.authService.getGender() || '';
    const session_token = localStorage.getItem('token');
    if (session_token) {
      const decoded = this.decodeJwt(session_token);
      this.userEmail = decoded?.sub || '';
    }
    // Fetch latest profile from backend (in case JWT is stale)
    this.profileService.getProfile().subscribe({
      next: (res: any) => {
        const data = res.data;
        if (data?.profilePictureUrl) this.profilePictureUrl = data.profilePictureUrl;
        if (data?.gender) this.userGender = data.gender;
      },
      error: () => {}
    });
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  logout(): void {
    this.closeDropdown();
    this.authService.logout();
  }

  getDefaultAvatar(): string {
    return this.userGender === 'FEMALE' ? 'fas fa-female' : 'fas fa-user';
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const file = input.files[0];
    if (file.size > 500 * 1024) {
      alert('حجم الصورة يجب أن يكون أقل من 500 كيلوبايت');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      this.isUploadingPicture = true;
      this.profileService.updateProfilePicture(base64).subscribe({
        next: () => {
          this.profilePictureUrl = base64;
          this.isUploadingPicture = false;
        },
        error: () => {
          this.isUploadingPicture = false;
        }
      });
    };
    reader.readAsDataURL(file);
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
