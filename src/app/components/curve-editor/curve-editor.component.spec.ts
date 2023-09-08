import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurveEditorComponent } from './curve-editor.component';

describe('CurveEditorComponent', () => {
  let component: CurveEditorComponent;
  let fixture: ComponentFixture<CurveEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CurveEditorComponent]
    });
    fixture = TestBed.createComponent(CurveEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
