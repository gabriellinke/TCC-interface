import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BackendService } from '../backend.service';
import { FORBIDDEN_403 } from '../../constants/constants';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public backendService: BackendService = inject(BackendService);
  public router: Router = inject(Router);

  public login(email: string, password: string) {
    this.backendService.login(email, password).subscribe({
      next: data => {
        console.log('Logged in successfully:', data);
        this.router.navigate(['/']);
      },
      error: error => {
        if(error.message === FORBIDDEN_403) {
          alert(error.message);
        }
        console.error(error.message);
      }
    });
  }
}
