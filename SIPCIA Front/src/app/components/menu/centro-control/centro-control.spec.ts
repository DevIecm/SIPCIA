import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentroControl } from './centro-control';

describe('CentroControl', () => {
  let component: CentroControl;
  let fixture: ComponentFixture<CentroControl>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentroControl]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CentroControl);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
