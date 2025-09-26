import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorioAfromexicanasTwo } from './directorio-afromexicanas-two';

describe('DirectorioAfromexicanasTwo', () => {
  let component: DirectorioAfromexicanasTwo;
  let fixture: ComponentFixture<DirectorioAfromexicanasTwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DirectorioAfromexicanasTwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DirectorioAfromexicanasTwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
