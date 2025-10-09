import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FomularioRegistroTwo } from './fomulario-registro-two';

describe('FomularioRegistroTwo', () => {
  let component: FomularioRegistroTwo;
  let fixture: ComponentFixture<FomularioRegistroTwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FomularioRegistroTwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FomularioRegistroTwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
