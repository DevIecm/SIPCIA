import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorioIndigenas } from './directorio-indigenas';

describe('DirectorioIndigenas', () => {
  let component: DirectorioIndigenas;
  let fixture: ComponentFixture<DirectorioIndigenas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorioIndigenas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectorioIndigenas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
