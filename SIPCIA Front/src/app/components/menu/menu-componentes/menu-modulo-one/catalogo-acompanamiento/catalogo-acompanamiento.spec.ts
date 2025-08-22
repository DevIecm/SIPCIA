import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoAcompanamiento } from './catalogo-acompanamiento';

describe('CatalogoAcompanamiento', () => {
  let component: CatalogoAcompanamiento;
  let fixture: ComponentFixture<CatalogoAcompanamiento>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoAcompanamiento]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoAcompanamiento);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
