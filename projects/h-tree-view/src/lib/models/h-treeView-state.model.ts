import { HTreeViewItem } from "./h-treeView.model";

export interface HTreeViewState<T> {
    state: 'update' | 'delete' | 'add' | 'toogle',
    node: HTreeViewItem<T>
}