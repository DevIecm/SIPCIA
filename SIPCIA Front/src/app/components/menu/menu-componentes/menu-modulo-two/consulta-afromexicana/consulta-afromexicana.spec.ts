import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaAfromexicana } from './consulta-afromexicana';

describe('ConsultaAfromexicana', () => {
  let component: ConsultaAfromexicana;
  let fixture: ComponentFixture<ConsultaAfromexicana>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultaAfromexicana]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultaAfromexicana);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
