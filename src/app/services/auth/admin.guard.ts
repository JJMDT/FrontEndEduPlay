import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';


@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private auth: Auth, private router: Router) {}

  canActivate(): boolean {
    
    const isLoggedIn = this.auth.isLoggedIn();
    const user = this.auth.getUser();
    
    
    const esAdmin = isLoggedIn && user === 'admin';
    
    if (!esAdmin) {
      this.router.navigate(['/login']); 
      return false;
    }
    
    return true;
  }
}