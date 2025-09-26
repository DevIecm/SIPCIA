import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroComunitaria } from './registro-comunitaria';

describe('RegistroComunitaria', () => {
  let component: RegistroComunitaria;
  let fixture: ComponentFixture<RegistroComunitaria>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroComunitaria]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistroComunitaria);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
