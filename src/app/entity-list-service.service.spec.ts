import { TestBed } from '@angular/core/testing';

import { EntityListServiceService } from './entity-list-service.service';

describe('EntityListServiceService', () => {
  let service: EntityListServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntityListServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
