import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPersonas } from './formulario-personas';

describe('FormularioPersonas', () => {
  let component: FormularioPersonas;
  let fixture: ComponentFixture<FormularioPersonas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPersonas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioPersonas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
