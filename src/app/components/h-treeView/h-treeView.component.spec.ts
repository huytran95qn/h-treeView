import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HTreeViewComponent } from './h-treeView.component';

describe('HTreeComponent', () => {
  let component: HTreeViewComponent<any>;
  let fixture: ComponentFixture<HTreeViewComponent<any>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HTreeViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
