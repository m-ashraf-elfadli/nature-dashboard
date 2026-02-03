export interface TableColumn<T> {
  field: string;
  secondaryField?: string;
  header: string;
  type?:
    | 'project'
    | 'country-chip'
    | 'chips-group'
    | 'languages-chips'
    | 'status'
    | 'text'
    | 'text-editor'
    | 'badge'
    | 'image'
    | 'date'
    | 'custom'
    | 'chip'
    | 'avatar-and-name'
    | 'progress-bar'
    | 'progress-bar-circle'
    | 'score'
    | 'text-and-desc';
  badgeColorField?: (
    row: T,
  ) =>
    | 'pending'
    | 'rejected'
    | 'approved'
    | 'in-progress'
    | 'yellow'
    | 'recurring';
  width?: string;
  class?: string;
  avatarField?: string;
  formatDate?: string;
  sortable?: boolean;
  statusCallback?: (row:T,value:boolean,e:Event) => void;
}

export interface TableAction<T> {
  label?: string;
  icon?: string;
  severity?:
    | 'primary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'contrast'
    | 'help'
    | 'white'
    | 'disabled'
    | 'circle'
    | 'discard'
    | 'square-shadow';
  tooltip?: string;
  callback: (row: T, event?: Event) => void;
  route?: string;
  type?: 'edit' | 'delete' | string;
  class?: string;
  iconType?: 'class' | 'svg' | string;
  visibleWhen?: (row: T) => boolean;
}

export interface TableConfig<T> {
  columns: TableColumn<T>[];
  rowsPerPage?: number;
  rowsPerPageOptions: number[];
  isRowActionAvailable?: (row?: T) => boolean;
  selectionMode: 'single' | 'multiple' | null;
  actionsColumnWidth?: () => string;
  sortable?: boolean;
  serverSidePagination?: boolean;
  serverSideFilter?: boolean;
  serverSideSort?: boolean;
}
export interface LocaleChip {
  code: string;
  flag?: string;
}
export interface EmptyStateInfo {
  label?: string;
  description?: string;
  callback?: () => void;
}
