import { Injectable } from '@angular/core';
import { HTreeViewItem } from '../../../projects/h-tree-view/src/lib/models/h-treeView.model';

@Injectable({
  providedIn: 'root'
})
export class HTreeViewSampleService {
  public getTreeNodesData(length: number = 10): HTreeViewItem<string>[] {
    return this.generateGreatGrandFather(length);
  }

  private generateGreatGrandFather(length: number): HTreeViewItem<string>[] {
    let greatGrandFathers: HTreeViewItem<string>[] = [];
    for (let index = 0; index < length; index++) {
      let greatGrandFather = new HTreeViewItem<string>({
        label: `great-grandfather ${index + 1}`,
        expanded: true,
        level: 1
      });
      this.generateGrandFather(greatGrandFather, length);
      greatGrandFathers.push(greatGrandFather);
    }

    return greatGrandFathers;
  }

  private generateGrandFather(parent: HTreeViewItem<string>, length: number): void {
    let grandFathers: HTreeViewItem<string>[] = [];
    for (let index = 0; index < length; index++) {
      let grandFather = new HTreeViewItem<string>({
        label: `${parent.label} -- grandfather ${index + 1}`,
        level: parent.level + 1
      });
      grandFather.parent = parent;
      this.generateFather(grandFather, length);
      grandFathers.push(grandFather);
    }

    parent.children = grandFathers;
  }

  private generateFather(parent: HTreeViewItem<string>, length: number): void {
    let fathers: HTreeViewItem<string>[] = [];
    for (let index = 0; index < length; index++) {
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
