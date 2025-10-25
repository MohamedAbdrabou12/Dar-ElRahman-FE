import { Component, Inject, Input } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { AlertService } from 'src/app/services/alert.service';

@Component({
  selector: 'app-alert',
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss',
})
export class AlertComponent {
  @Input() type: 'success' | 'error' = 'success';
  @Input() message: string = '';
  @Input() icon: string = '';
  @Input() color: string = '';
  @Input() background: string = '';

  constructor(
    @Inject(MAT_SNACK_BAR_DATA)
    public data: { message: string; type: 'success' | 'error' },
    private alertService: AlertService
  ) {
    this.message = data['message'];
    this.type = data['type'];
  }

  onDismiss() {
    this.alertService.dismiss();
  }
}
