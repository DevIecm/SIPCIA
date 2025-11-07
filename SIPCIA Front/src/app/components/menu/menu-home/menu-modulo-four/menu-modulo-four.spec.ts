import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuModuloFour } from './menu-modulo-four';

describe('MenuModuloFour', () => {
  let component: MenuModuloFour;
  let fixture: ComponentFixture<MenuModuloFour>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuModuloFour]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuModuloFour);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
