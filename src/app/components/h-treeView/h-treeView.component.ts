import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HTreeViewItem } from './models/h-treeView.model';
import { toggleExpandOrCollapse } from './utils/utils';

@Component({
  selector: 'lib-h-treeView',
  templateUrl: './h-treeView.component.html',
  styleUrls: ['h-treeView.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HTreeViewComponent<T> {
  @Input('items') set setItems(items: HTreeViewItem<T>[]) {
    this.items = items || [];
  }

  items: HTreeViewItem<T>[] = [];

  toggle(item: HTreeViewItem<T>): void {
    if (item.children) {
      toggleExpandOrCollapse(item);
    }
  }
}
