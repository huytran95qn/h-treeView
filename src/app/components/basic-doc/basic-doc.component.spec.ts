import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BasicDocsComponent } from './basic-doc.component';

describe('BasicDocsComponent', () => {
  let component: BasicDocsComponent;
  let fixture: ComponentFixture<BasicDocsComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      declarations: [ BasicDocsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
