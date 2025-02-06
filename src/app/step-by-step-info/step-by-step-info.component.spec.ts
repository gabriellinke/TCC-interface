import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepByStepInfoComponent } from './step-by-step-info.component';

describe('StepByStepInfoComponent', () => {
  let component: StepByStepInfoComponent;
  let fixture: ComponentFixture<StepByStepInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepByStepInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepByStepInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
