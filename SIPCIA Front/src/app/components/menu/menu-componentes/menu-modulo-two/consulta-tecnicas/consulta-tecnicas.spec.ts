import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaTecnicas } from './consulta-tecnicas';

describe('ConsultaTecnicas', () => {
  let component: ConsultaTecnicas;
  let fixture: ComponentFixture<ConsultaTecnicas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaTecnicas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaTecnicas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
