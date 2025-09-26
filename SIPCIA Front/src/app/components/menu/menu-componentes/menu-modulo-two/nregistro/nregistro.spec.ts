import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Nregistro } from './nregistro';

describe('Nregistro', () => {
  let component: Nregistro;
  let fixture: ComponentFixture<Nregistro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Nregistro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Nregistro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
