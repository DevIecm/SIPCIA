import { TestBed } from '@angular/core/testing';

import { DocumentosServices } from './documentos-services';

describe('DocumentosServices', () => {
  let service: DocumentosServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentosServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
