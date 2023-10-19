import { TestBed } from '@angular/core/testing';
import { DOCUMENT } from '@angular/common';
import { HTreeViewDragDropService } from './h-treeView-drag-drop.service';

describe('HTreeViewDragDropService', () => {
  let service: HTreeViewDragDropService<any>;
  let document: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HTreeViewDragDropService,
        { provide: DOCUMENT, useValue: document }
      ]
    });
    service = TestBed.inject(HTreeViewDragDropService);
    document = TestBed.inject(DOCUMENT);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should prepare data for drag and drop', () => {
    const nodes: any = []; // Provide test nodes here
    service.prepareDragDrop(nodes);
    expect(service['nodeLookup']).toBeDefined();
  });

  it('should clear drag information', () => {
    service['clearDragInfo']();
    expect(service['dropActionTodo']).toBeUndefined();
  });

  it('should reset the service', () => {
    service['reset']();
    expect(service['dropActionTodo']).toBeUndefined();
    expect(service['nodeLookup'].size).toBe(0);
  });
});
