import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorioAfroamericanas } from './directorio-afroamericanas';

describe('DirectorioAfroamericanas', () => {
  let component: DirectorioAfroamericanas;
  let fixture: ComponentFixture<DirectorioAfroamericanas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorioAfroamericanas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectorioAfroamericanas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
