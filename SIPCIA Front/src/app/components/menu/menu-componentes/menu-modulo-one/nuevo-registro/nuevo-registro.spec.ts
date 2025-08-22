import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoRegistro } from './nuevo-registro';

describe('NuevoRegistro', () => {
  let component: NuevoRegistro;
  let fixture: ComponentFixture<NuevoRegistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoRegistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoRegistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
