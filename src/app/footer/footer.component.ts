import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DeviceService } from '../device.service';

@Component({
    selector: 'app-footer',
    imports: [CommonModule],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{
  public router: Router = inject(Router);
  public deviceService: DeviceService = inject(DeviceService);
  public isAtHome: boolean = false;
  public isAtInfo: boolean = false;
  public isAtSearch: boolean = false;
  public isMobileDevice: boolean = false;

  ngOnInit(): void {
    this.isAtInfo = this.router.url.includes('details');
    this.isAtSearch = this.router.url.includes('search');
    this.isAtHome = !this.isAtInfo && !this.isAtSearch;

    this.deviceService.mobileDevice$.subscribe(isMobile => {
      this.isMobileDevice = isMobile;
    });
  }

  public goToHome() {
    this.router.navigate([`/`]);
  }

  public goToInfo() {
    this.router.navigate([`/details`]);
  }

  public goToSearch() {
    this.router.navigate([`/search`]);
  }
}
