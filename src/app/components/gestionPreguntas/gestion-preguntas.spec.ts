import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPreguntas } from './gestion-preguntas';

describe('GestionPreguntas', () => {
  let component: GestionPreguntas;
  let fixture: ComponentFixture<GestionPreguntas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionPreguntas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionPreguntas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
