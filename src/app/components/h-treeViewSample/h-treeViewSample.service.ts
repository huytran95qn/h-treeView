import { Injectable } from '@angular/core';
import { HTreeViewItem } from '../h-treeView/models/h-treeView.model';

@Injectable({
  providedIn: 'root'
})
export class HTreeViewSampleService {

  constructor() { }

  public getTreeNodesData(): HTreeViewItem<string>[] {
    return this.generateGreatGrandFather();
  }

  private generateGreatGrandFather(): HTreeViewItem<string>[] {
    let greatGrandFathers: HTreeViewItem<string>[] = [];
    for (let index = 0; index < 100; index++) {
      let greatGrandFather = new HTreeViewItem<string>({
        label: `great-grandfather ${index + 1}`,
        expanded: true
      });
      this.generateGrandFather(greatGrandFather);
      greatGrandFather.setTotalChildren();
      greatGrandFathers.push(greatGrandFather);
    }

    return greatGrandFathers;
  }

  private generateGrandFather(parent: HTreeViewItem<string>): void {
    let grandFathers: HTreeViewItem<string>[] = [];
    for (let index = 0; index < 120; index++) {
      let grandFather = new HTreeViewItem<string>({
        label: `${parent.label} -- grandfather ${index + 1}`,
      });
      grandFather.parent = parent;
      this.generateFather(grandFather);
      grandFather.setTotalChildren();
      grandFathers.push(grandFather);
    }

    parent.children = grandFathers;
  }

  private generateFather(parent: HTreeViewItem<string>): void {
    let fathers: HTreeViewItem<string>[] = [];
    for (let index = 0; index < 0; index++) {
      let father = new HTreeViewItem<string>({
        label: `${parent.label} -- father ${index + 1}`,
      });
      father.parent = parent;
      fathers.push(father);
    }

    parent.children = fathers;
  }
}
