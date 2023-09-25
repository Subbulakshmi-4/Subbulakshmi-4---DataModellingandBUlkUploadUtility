import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablenamelistComponent } from './tablenamelist.component';

describe('TablenamelistComponent', () => {
  let component: TablenamelistComponent;
  let fixture: ComponentFixture<TablenamelistComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TablenamelistComponent]
    });
    fixture = TestBed.createComponent(TablenamelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
