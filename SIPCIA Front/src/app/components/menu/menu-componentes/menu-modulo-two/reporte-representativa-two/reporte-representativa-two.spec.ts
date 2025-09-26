import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteRepresentativaTwo } from './reporte-representativa-two';

describe('ReporteRepresentativaTwo', () => {
  let component: ReporteRepresentativaTwo;
  let fixture: ComponentFixture<ReporteRepresentativaTwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteRepresentativaTwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReporteRepresentativaTwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
