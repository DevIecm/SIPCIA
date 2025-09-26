import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorioIndigenasTwo } from './directorio-indigenas-two';

describe('DirectorioIndigenasTwo', () => {
  let component: DirectorioIndigenasTwo;
  let fixture: ComponentFixture<DirectorioIndigenasTwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorioIndigenasTwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectorioIndigenasTwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
