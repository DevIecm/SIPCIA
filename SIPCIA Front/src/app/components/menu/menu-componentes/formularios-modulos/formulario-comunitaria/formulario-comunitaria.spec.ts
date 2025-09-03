import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioComunitaria } from './formulario-comunitaria';

describe('FormularioComunitaria', () => {
  let component: FormularioComunitaria;
  let fixture: ComponentFixture<FormularioComunitaria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioComunitaria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioComunitaria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
