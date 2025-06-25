import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://44.202.218.94:3000/auth/login';

  constructor( private http: HttpClient) { }

  login(credenciales: {username: string, password:string}) : Observable<any> {
    return this.http.post(this.apiUrl, credenciales)
  }
}
