import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioRegistroa } from './formulario-registroa';

describe('FormularioRegistroa', () => {
  let component: FormularioRegistroa;
  let fixture: ComponentFixture<FormularioRegistroa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioRegistroa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioRegistroa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
