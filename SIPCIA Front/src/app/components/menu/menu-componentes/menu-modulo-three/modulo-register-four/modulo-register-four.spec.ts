import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuloRegisterFour } from './modulo-register-four';

describe('ModuloRegisterFour', () => {
  let component: ModuloRegisterFour;
  let fixture: ComponentFixture<ModuloRegisterFour>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModuloRegisterFour]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModuloRegisterFour);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
