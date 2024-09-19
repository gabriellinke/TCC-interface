import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileGenerationComponent } from './file-generation.component';

describe('FileGenerationComponent', () => {
  let component: FileGenerationComponent;
  let fixture: ComponentFixture<FileGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileGenerationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
