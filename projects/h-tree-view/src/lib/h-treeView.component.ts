import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { HTreeViewItem } from './models/h-treeView.model';
import { HTreeViewService } from './services/h-treeView.service';

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

  constructor(
    private _hTreeViewService: HTreeViewService<T>
  ) {}

  toggle(item: HTreeViewItem<T>): void {
    if (item.children) {
      this._hTreeViewService.toggle(item);
    }
  }
}
