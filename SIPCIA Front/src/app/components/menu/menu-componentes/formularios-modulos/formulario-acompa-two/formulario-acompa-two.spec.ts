import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioAcompaTwo } from './formulario-acompa-two';

describe('FormularioAcompaTwo', () => {
  let component: FormularioAcompaTwo;
  let fixture: ComponentFixture<FormularioAcompaTwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioAcompaTwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioAcompaTwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
