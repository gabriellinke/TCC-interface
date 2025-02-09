import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeiInfoComponent } from './sei-info.component';

describe('SeiInfoComponent', () => {
  let component: SeiInfoComponent;
  let fixture: ComponentFixture<SeiInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeiInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeiInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
