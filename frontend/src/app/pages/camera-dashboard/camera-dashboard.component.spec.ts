import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraDashboardComponent } from './camera-dashboard.component';

describe('CameraDashboardComponent', () => {
  let component: CameraDashboardComponent;
  let fixture: ComponentFixture<CameraDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CameraDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CameraDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
