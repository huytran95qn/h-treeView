import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { HTreeViewItem } from "../models/h-treeView.model";
import { toggleExpandOrCollapse } from "../utils/utils";

@Injectable({ providedIn: 'root' })
export class HTreeViewService<T> {
    private $change: Subject<void> = new Subject();

    changeTreeView(): Observable<void> {
        return this.$change.asObservable();
    }

    toggle(node: HTreeViewItem<T>): void {
        toggleExpandOrCollapse(node);
        this.$change.next();
    }
}