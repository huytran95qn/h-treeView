import { v4 as uuid } from 'uuid';
import { HTreeViewItem } from '../models/h-treeView.model';

export function addTree<T>(node: HTreeViewItem<T>, data: T, label: string, uid?: string): void {
  uid = uid || uuid();
  let orgUnit = new HTreeViewItem<T>({
    uid,
    label,
    data
  });
  orgUnit.parent = node;
  orgUnit.level = node.level + 1;
  node.children.push(orgUnit);
}

export function deleteTree<T>(node: HTreeViewItem<T>): void {
  let parent = node.parent;
  if(parent) {
    parent.children = parent.children.filter(child => child.uid !== node.uid);
  }
}

export function update<T>(node: HTreeViewItem<T>, data: T): void {
  node.data = data;
}

export function toggleExpandOrCollapse<T>(node: HTreeViewItem<T>): void {
  node.expanded = !node.expanded;
}

/** Helper to extract the offset of a DOM Node in a certain direction. */
export function getOffset(orientation: 'horizontal' | 'vertical', direction: 'start' | 'end', node: Node) {
  const el = node as Element;
  if (!el.getBoundingClientRect) {
    return 0;
  }
  const rect = el.getBoundingClientRect();

  if (orientation === 'horizontal') {
    return direction === 'start' ? rect.left : rect.right;
  }

  return direction === 'start' ? rect.top : rect.bottom;
}
