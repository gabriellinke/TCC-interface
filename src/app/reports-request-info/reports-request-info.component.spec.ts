import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsRequestInfoComponent } from './reports-request-info.component';

describe('ReportsRequestInfoComponent', () => {
  let component: ReportsRequestInfoComponent;
  let fixture: ComponentFixture<ReportsRequestInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportsRequestInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReportsRequestInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
