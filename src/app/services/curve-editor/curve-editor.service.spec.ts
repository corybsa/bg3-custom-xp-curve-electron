import { TestBed } from '@angular/core/testing';

import { CurveEditorService } from './curve-editor.service';

describe('CurveEditorService', () => {
  let service: CurveEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurveEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
