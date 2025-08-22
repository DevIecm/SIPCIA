import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteComunitaria } from './reporte-comunitaria';

describe('ReporteComunitaria', () => {
  let component: ReporteComunitaria;
  let fixture: ComponentFixture<ReporteComunitaria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteComunitaria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteComunitaria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
