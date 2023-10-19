import { Component } from '@angular/core';
import { HTreeViewItem } from 'projects/h-tree-view/src/public-api';
import { HTreeViewSampleService } from 'src/app/services/h-treeViewSample.service';

@Component({
  selector: 'h-drag-drop-doc',
  templateUrl: './drag-drop-doc.component.html',
  styleUrls: ['./drag-drop-doc.component.scss']
})
export class DragDropDocComponent {
  items: HTreeViewItem<string>[] = this._treeViewService.getTreeNodesData(2);

  constructor(
    private _treeViewService: HTreeViewSampleService
  ) { }

}
