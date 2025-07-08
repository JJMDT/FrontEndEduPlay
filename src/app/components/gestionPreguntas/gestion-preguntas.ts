import { Component,OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreguntasService } from '../../services/preguntas/pregunta';
import {FormsModule,ReactiveFormsModule,FormBuilder,FormGroup,Validators,AbstractControl, FormArray} from '@angular/forms';
import { Pregunta } from '../../modelos/pregunta.model';
import { Ranking } from "../ranking/ranking";
import { RankingService } from '../../services/ranking/ranking';

@Component({
  selector: 'app-gestion-preguntas',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, Ranking],
  templateUrl: './gestion-preguntas.html',
  styleUrl: './gestion-preguntas.css'
})
export class GestionPreguntas implements OnInit{

  @ViewChild(Ranking) rankingComponent!: Ranking;

  preguntas: Pregunta[] = [];
  formulario!: FormGroup;
  preguntaEnEdicion: Pregunta | null = null;

    filtroTexto: string = '';
  preguntasFiltradas: Pregunta[] = [];

  //contantes

  readonly OPCIONES_MINIMAS = 2;
  readonly OPCIONES_MAXIMAS = 4;

  constructor(private preguntaService : PreguntasService, private fb : FormBuilder, private rankingService : RankingService ) {}

  ngOnInit(){

    this.iniciarFormularios();
    this.obtenerPreguntas();
    
  }

 
  reiniciarRanking() {
   this.rankingService.reiniciarRanking().subscribe({
    next: () => {
      alert('Ranking reiniciado correctamente');
      // Actualizar el componente ranking en tiempo real
      if (this.rankingComponent) {
        this.rankingComponent.actualizarRanking();
      }
    }, error: () =>{
      alert('Hubo un error al reiniciar el ranking');
    }
   })
  }

  private iniciarFormularios(): void {
    this.formulario = this.fb.group({
      pregunta: ['', Validators.required],
      opciones: this.fb.array([],[this.validarOpcionesUnicas.bind(this)]),
      respuestaCorrecta: ['', Validators.required]
    })

    this.crearOpciones()
  }

  private crearOpciones(): void {
    for (let i = 0; i < this.OPCIONES_MINIMAS; i++) {
      this.agregarOpcion();
    }
  }
  
 agregarOpcion(): void {
    if (this.puedeAgregarOpcion) {
      const nuevaOpcion = this.fb.control('', [
        Validators.required,
        Validators.minLength(1)
      ]);
      this.opciones.push(nuevaOpcion);
    }
  }
   eliminarOpcion(index: number): void {
    if (this.puedeEliminarOpcion && index >= 0 && index < this.cantidadOpciones) {
      this.opciones.removeAt(index);
      // Actualizar validación después de eliminar
      this.opciones.updateValueAndValidity();
    }
  }


  get opciones(): FormArray {
    return this.formulario.get('opciones') as FormArray;
  }

    get cantidadOpciones(): number {
    return this.opciones.length;
  }

  get puedeAgregarOpcion(): boolean {
    return this.cantidadOpciones < this.OPCIONES_MAXIMAS;
  }

    get puedeEliminarOpcion(): boolean {
    return this.cantidadOpciones > this.OPCIONES_MINIMAS;
  }

    private validarOpcionesUnicas(control: AbstractControl): {[key: string]: any} | null {
    const opciones = control.value;
    if (!opciones || opciones.length < 2) {
      return null; // No validar si no hay suficientes opciones
    }
  
    const opcionesLimpias = opciones
      .filter((opcion: string) => opcion && opcion.trim())
      .map((opcion: string) => opcion.trim().toLowerCase());

    const opcionesUnicas = new Set(opcionesLimpias);
    
    if (opcionesUnicas.size !== opcionesLimpias.length) {
      return { 'opcionesRepetidas': true };
    }

    return null;
  }

 private validarRespuestaCorrecta(): boolean {
    const respuestaCorrecta = this.formulario.get('respuestaCorrecta')?.value?.trim().toLowerCase();
    const opciones = this.opciones.value
      .filter((opcion: string) => opcion && opcion.trim())
      .map((opcion: string) => opcion.trim().toLowerCase());

    return opciones.includes(respuestaCorrecta);
  }

  /**
   * Obtiene las preguntas del servidor
   */
  obtenerPreguntas(): void {
    this.preguntaService.obtenerPreguntas().subscribe({
      next: (data) => {
        this.preguntas = this.procesarRespuestaPreguntas(data);
      },
      error: (err) => {
        console.error('Error al obtener preguntas', err);
        alert('Error al cargar las preguntas');
      }
    });
  }

  /**
   * Procesa la respuesta del servidor para normalizar los datos
   */
  private procesarRespuestaPreguntas(data: any): Pregunta[] {
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      const values = Object.values(data).filter(v => typeof v === 'object') as Pregunta[];
      if (values.length > 0 && 'pregunta' in values[0]) {
        return values;
      } else if ('pregunta' in data) {
        return [data as Pregunta];
      }
    }
    return [];
  }

  /**
   * Crea o actualiza una pregunta
   */
  crearPregunta(): void {
    if (!this.validarFormulario()) {
      return;
    }

    const nuevaPregunta: Pregunta = {
      pregunta: this.formulario.value.pregunta.trim(),
      opciones: this.opciones.value.filter((opcion: string) => opcion.trim()),
      respuestaCorrecta: this.formulario.value.respuestaCorrecta.trim()
    };

    const peticion = this.preguntaEnEdicion && this.preguntaEnEdicion._id
      ? this.preguntaService.actualizarPregunta(this.preguntaEnEdicion._id, nuevaPregunta)
      : this.preguntaService.crearPregunta(nuevaPregunta);

    peticion.subscribe({
      next: (res) => {
        const mensaje = this.preguntaEnEdicion ? 'Pregunta actualizada' : 'Pregunta creada';
        alert(mensaje);
        
        this.actualizarListaPreguntas(res, nuevaPregunta);
        this.resetFormulario();
      },
      error: (err) => {
        console.error('Error al guardar', err);
        alert('Error al guardar la pregunta');
      }
    });
  }

  /**
   * Valida el formulario completo
   */
  private validarFormulario(): boolean {
    // Validar formulario básico
    if (this.formulario.invalid) {
      alert('Por favor completa todos los campos correctamente.');
      return false;
    }

    // Validar opciones vacías
    const opcionesValidas = this.opciones.value.every((opt: string) => opt.trim() !== '');
    if (!opcionesValidas) {
      alert('Todas las opciones deben estar completas');
      return false;
    }

    // Validar opciones únicas
    if (this.opciones.errors?.['opcionesRepetidas']) {
      alert('Las opciones deben ser distintas entre sí');
      return false;
    }

    // Validar respuesta correcta
    if (!this.validarRespuestaCorrecta()) {
      alert('La respuesta correcta debe coincidir exactamente con una de las opciones');
      return false;
    }

    return true;
  }

  /**
   * Actualiza la lista de preguntas después de crear/editar
   */
  private actualizarListaPreguntas(respuesta: any, nuevaPregunta: Pregunta): void {
    if (this.preguntaEnEdicion) {
      const index = this.preguntas.findIndex(p => p._id === this.preguntaEnEdicion!._id);
      if (index !== -1) {
        this.preguntas[index] = { ...this.preguntaEnEdicion, ...nuevaPregunta };
      }
    } else {
      this.preguntas.push(respuesta);
    }
  }

  /**
   * Edita una pregunta existente y cambia al tab de crear
   */
  editarPregunta(pregunta: Pregunta): void {
    console.log('✏️ Editando pregunta:', pregunta);
    
    // Establecer pregunta en edición
    this.preguntaEnEdicion = pregunta;

    // Limpiar opciones actuales
    this.limpiarOpciones();

    // Llenar formulario con datos de la pregunta
    this.formulario.patchValue({
      pregunta: pregunta.pregunta,
      respuestaCorrecta: pregunta.respuestaCorrecta
    });

    // Agregar opciones de la pregunta
    pregunta.opciones.forEach(opcion => {
      this.opciones.push(this.fb.control(opcion, Validators.required));
    });

    // Cambiar automáticamente al tab de crear
    this.cambiarATabCrear();
  }

  /**
   * Cambia al tab de crear pregunta
   */
  private cambiarATabCrear(): void {
    try {
      // Buscar el botón del tab "Crear Pregunta"
      const homeTab = document.getElementById('home-tab');
      if (homeTab) {
        homeTab.click();
        console.log('🔄 Cambiado al tab de crear pregunta');
      } else {
        console.error('❌ No se encontró el tab home-tab');
      }
    } catch (error) {
      console.error('❌ Error al cambiar de tab:', error);
    }
  }

  /**
   * Elimina una pregunta
   */
  eliminar(id?: string): void {
    if (!id) {
      alert('ID inválido');
      return;
    }

    if (confirm('¿Seguro que querés eliminar esta pregunta?')) {
      this.preguntaService.eliminarPregunta(id).subscribe({
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

  /**
   * Resetea el formulario a su estado inicial
   */
  resetFormulario(): void {
    this.formulario.reset();
    this.preguntaEnEdicion = null;
    this.limpiarOpciones();
    this.crearOpciones();
  }

  /**
   * Limpia todas las opciones del FormArray
   */
  private limpiarOpciones(): void {
    while (this.opciones.length) {
      this.opciones.removeAt(0);
    }
  }

  /**
   * Versión mejorada: Edita pregunta con feedback visual
   */
  editarPreguntaConAnimacion(pregunta: Pregunta): void {
    try {
      console.log('✏️ Iniciando edición con animación:', pregunta);
      
      // Mostrar estado de carga en el botón
      const btnEditar = event?.target as HTMLElement;
      const btnOriginal = btnEditar?.innerHTML;
      
      if (btnEditar) {
        btnEditar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Cargando...';
        (btnEditar as HTMLButtonElement).disabled = true;
      }

      // Establecer pregunta en edición
      this.preguntaEnEdicion = pregunta;

      // Preparar formulario
      this.prepararFormularioParaEdicion(pregunta);

      // Cambiar al tab con delay para mejor UX
      setTimeout(() => {
        this.cambiarATabCrear();
        
        // Restaurar botón
        if (btnEditar && btnOriginal) {
          btnEditar.innerHTML = btnOriginal;
          (btnEditar as HTMLButtonElement).disabled = false;
        }
        
        // Resaltar formulario
        this.resaltarFormularioEdicion();
      }, 500);

    } catch (error) {
      console.error('❌ Error al editar pregunta:', error);
      alert('Error al cargar la pregunta para edición');
    }
  }

  /**
   * Prepara el formulario para edición
   */
  private prepararFormularioParaEdicion(pregunta: Pregunta): void {
    // Limpiar opciones actuales
    this.limpiarOpciones();

    // Llenar campos básicos
    this.formulario.patchValue({
      pregunta: pregunta.pregunta,
      respuestaCorrecta: pregunta.respuestaCorrecta
    });

    // Agregar opciones dinámicamente
    pregunta.opciones.forEach(opcion => {
      this.opciones.push(this.fb.control(opcion, Validators.required));
    });

    console.log('📝 Formulario preparado para edición');
  }

  /**
   * Resalta el formulario cuando está en modo edición
   */
  private resaltarFormularioEdicion(): void {
    const formulario = document.querySelector('.formulario');
    if (formulario) {
      formulario.classList.add('modo-edicion');
      
      // Scroll al formulario
      formulario.scrollIntoView({ behavior: 'smooth' });
      
      // Quitar clase después de 3 segundos
      setTimeout(() => {
        formulario.classList.remove('modo-edicion');
      }, 3000);
    }
  }
}

