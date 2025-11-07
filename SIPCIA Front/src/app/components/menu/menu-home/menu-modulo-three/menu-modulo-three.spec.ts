import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuModuloThree } from './menu-modulo-three';

describe('MenuModuloThree', () => {
  let component: MenuModuloThree;
  let fixture: ComponentFixture<MenuModuloThree>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuModuloThree]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuModuloThree);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
