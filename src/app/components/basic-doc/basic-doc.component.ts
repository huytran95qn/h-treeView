import { Component, OnInit } from '@angular/core';
import { HTreeViewItem } from 'h-treeView';
import { HTreeViewSampleService } from 'src/app/services/h-treeViewSample.service';

@Component({
  selector: 'h-basic-doc',
  templateUrl: './basic-doc.component.html',
  styleUrls: ['./basic-doc.component.scss']
})
export class BasicDocsComponent {
  items: HTreeViewItem<string>[] = this._treeViewService.getTreeNodesData();

  constructor(
    private _treeViewService: HTreeViewSampleService
  ) { }
}
