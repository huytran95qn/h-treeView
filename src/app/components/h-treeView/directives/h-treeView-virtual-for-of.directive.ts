import {
  ListRange,
  _RecycleViewRepeaterStrategy,
  _VIEW_REPEATER_STRATEGY,
  _ViewRepeaterItemInsertArgs,
} from '@angular/cdk/collections';
import { Directive } from '@angular/core';
import { HTreeViewItem } from '../models/h-treeView.model';
import { HVirtualFor } from './h-virtual-for-of.directive';


/**
 * A directive similar to `ngForOf` to be used for rendering data inside a virtual scrolling
 * container.
 */
@Directive({
  selector: '[hVirtualFor][hVirtualForOf]',
  providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }],
})
export class HTreeViewVirtualFor<D, T extends HTreeViewItem<D>> extends HVirtualFor<D, T> {
  count: number = 0;

  override getItemsLength(items: T[]): number {
    items = items || [];
    return this.measureTreeSize(items);
  }

  override serializeNodes(
    nodes: T[],
    renderedRange: ListRange,
    serializedItems: T[] = [],
    initialCount: number = 0
  ): T[] {
    serializedItems = serializedItems || [];
    initialCount = initialCount || 0;
    if (nodes && nodes.length) {
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        const parent = node.parent;
        // node.visible = (parent?.visible || false) && (parent ? parent.expanded : true);

        let temp = initialCount + node.totalChildren;
        if (renderedRange.start <= this.count && renderedRange.end >= this.count) {
          serializedItems.push(node);
        }

        initialCount;  


        if (renderedRange.end < this.count) {
          return serializedItems;
        }

        this.serializeNodes(
          node.children as T[],
          renderedRange,
          serializedItems,
        );
      }
    }

    return serializedItems;
  }
  
  private measureTreeSize(items: HTreeViewItem<D>[]): number {
    let total: number = items.length;
    items.forEach(item => total += item.totalChildren);
    return total;
  }
}
