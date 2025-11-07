import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloRegister } from './modulo-register';

describe('ModuloRegister', () => {
  let component: ModuloRegister;
  let fixture: ComponentFixture<ModuloRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
