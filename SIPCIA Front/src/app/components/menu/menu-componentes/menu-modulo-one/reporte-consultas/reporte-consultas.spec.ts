import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteConsultas } from './reporte-consultas';

describe('ReporteConsultas', () => {
  let component: ReporteConsultas;
  let fixture: ComponentFixture<ReporteConsultas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteConsultas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteConsultas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
