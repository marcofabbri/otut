import { TestBed } from '@angular/core/testing';

import { DoeverythingService } from './doeverything.service';

describe('DoeverythingService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DoeverythingService = TestBed.get(DoeverythingService);
    expect(service).toBeTruthy();
  });
});
