import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosIndigenasTwo } from './documentos-indigenas-two';

describe('DocumentosIndigenasTwo', () => {
  let component: DocumentosIndigenasTwo;
  let fixture: ComponentFixture<DocumentosIndigenasTwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentosIndigenasTwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosIndigenasTwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
