import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HTreeViewSampleComponent } from './h-treeViewSample.component';

describe('HTreeViewSampleComponent', () => {
  let component: HTreeViewSampleComponent;
  let fixture: ComponentFixture<HTreeViewSampleComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ HTreeViewSampleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HTreeViewSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
