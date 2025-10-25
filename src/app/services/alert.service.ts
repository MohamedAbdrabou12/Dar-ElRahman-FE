import { Injectable } from '@angular/core';
import { AlertComponent } from '../components/shared/alert/alert.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class AlertService {

  constructor(private _snackBar: MatSnackBar) {
  }

  error(message: string) {
    return this._snackBar.openFromComponent(AlertComponent, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      data: {message: message, type: 'error'},
    });
  }

  success(message: string) {
    return this._snackBar.openFromComponent(AlertComponent, {
      duration: 5000,
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      data: {message: message, type: 'success'},
    });
  }

  dismiss() {
    this._snackBar.dismiss();
  }

}
