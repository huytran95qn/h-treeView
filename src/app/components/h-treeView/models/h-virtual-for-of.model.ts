import { HTreeViewItem } from "./h-treeView.model";

export type HTreeViewForOfContext<D, T = HTreeViewItem<D>> = {
  $implicit: T;
  hVirtualFor: T[];
  index: number;
  count: number;
};
