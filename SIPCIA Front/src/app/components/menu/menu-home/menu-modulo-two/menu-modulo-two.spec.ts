import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuModuloTwo } from './menu-modulo-two';

describe('MenuModuloTwo', () => {
  let component: MenuModuloTwo;
  let fixture: ComponentFixture<MenuModuloTwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuModuloTwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuModuloTwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
