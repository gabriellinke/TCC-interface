import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetInfoCardComponent } from './asset-info-card.component';

describe('AssetInfoCardComponent', () => {
  let component: AssetInfoCardComponent;
  let fixture: ComponentFixture<AssetInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetInfoCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
