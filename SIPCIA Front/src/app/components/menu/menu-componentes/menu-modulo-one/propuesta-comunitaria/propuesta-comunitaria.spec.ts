import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropuestaComunitaria } from './propuesta-comunitaria';

describe('PropuestaComunitaria', () => {
  let component: PropuestaComunitaria;
  let fixture: ComponentFixture<PropuestaComunitaria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropuestaComunitaria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropuestaComunitaria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
