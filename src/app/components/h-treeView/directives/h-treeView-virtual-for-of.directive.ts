import {
  ListRange,
  _RecycleViewRepeaterStrategy,
  _VIEW_REPEATER_STRATEGY,
  _ViewRepeaterItemInsertArgs,
  ArrayDataSource
} from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { Directive, Inject, IterableDiffers, NgZone, SkipSelf, TemplateRef, ViewContainerRef } from '@angular/core';
import { HTreeViewItem } from '../models/h-treeView.model';
import { HVirtualFor } from './h-virtual-for-of.directive';
import { HTreeViewForOfContext } from '../models/h-virtual-for-of.model';
import { HTreeViewService } from '../services/h-treeView.service';


/**
 * A directive similar to `ngForOf` to be used for rendering data inside a virtual scrolling
 * container.
 */
@Directive({
  selector: '[hVirtualFor][hVirtualForOf]',
  providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }],
})
export class HTreeViewVirtualFor<D, T extends HTreeViewItem<D>> extends HVirtualFor<D, T> {
  private initialCount: number = 0;

  constructor(
    _viewContainerRef: ViewContainerRef,
    _template: TemplateRef<HTreeViewForOfContext<D, T>>,
    _differs: IterableDiffers,
    @Inject(_VIEW_REPEATER_STRATEGY) _viewRepeater: _RecycleViewRepeaterStrategy<T, T, HTreeViewForOfContext<D, T>>,
    @SkipSelf() _viewport: CdkVirtualScrollViewport,
    ngZone: NgZone,
    private _treeViewService: HTreeViewService<T>
  ) {
    super(_viewContainerRef, _template, _differs, _viewRepeater, _viewport, ngZone);

    this._treeViewService.treeViewSelector().subscribe(res => {
      this.dataSourceChanges.next(new ArrayDataSource<T>(Array(this.getItemsLength(this.hVirtualFor))));
    })
  }

  override getItemsLength(items: T[] | null | undefined): number {
    items = items || [];
    return items.length + this.getChildrenSize(items);
  }

  override serializeNodes(
    nodes: T[],
    renderedRange: ListRange
  ): T[] {
    this.initialCount = 0;
    return this._serializeNodes(nodes, renderedRange, []);
  }

  private _serializeNodes(
    nodes: T[],
    renderedRange: ListRange,
    serializedItems: T[]
  ): T[] {
    const difference = renderedRange.end - renderedRange.start;

    if (!nodes || nodes.length === 0) {
      return serializedItems;
    }

    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      const { parent } = node;
      node.visible = parent ? parent.visible && parent.expanded : true;

      if (renderedRange.start <= this.initialCount && renderedRange.end >= this.initialCount) {
        serializedItems.push(node);
      }

      this.initialCount++;

      if (difference === serializedItems.length) {
        return serializedItems;
      }

      if (this.shouldIncludeItem(node)) {
        this._serializeNodes(node.children as T[], renderedRange, serializedItems);
      }
    }

    return serializedItems;
  }

  private shouldIncludeItem(item: HTreeViewItem<D>): boolean {
    return item.expanded && item.visible;
  }

  private getChildrenSize(children: HTreeViewItem<D>[]): number {
    let childrenSize: number = 0;

    children.forEach(child => {
      if (this.shouldIncludeItem(child)) {
        childrenSize += child.children.length + this.getChildrenSize(child.children);
      }
    });

    return childrenSize;
  }

}
