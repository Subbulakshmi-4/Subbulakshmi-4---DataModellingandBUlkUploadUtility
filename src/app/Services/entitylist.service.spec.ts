import { TestBed } from '@angular/core/testing';

import { EntitylistService } from './entitylist.service';

describe('EntitylistService', () => {
  let service: EntitylistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntitylistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
