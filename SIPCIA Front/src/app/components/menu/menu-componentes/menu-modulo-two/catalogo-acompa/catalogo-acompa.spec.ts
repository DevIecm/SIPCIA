import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoAcompa } from './catalogo-acompa';

describe('CatalogoAcompa', () => {
  let component: CatalogoAcompa;
  let fixture: ComponentFixture<CatalogoAcompa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoAcompa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CatalogoAcompa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
