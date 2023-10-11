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

  override measureItemsSize(items: T[]): number {
    items = items || [];
    return this.measureTreeSize(items, 0);
  }

  override serializeNodes(
    parent: T | undefined,
    nodes: T[],
    level: number,
    visible: boolean,
    serializedItems: T[] = [],
    renderedRange: ListRange
  ): T[] {
    if(level === 0) {
      this.count = 0;
    }
    serializedItems = serializedItems || [];
    if (nodes && nodes.length) {
      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        node.parent = parent;
        node.level = level;
        node.visible = visible && (parent ? parent.expanded : true);

        this.count++;
        if (renderedRange.start <= this.count && renderedRange.end >= this.count) {
          serializedItems.push(node);
        }


        if (renderedRange.end < this.count) {
          return serializedItems;
        }

        if (node.visible && node.expanded) {
          this.serializeNodes(
            node,
            node.children as T[],
            level + 1,
            node.visible,
            serializedItems,
            renderedRange
          );
        }
      }
    }

    return serializedItems;
  }

  private measureTreeSize(items: HTreeViewItem<D>[], total: number): number {
    items.forEach(item => {
      total++;
      if(item.children.length > 0) {
        total = this.measureTreeSize(item.children, total);
      }
    });

    return total;
  }
}
