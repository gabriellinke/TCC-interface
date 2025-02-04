import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Router } from '@angular/router';
import { DeviceService } from '../device.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
    selector: 'app-header',
    imports: [CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit{
  public router: Router = inject(Router);
  public deviceService: DeviceService = inject(DeviceService);
  public location: Location = inject(Location);
  public oauthService: OAuthService = inject(OAuthService);
  public isHomePage: boolean = false;
  public isMobileDevice: boolean = false;
  public isSidebarVisible: boolean = false;

  ngOnInit(): void {
    this.isHomePage = this.router.url === '/';

    this.deviceService.mobileDevice$.subscribe(isMobile => {
      this.isMobileDevice = isMobile;
    });
  }

  public goBack() {
    this.location.back();
  }

  public toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible; // Alterna a visibilidade do sidebar
  }

  public logout() {
    this.oauthService.logOut();
  }
}
