import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): boolean {

    
    const esAdmin = this.auth.isLoggedIn() && this.auth.getUser() === 'admin';
    if (!esAdmin) {
      this.router.navigate(['/login']); 
      return false;
    }
    return true;
  }
}