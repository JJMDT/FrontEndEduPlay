import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/auth/login-service';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  mensaje: string | null = null;
  isLoading: boolean = false;

  constructor(
    private loginService: LoginService,
    private auth: Auth,
    private router: Router
  ) {}

  onSubmit() {
    if (!this.validarCampos()) {
      return;
    }

    this.isLoading = true;
    this.mensaje = null;

    const credenciales = { username: this.username, password: this.password };

    this.loginService.login(credenciales).subscribe({
      next: (response) => {
        this.loginExitoso(response);
      },
      error: (error) => {
        this.mensaje = error.error.error;
      },complete: () =>{
        this.isLoading = false;
      }
    });
  }

  validarCampos(): boolean {
    if (!this.username.trim()) {
      this.mensaje = 'El nombre de usuario es obligatorio.';
      return false;
    }
    if (!this.password.trim()) {
      this.mensaje = 'La contraseña es obligatoria.';
      return false;
    }

    return true;
  }

  loginExitoso(response: any): void {
    console.log('login exitoso', response);
    this.auth.setLoginState(this.username);  
    this.router.navigate(['/admin']);  

  }
}
