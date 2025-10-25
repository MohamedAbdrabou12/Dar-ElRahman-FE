import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent implements OnInit {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
  @Input() duration: number = 3000;

  visible = true;

  ngOnInit() {
    setTimeout(() => {
      this.closeToast();
    }, this.duration);
  }

  closeToast() {
    this.visible = false;
  }

  get iconClass(): string {
    switch (this.type) {
      case 'success':
        return 'fa-check-circle text-green-500';
      case 'error':
        return 'fa-times-circle text-red-500';
      case 'warning':
        return 'fa-exclamation-triangle text-yellow-500';
      default:
        return 'fa-info-circle text-blue-500';
    }
  }

  get bgColor(): string {
    switch (this.type) {
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  }
}
