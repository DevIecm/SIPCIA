import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioDocumentos } from './formulario-documentos';

describe('FormularioDocumentos', () => {
  let component: FormularioDocumentos;
  let fixture: ComponentFixture<FormularioDocumentos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioDocumentos]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioDocumentos);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
