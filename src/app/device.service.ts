import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeviceService implements OnDestroy {
  private mobileDeviceSubject = new BehaviorSubject<boolean>(false);
  mobileDevice$ = this.mobileDeviceSubject.asObservable();
  private resizeSubscription: Subscription;

  constructor() {
    // Inicializa o estado inicial
    this.updateDeviceStatus(window.innerWidth);

    // Escuta os eventos de resize
    this.resizeSubscription = fromEvent(window, 'resize')
      .pipe(map((event: Event) => (event.target as Window).innerWidth))
      .subscribe(width => this.updateDeviceStatus(width));
  }

  private updateDeviceStatus(width: number): void {
    this.mobileDeviceSubject.next(width <= 768);
  }

  ngOnDestroy(): void {
    // Limpa a inscrição ao destruir o serviço
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }
}
