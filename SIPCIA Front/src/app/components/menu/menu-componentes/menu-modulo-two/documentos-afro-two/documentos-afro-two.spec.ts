import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentosAfroTwo } from './documentos-afro-two';

describe('DocumentosAfroTwo', () => {
  let component: DocumentosAfroTwo;
  let fixture: ComponentFixture<DocumentosAfroTwo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentosAfroTwo]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentosAfroTwo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
