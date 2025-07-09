import { Component } from '@angular/core';
import { RouterModule,Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-header',
  standalone: true, 
  imports: [RouterModule,CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header{

constructor(public auth: Auth, private router: Router) {}


 logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
  

}
