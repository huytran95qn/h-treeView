import {
  ListRange,
  _RecycleViewRepeaterStrategy,
  _VIEW_REPEATER_STRATEGY,
  _ViewRepeaterItemInsertArgs,
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

    this._treeViewService.changeTreeView().subscribe(() => {
      this.onRenderedDataChange()
    })
  }

  override getItemsLength(items: T[]): number {
    items = items || [];
    let total = items.length + this.measureTreeSize(items, 0);
    console.log(total)
    return total;
  }

  override serializeNodes(
    nodes: T[],
    renderedRange: ListRange,
    serializedItems: T[] = [],
  ): T[] {
    serializedItems = serializedItems || [];
    if (nodes && nodes.length) {
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        const parent = node.parent;
        node.visible = (parent ? parent.visible : true) && (parent ? parent.expanded : true);

        if (renderedRange.start <= this.initialCount && renderedRange.end >= this.initialCount) {
          serializedItems.push(node);
        }

        this.initialCount++; 

        if (renderedRange.end < this.initialCount) {
          return serializedItems;
        }

        if(node.visible && node.expanded) {
          this.serializeNodes(
            node.children as T[],
            renderedRange,
            serializedItems,
          );
        }
      }
    }

    return serializedItems;
  }
  
  private measureTreeSize(items: HTreeViewItem<D>[], total: number): number {
    items.forEach(item => total += item.children.length);
    return total;
  }
}
