import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioConsultas } from './formulario-consultas';

describe('FormularioConsultas', () => {
  let component: FormularioConsultas;
  let fixture: ComponentFixture<FormularioConsultas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioConsultas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioConsultas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
