import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosAfroamericanas } from './documentos-afroamericanas';

describe('DocumentosAfroamericanas', () => {
  let component: DocumentosAfroamericanas;
  let fixture: ComponentFixture<DocumentosAfroamericanas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentosAfroamericanas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosAfroamericanas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
