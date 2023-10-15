import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HTreeViewItem } from '../../../../projects/h-tree-view/src/lib/models/h-treeView.model';
import { HTreeViewSampleService } from './h-treeViewSample.service';

@Component({
  selector: 'h-treeViewSample',
  templateUrl: './h-treeViewSample.component.html',
  styleUrls: ['./h-treeViewSample.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class HTreeViewSampleComponent {
  items: HTreeViewItem<string>[] = this._treeViewService.getTreeNodesData();

  constructor(
    private _treeViewService: HTreeViewSampleService
  ) { }
}
