import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
  TemplateRef
} from '@angular/core';
import { HTreeViewItem } from './models/h-treeView.model';
import { HTreeViewService } from './services/h-treeView.service';
import { HTreeViewTemplateDirective } from './directives/h-treeView-template.directive';
import { HTreeViewTemplate } from './enums/h-treeView.enum';

@Component({
  selector: 'lib-h-treeView',
  templateUrl: './h-treeView.component.html',
  styleUrls: ['h-treeView.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HTreeViewComponent<T> implements AfterContentInit {
  @ContentChildren(HTreeViewTemplateDirective) queryList!: QueryList<HTreeViewTemplateDirective>;

  @Input('items') set setItems(items: HTreeViewItem<T>[]) {
    this.items = items || [];
  }

  public items: HTreeViewItem<T>[] = [];

  public itemTemplate!: TemplateRef<HTMLElement>;

  constructor(
    private _hTreeViewService: HTreeViewService<T>
  ) {}

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
}
