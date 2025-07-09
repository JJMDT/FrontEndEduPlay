import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-presentacion',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './presentacion.html',
  styleUrl: './presentacion.css'
})
export class Presentacion {
  integrantes = [
    { nombre: 'Claudia', rol: 'Frontend & Backend', foto: '004.png' },
    { nombre: 'Juan', rol: 'Frontend & Backend', foto: 'sql.webp' },
    { nombre: 'Lisett', rol: 'Frontend & Backend', foto: 'perro.jpg' },
    { nombre: 'Jean', rol: 'Frontend & Backend', foto: 'yoshi2.jpg' }
  ];
}
