import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HTreeViewTemplate } from 'projects/h-tree-view/src/lib/enums/h-treeView.enum';
import { HTreeViewItem } from 'projects/h-tree-view/src/lib/models/h-treeView.model';
import { HTreeViewSampleService } from 'src/app/services/h-treeViewSample.service';

@Component({
  selector: 'h-template-doc',
  templateUrl: './template-doc.component.html',
  styleUrls: ['./template-doc.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateDocComponent {
  items: HTreeViewItem<string>[] = this._treeViewService.getTreeNodesData();

  templateEnum = HTreeViewTemplate;

  constructor(
    private _treeViewService: HTreeViewSampleService
  ) { }
}
