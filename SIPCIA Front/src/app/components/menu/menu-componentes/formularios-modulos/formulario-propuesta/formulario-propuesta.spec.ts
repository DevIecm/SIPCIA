import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioPropuesta } from './formulario-propuesta';

describe('FormularioPropuesta', () => {
  let component: FormularioPropuesta;
  let fixture: ComponentFixture<FormularioPropuesta>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioPropuesta]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioPropuesta);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
