import {
  ArrayDataSource,
  DataSource,
  ListRange,
  _RecycleViewRepeaterStrategy,
  _VIEW_REPEATER_STRATEGY,
  _ViewRepeaterItemInsertArgs,
} from '@angular/cdk/collections';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  Directive,
  DoCheck,
  EmbeddedViewRef,
  Inject,
  Input,
  IterableChangeRecord,
  IterableChanges,
  IterableDiffer,
  IterableDiffers,
  OnDestroy,
  SkipSelf,
  TemplateRef,
  TrackByFunction,
  ViewContainerRef
} from '@angular/core';
import { HTreeViewItem } from '../models/h-treeView.model';
import { HTreeViewForOfContext } from '../models/h-virtual-for-of.model';
import { HTreeViewService } from '../services/h-treeView.service';
import {
  Observable,
  Subject,
  of,
  pairwise,
  shareReplay,
  startWith,
  switchMap,
  takeUntil
} from 'rxjs';
import { getOffset } from '../utils/utils';
import { NumberInput, coerceNumberProperty } from '@angular/cdk/coercion';

/**
 * A directive similar to `ngForOf` to be used for rendering data inside a virtual scrolling
 * container.
 */
@Directive({
  selector: '[hVirtualFor][hVirtualForOf]',
  providers: [{ provide: _VIEW_REPEATER_STRATEGY, useClass: _RecycleViewRepeaterStrategy }],
})
export class HTreeViewVirtualFor<D, T extends HTreeViewItem<D>> implements DoCheck, OnDestroy {
  /** Emits when the rendered view of the data changes. */
  readonly viewChange = new Subject<ListRange>();

  /** Subject that emits when a new DataSource instance is given. */
  public readonly _dataSourceChanges = new Subject<DataSource<T>>();

  /** The DataSource to display. */
  @Input('hVirtualForOf')
  set setHVirtualFor(value: T[] | null | undefined) {
    this.hVirtualFor = value;
    this.hVirtualForLength = this.getItemsLength(value);
    this._dataSourceChanges.next(new ArrayDataSource<T>(Array(this.hVirtualForLength)));
  }

  hVirtualFor: T[] | null | undefined = [];

  /**
   * The `TrackByFunction` to use for tracking changes. The `TrackByFunction` takes the index and
   * the item and produces a value to be used as the item's identity when tracking changes.
   */
  @Input()
  get hVirtualForTrackBy(): TrackByFunction<T> | undefined {
    return this._hVirtualForTrackBy;
  }
  set hVirtualForTrackBy(fn: TrackByFunction<T> | undefined) {
    this._needsUpdate = true;
    this._hVirtualForTrackBy = fn
      ? (index, item) => fn(index + (this._renderedRange ? this._renderedRange.start : 0), item)
      : undefined;
  }
  private _hVirtualForTrackBy: TrackByFunction<T> | undefined;

  /** The template used to stamp out new elements. */
  @Input()
  set hVirtualForTemplate(value: TemplateRef<HTreeViewForOfContext<D, T>>) {
    if (value) {
      this._needsUpdate = true;
      this._template = value;
    }
  }

  @Input()
  get hVirtualForTemplateCacheSize(): number {
    return this._viewRepeater.viewCacheSize;
  }
  set hVirtualForTemplateCacheSize(size: NumberInput) {
    this._viewRepeater.viewCacheSize = coerceNumberProperty(size);
  }

  /** Emits whenever the data in the current DataSource changes. */
  readonly dataStream: Observable<readonly T[]> = this._dataSourceChanges.pipe(
    startWith(null),
    pairwise(),
    switchMap(([prev, cur]) => this._changeDataSource(prev, cur)),
    // Replay the last emitted data when someone subscribes.
    shareReplay(1),
  );

  /** The differ used to calculate changes to the data. */
  private _differ: IterableDiffer<T> | null = null;

  /** The most recent data emitted from the DataSource. */
  private _nodes: readonly T[] = [];

  /** The currently rendered items. */
  private _renderedItems: T[] = [];

  /** The currently rendered range of indices. */
  private _renderedRange!: ListRange;

  /** Whether the rendered data should be updated during the next ngDoCheck cycle. */
  private _needsUpdate = false;

  /**  */
  private hVirtualForLength: number = 0;

  private readonly _destroyed = new Subject<void>();

  constructor(
    private _viewContainerRef: ViewContainerRef,
    private _template: TemplateRef<HTreeViewForOfContext<D, T>>,
    private _differs: IterableDiffers,
    @Inject(_VIEW_REPEATER_STRATEGY)
    private _viewRepeater: _RecycleViewRepeaterStrategy<T, T, HTreeViewForOfContext<D, T>>,
    @SkipSelf() private _viewport: CdkVirtualScrollViewport,
    private _treeViewService: HTreeViewService<T>
  ) {
    this.initViewPort();
    this.treeViewSelector()
  }

  /**
   * Measures the combined size (width for horizontal orientation, height for vertical) of all items
   * in the specified range. Throws an error if the range includes items that are not currently
   * rendered.
   */
  public measureRangeSize(range: ListRange, orientation: 'horizontal' | 'vertical'): number {
    if (range.start >= range.end) {
      return 0;
    }
    if (range.start < this._renderedRange.start || range.end > this._renderedRange.end) {
      throw Error(`Error: attempted to measure an item that isn't rendered.`);
    }

    // The index into the list of rendered views for the first item in the range.
    const renderedStartIndex = range.start - this._renderedRange.start;
    // The length of the range we're measuring.
    const rangeLen = range.end - range.start;

    // Loop over all the views, find the first and land node and compute the size by subtracting
    // the top of the first node from the bottom of the last one.
    let firstNode: HTMLElement | undefined;
    let lastNode: HTMLElement | undefined;

    // Find the first node by starting from the beginning and going forwards.
    for (let i = 0; i < rangeLen; i++) {
      const view = this._viewContainerRef.get(i + renderedStartIndex) as EmbeddedViewRef<
        HTreeViewForOfContext<D, T>
      > | null;
      if (view && view.rootNodes.length) {
        firstNode = lastNode = view.rootNodes[0];
        break;
      }
    }

    // Find the last node by starting from the end and going backwards.
    for (let i = rangeLen - 1; i > -1; i--) {
      const view = this._viewContainerRef.get(i + renderedStartIndex) as EmbeddedViewRef<
        HTreeViewForOfContext<D, T>
      > | null;
      if (view && view.rootNodes.length) {
        lastNode = view.rootNodes[view.rootNodes.length - 1];
        break;
      }
    }

    return firstNode && lastNode
      ? getOffset(orientation, 'end', lastNode) - getOffset(orientation, 'start', firstNode)
      : 0;
  }

  public ngDoCheck() {
    if (this._differ && this._needsUpdate) {
      // TODO(mmalerba): We should differentiate needs update due to scrolling and a new portion of
      // this list being rendered (can use simpler algorithm) vs needs update due to data actually
      // changing (need to do this diff).
      const changes = this._differ.diff(this._renderedItems);
      if (!changes) {
        this.updateContextItem();
      } else {
        this._applyChanges(changes);
      }
      this._needsUpdate = false;
    }
  }

  public ngOnDestroy() {
    this._viewport.detach();

    this._dataSourceChanges.next(undefined!);
    this._dataSourceChanges.complete();
    this.viewChange.complete();

    this._destroyed.next();
    this._destroyed.complete();
    this._viewRepeater.detach();
  }

  /** Calculates the total length of the items, including their children. */
  private getItemsLength(items: T[] | null | undefined): number {
    items = items || [];

    /** Function to recursively calculate the size of children. */
    const calcChildrenSize = (children: HTreeViewItem<D>[]): number => {
      let childrenSize: number = 0;

      children.forEach(child => {
        if (this.shouldIncludeItem(child)) {
          childrenSize += child.children.length + calcChildrenSize(child.children);
        }
      });

      return childrenSize;
    }

    return items.length + calcChildrenSize(items);
  }

  /** Serializes the nodes based on the provided rendered range. */
  private serializeNodes(nodes: T[], renderedRange: ListRange): T[] {
    let count = 0;

    /** Recursively generates serialized items from the nodes based on the rendered range. */
    const generateItems = (
      nodes: T[],
      renderedRange: ListRange,
      serializedItems: T[]
    ): T[] => {
      const difference = renderedRange.end - renderedRange.start;

      if (!nodes || nodes.length === 0) {
        return serializedItems;
      }

      for (let i = 0; i < nodes.length; i++) {
        let node = nodes[i];
        count += 1;
        const { parent } = node;
        node.visible = parent ? parent.visible && parent.expanded : true;

        if (renderedRange.start <= count && renderedRange.end >= count) {
          serializedItems.push(node);
        }

        if (difference === serializedItems.length) {
          return serializedItems;
        }

        if (this.shouldIncludeItem(node)) {
          generateItems(node.children as T[], renderedRange, serializedItems);
        }
      }

      return serializedItems;
    }

    return generateItems(nodes, renderedRange, []);
  }

  /** React to scroll state changes in the viewport. */
  private onRenderedDataChange() {
    if (!this._renderedRange) {
      return;
    }

    this._renderedItems = this.serializeNodes(
      this.hVirtualFor as T[],
      this._renderedRange
    );

    if (!this._differ) {
      // Use a wrapper function for the `trackBy` so any new values are
      // picked up automatically without having to recreate the differ.
      this._differ = this._differs.find(this._renderedItems).create((index, item) => {
        return this.hVirtualForTrackBy ? this.hVirtualForTrackBy(index, item) : item;
      });
    }
    this._needsUpdate = true;
  }

  /** Swap out one `DataSource` for another. */
  private _changeDataSource(
    oldDs: DataSource<T> | null,
    newDs: DataSource<T> | null,
  ): Observable<readonly T[]> {
    if (oldDs) {
      oldDs.disconnect(this);
    }

    this._needsUpdate = true;
    return newDs ? newDs.connect(this) : of();
  }

  /** Update the context for all views. */
  private updateContextItem() {
    const count = this._nodes.length;
    let i = this._viewContainerRef.length;
    while (i--) {
      const view = this._viewContainerRef.get(i) as EmbeddedViewRef<HTreeViewForOfContext<D, T>>;
      view.context.index = this._renderedRange.start + i;
      view.context.count = count;
      view.detectChanges();
    }
  }

  /** Apply changes to the DOM. */
  private _applyChanges(changes: IterableChanges<T>) {
    const itemContextFactory = (
      record: IterableChangeRecord<T>,
      _adjustedPreviousIndex: number | null,
      currentIndex: number | null,
    ) => this.getEmbeddedViewArgs(record, currentIndex!);
    this._viewRepeater.applyChanges(
      changes,
      this._viewContainerRef,
      itemContextFactory,
      record => record.item,
    );

    // Update $implicit for any items that had an identity change.
    changes.forEachIdentityChange((record: IterableChangeRecord<T>) => {
      const view = this._viewContainerRef.get(record.currentIndex!) as EmbeddedViewRef<
        HTreeViewForOfContext<D, T>
      >;
      view.context.$implicit = record.item;
    });

    // Update the context variables on all items.
    const count = this._nodes.length;
    let i = this._viewContainerRef.length;
    while (i--) {
      const view = this._viewContainerRef.get(i) as EmbeddedViewRef<HTreeViewForOfContext<D, T>>;
      view.context.index = this._renderedRange.start + i;
      view.context.count = count;
    }
  }

  private getEmbeddedViewArgs(
    record: IterableChangeRecord<T>,
    index: number,
  ): _ViewRepeaterItemInsertArgs<HTreeViewForOfContext<D, T>> {
    return {
      templateRef: this._template,
      context: {
        $implicit: record.item,
        hVirtualFor: Array(this.hVirtualForLength),
        index: -1,
        count: -1,
      },
      index,
    };
  }

  private shouldIncludeItem(item: HTreeViewItem<D>): boolean {
    return item.expanded && item.visible;
  }

  private treeViewSelector(): void {
    this._treeViewService.treeViewSelector().pipe(
      takeUntil(this._destroyed)
    ).subscribe(res => {
      switch (res.state) {
        case 'add':

          break;

        case 'update':
          break;

        case 'delete':
          break;

        case 'toogle':
          this._dataSourceChanges.next(new ArrayDataSource<T>(Array(this.getItemsLength(this.hVirtualFor))));
          break;
      }
    });
  }

  private initViewPort(): void {
    this.dataStream.subscribe(data => {
      this._nodes = data;
      this.onRenderedDataChange();
    });

    this._viewport.renderedRangeStream.subscribe(range => {
      this._renderedRange = range;
      this.onRenderedDataChange();
    });
    this._viewport.attach(this);
  }
}
