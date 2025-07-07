import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreguntasService } from '../../services/preguntas/pregunta';
import { Pregunta } from '../../modelos/pregunta.model';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-listar-preguntas',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, ReactiveFormsModule],
  templateUrl: './listar-preguntas.html',
  styleUrls: ['./listar-preguntas.css']
})
export class ListarPreguntas implements OnInit {

  preguntas: Pregunta[] = [];

  formulario!: FormGroup;

  preguntaEnEdicion: Pregunta | null = null;

  constructor(private preguntasService: PreguntasService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.obtenerPreguntas();

    this.formulario = this.fb.group({
      pregunta: ['', Validators.required],
      opciones: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required),
      ]),
      respuestaCorrecta: ['', Validators.required]
    });
  }

  get opciones() {
    return this.formulario.get('opciones') as FormArray;
  }

  obtenerPreguntas() {
    this.preguntasService.obtenerPreguntas().subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.preguntas = data;
        } else if (data && typeof data === 'object' && !Array.isArray(data)) {
          const values = Object.values(data).filter(v => typeof v === 'object') as Pregunta[];
          if (values.length > 0 && 'pregunta' in values[0]) {
            this.preguntas = values;
          } else if ('pregunta' in data) {
            this.preguntas = [data as Pregunta];
          } else {
            this.preguntas = [];
          }
        } else {
          this.preguntas = [];
        }
      },
      error: (err) => console.error('Error al obtener preguntas', err)
    });
  }

  crearPregunta() {
    if (this.formulario.invalid) {
      alert('Por favor completa todos los campos correctamente.');
      return;
    }

    const nuevaPregunta: Pregunta = {
      pregunta: this.formulario.value.pregunta,
      opciones: this.formulario.value.opciones,
      respuestaCorrecta: this.formulario.value.respuestaCorrecta
    };

    const opcionesValidas = nuevaPregunta.opciones.every(opt => opt.trim() !== '');
    if (!opcionesValidas) {
      alert('Todas las opciones deben estar completas');
      return;
    }

    const opcionesUnicas = new Set(nuevaPregunta.opciones.map(opt => opt.trim().toLowerCase()));
    if (opcionesUnicas.size !== nuevaPregunta.opciones.length) {
      alert('Las opciones deben ser distintas entre sí');
      return;
    }

    const respuestaCoincide = nuevaPregunta.opciones
      .map(opt => opt.trim().toLowerCase())
      .includes(nuevaPregunta.respuestaCorrecta.trim().toLowerCase());
    if (!respuestaCoincide) {
      alert('La respuesta correcta debe coincidir exactamente con una de las opciones');
      return;
    }

    const peticion = this.preguntaEnEdicion && this.preguntaEnEdicion._id
    ? this.preguntasService.actualizarPregunta(this.preguntaEnEdicion._id, nuevaPregunta)
    : this.preguntasService.crearPregunta(nuevaPregunta);

    peticion.subscribe({
      next: (res) => {
        alert(this.preguntaEnEdicion ? 'Pregunta actualizada' : 'Pregunta creada');

        if (this.preguntaEnEdicion) {
          const index = this.preguntas.findIndex(p => p._id === this.preguntaEnEdicion!._id);
          if (index !== -1) {
            this.preguntas[index] = { ...this.preguntaEnEdicion, ...nuevaPregunta };
          }
        } else {
          this.preguntas.push(res);
        }

        this.resetFormulario();
      },
      error: (err) => {
        console.error('Error al guardar', err);
        alert('Error al guardar la pregunta');
      }
    });
  }

   editarPregunta(pregunta: Pregunta) {
    this.preguntaEnEdicion = pregunta;

    this.formulario.patchValue({
      pregunta: pregunta.pregunta,
      respuestaCorrecta: pregunta.respuestaCorrecta
    });

    while (this.opciones.length) this.opciones.removeAt(0);
    for (const opcion of pregunta.opciones) {
      this.opciones.push(this.fb.control(opcion, Validators.required));
    }
  }

  eliminar(id?: string) {
    if (!id) {
      alert('ID inválido');
      return;
    }
    if (confirm('¿Seguro que querés eliminar esta pregunta?')) {
      this.preguntasService.eliminarPregunta(id).subscribe({
        next: () => {
          alert('Pregunta eliminada');
          this.obtenerPreguntas();
        },
        error: (err) => {
          console.error('Error al eliminar pregunta', err);
          alert('Error al eliminar la pregunta');
        }
      });
    }
  }

  resetFormulario() {
   this.formulario.reset();
   this.preguntaEnEdicion = null;

   while (this.opciones.length) this.opciones.removeAt(0);
   for (let i = 0; i < 4; i++) {
      this.opciones.push(this.fb.control('', Validators.required));
    }
  }

}
