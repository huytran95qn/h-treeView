import { v4 } from "uuid";

interface IHTreeItem<T> {
  readonly uid?: string;

  label: string;

  data?: T;

  children?: HTreeViewItem<T>[];

  parent?: HTreeViewItem<T>;

  level?: number;

  expanded?: boolean;

  visible?: boolean;

  styleClass?: string;
}

export class HTreeViewItem<T> implements IHTreeItem<T> {
  uid!: string;

  label!: string;

  data?: T;

  children: HTreeViewItem<T>[] = [];

  parent: HTreeViewItem<T> | undefined = undefined;

  level: number = 1;

  expanded: boolean = true;

  visible: boolean = true;

  styleClass: string = '';

  constructor(data: IHTreeItem<T>) {
    if(data) {
      this.uid = data.uid || v4();
      this.label = data.label;
      this.children = data.children || [];
      this.parent = data.parent;
      this.level = data.level || 1;
      this.expanded = true;
      this.styleClass = data.styleClass || '';
      this.visible = true;
    }
  }
}
