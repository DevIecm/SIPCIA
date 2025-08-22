import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHome } from './menu-home';

describe('MenuHome', () => {
  let component: MenuHome;
  let fixture: ComponentFixture<MenuHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
