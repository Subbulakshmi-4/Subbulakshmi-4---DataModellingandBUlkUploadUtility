import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputcolumnsComponent } from './inputcolumns.component';

describe('InputcolumnsComponent', () => {
  let component: InputcolumnsComponent;
  let fixture: ComponentFixture<InputcolumnsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InputcolumnsComponent]
    });
    fixture = TestBed.createComponent(InputcolumnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
