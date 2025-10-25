import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loading = signal<boolean>(false);

  startLoading(){
    this.loading.set(true);
  }
  stopLoading(){
    this.loading.set(false);
  }

  get isLoading(): boolean{
    return this.loading();
  }
}
