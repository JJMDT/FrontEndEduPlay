import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'https://kuf0ha66z0.execute-api.us-east-1.amazonaws.com/auth/login';
  //private apiUrl = 'http://localhost:3000/auth/login'; // URL local para desarrollo


  constructor( private http: HttpClient) { }

  login(credenciales: {username: string, password:string}) : Observable<any> {
    return this.http.post(this.apiUrl, credenciales)
  }
}
