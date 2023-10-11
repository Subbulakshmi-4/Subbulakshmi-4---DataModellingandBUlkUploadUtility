import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerConfigurationComponent } from './server-configuration.component';

describe('ServerConfigurationComponent', () => {
  let component: ServerConfigurationComponent;
  let fixture: ComponentFixture<ServerConfigurationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ServerConfigurationComponent]
    });
    fixture = TestBed.createComponent(ServerConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
