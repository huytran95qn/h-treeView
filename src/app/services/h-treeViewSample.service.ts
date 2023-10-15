import { Injectable } from '@angular/core';
import { HTreeViewItem } from '../../../projects/h-tree-view/src/lib/models/h-treeView.model';

@Injectable({
  providedIn: 'root'
})
export class HTreeViewSampleService {
  public getTreeNodesData(): HTreeViewItem<string>[] {
    return this.generateGreatGrandFather();
  }

  private generateGreatGrandFather(): HTreeViewItem<string>[] {
    let greatGrandFathers: HTreeViewItem<string>[] = [];
    for (let index = 0; index < 100; index++) {
      let greatGrandFather = new HTreeViewItem<string>({
        label: `great-grandfather ${index + 1}`,
        expanded: true,
        level: 1
      });
      this.generateGrandFather(greatGrandFather);
      greatGrandFathers.push(greatGrandFather);
    }

    return greatGrandFathers;
  }

  private generateGrandFather(parent: HTreeViewItem<string>): void {
    let grandFathers: HTreeViewItem<string>[] = [];
    for (let index = 0; index < 10; index++) {
      let grandFather = new HTreeViewItem<string>({
        label: `${parent.label} -- grandfather ${index + 1}`,
        level: parent.level + 1
      });
      grandFather.parent = parent;
      this.generateFather(grandFather);
      grandFathers.push(grandFather);
    }

    parent.children = grandFathers;
  }

  private generateFather(parent: HTreeViewItem<string>): void {
    let fathers: HTreeViewItem<string>[] = [];
    for (let index = 0; index < 10; index++) {
      let father = new HTreeViewItem<string>({
        label: `${parent.label} -- father ${index + 1}`,
        level: parent.level + 1
      });
      father.parent = parent;
      fathers.push(father);
    }

    parent.children = fathers;
  }
}
