import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  Output,
  QueryList,
  TemplateRef
} from '@angular/core';
import { HTreeViewItem } from './models/h-treeView.model';
import { HTreeViewService } from './services/h-treeView.service';
import { HTreeViewTemplateDirective } from './directives/h-treeView-template.directive';
import { HTreeViewTemplate } from './enums/h-treeView.enum';
import { CdkDragDrop, CdkDragMove, CdkDragStart } from '@angular/cdk/drag-drop';
import { HTreeViewDragDropService } from './services/h-treeView-drag-drop.service';

@Component({
  selector: 'lib-h-treeView',
  templateUrl: './h-treeView.component.html',
  styleUrls: ['h-treeView.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HTreeViewComponent<T> implements AfterContentInit {
  @ContentChildren(HTreeViewTemplateDirective) queryList!: QueryList<HTreeViewTemplateDirective>;

  @Input('items') set setNodes(nodes: HTreeViewItem<T>[]) {
    this.nodes = nodes || [];
    this._dragDropService.prepareDragDrop(this.nodes);
  }

  @Input() draggable: boolean = false;

  @Output() onClickNode: EventEmitter<HTreeViewItem<T>> = new EventEmitter();

  public nodes: HTreeViewItem<T>[] = [];

  public itemTemplate!: TemplateRef<HTMLElement>;

  constructor(
    private _hTreeViewService: HTreeViewService<T>,
    private _dragDropService: HTreeViewDragDropService<T>
  ) { }

  public ngAfterContentInit(): void {
    this.queryList.forEach(query => {
      switch (query.getType()) {
        case HTreeViewTemplate.Item:
          this.itemTemplate = query.template;
          break;
      }
    });
  }

  public toggle(item: HTreeViewItem<T>): void {
    if (item.children) {
      this._hTreeViewService.toggle(item);
    }
  }

  public clickNode(item: HTreeViewItem<T>): void {
    if (!item.disabled) {
      this.onClickNode.emit(item);
    }
  }

  public drop($event: CdkDragDrop<HTreeViewItem<T>>): void {
    console.log($event)
  }

  public handleDragStarted(event: CdkDragStart) {
    const targetNode = event.source.data;
    this._hTreeViewService.collapse(targetNode);
  }

  public handleDragMove(event: CdkDragMove<HTreeViewItem<T>>): void {
    if(this.draggable) {
      this._dragDropService.handleDragMove(event);
    }
  }
}
