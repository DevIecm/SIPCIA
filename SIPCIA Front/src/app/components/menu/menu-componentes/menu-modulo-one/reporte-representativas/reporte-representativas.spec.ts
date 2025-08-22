import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteRepresentativas } from './reporte-representativas';

describe('ReporteRepresentativas', () => {
  let component: ReporteRepresentativas;
  let fixture: ComponentFixture<ReporteRepresentativas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteRepresentativas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteRepresentativas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
