import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosIndigenas } from './documentos-indigenas';

describe('DocumentosIndigenas', () => {
  let component: DocumentosIndigenas;
  let fixture: ComponentFixture<DocumentosIndigenas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentosIndigenas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosIndigenas);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
