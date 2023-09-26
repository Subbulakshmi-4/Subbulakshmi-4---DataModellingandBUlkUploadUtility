import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaytableNameComponent } from './displaytable-name.component';

describe('DisplaytableNameComponent', () => {
  let component: DisplaytableNameComponent;
  let fixture: ComponentFixture<DisplaytableNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DisplaytableNameComponent]
    });
    fixture = TestBed.createComponent(DisplaytableNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
