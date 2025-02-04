import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnserviceableAssetsInfoComponent } from './unserviceable-assets-info.component';

describe('UnserviceableAssetsInfoComponent', () => {
  let component: UnserviceableAssetsInfoComponent;
  let fixture: ComponentFixture<UnserviceableAssetsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnserviceableAssetsInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnserviceableAssetsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
