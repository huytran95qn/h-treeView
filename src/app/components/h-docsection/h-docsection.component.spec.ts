/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { HDocsectionComponent } from './h-docsection.component';

describe('HDocsectionComponent', () => {
  let component: HDocsectionComponent;
  let fixture: ComponentFixture<HDocsectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HDocsectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HDocsectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
