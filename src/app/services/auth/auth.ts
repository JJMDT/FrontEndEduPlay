import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {
private loggedIn: boolean = false;
private user: string | null = null;

// BehaviorSubjects para hacer el estado reactivo
private loggedInSubject = new BehaviorSubject<boolean>(false);
private userSubject = new BehaviorSubject<string | null>(null);

// Observables públicos
public loggedIn$ = this.loggedInSubject.asObservable();
public user$ = this.userSubject.asObservable();

constructor() { 
  // Inicializar estado desde localStorage al cargar el servicio
  this.initializeFromStorage();
}

/**
 * Inicializa el estado de autenticación desde localStorage
 */
private initializeFromStorage(): void {
  const storedLoggedIn = localStorage.getItem('loggedIn');
  const storedUser = localStorage.getItem('user');
  
  if (storedLoggedIn === 'true' && storedUser) {
    this.loggedIn = true;
    this.user = storedUser;
    
    // Actualizar BehaviorSubjects
    this.loggedInSubject.next(true);
    this.userSubject.next(storedUser);
    
    console.log('🔑 Sesión restaurada desde localStorage:', storedUser);
  }
}

setLoginState (nombre:string){
  this.loggedIn = true;
  this.user = nombre;
  
  // Guardar en localStorage para persistir la sesión
  localStorage.setItem('loggedIn', 'true');
  localStorage.setItem('user', nombre);
  
  // Actualizar BehaviorSubjects para notificar cambios
  this.loggedInSubject.next(true);
  this.userSubject.next(nombre);
  
  console.log('🔑 Login exitoso:', nombre);
}

isLoggedIn(): boolean {
  const isLoggedFromStorage = localStorage.getItem('loggedIn') === 'true';
  
  // Sincronizar estado interno si hay discrepancia
  if (isLoggedFromStorage && !this.loggedIn) {
    this.initializeFromStorage();
  }
  
  return isLoggedFromStorage;
}

logout() {
  this.loggedIn = false;
  this.user = null;
  localStorage.removeItem('loggedIn');
  localStorage.removeItem('user');
  
  // Actualizar BehaviorSubjects
  this.loggedInSubject.next(false);
  this.userSubject.next(null);
  
  console.log('🔑 Logout exitoso');
}

getUser() : string | null {
  // Si no hay usuario en memoria pero sí en localStorage, restaurar estado
  if (!this.user && localStorage.getItem('loggedIn') === 'true') {
    this.initializeFromStorage();
  }
  
  return this.user || localStorage.getItem('user');
}
}
