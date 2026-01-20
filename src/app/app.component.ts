import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ReusableTableComponent } from "./shared/components/reusable-table/reusable-table.component";
import { TableAction, TableColumn, TableConfig } from './shared/components/reusable-table/reusable-table.types';
import { FilterItems } from './shared/components/filters/filters.component';
export interface TableRow {
  id: number;
  // For avatar-and-name
  name: string;
  image?: string; // avatar image URL

  // For country
  country?: string;
  countryFlag?: string;

  // For services / chips
  services?: string[];

  // For locale
  locale?: {
    code: string;
    flag: string;
  }[];

  // For status toggle
  active: boolean;

  // For badges

  // Any other generic field for text, text-editor, image, etc.
  [key: string]: any;
}
@Component({
  selector: 'app-root',
  imports: [ReusableTableComponent,TranslateModule,RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'nature-dashboard';
  // ========================= example table data ============================
  data: TableRow[] = [
    {
      id: 1,
      name: 'John Doe111111111111',
      image: 'https://i.pravatar.cc/50?img=1',
      country: 'USA',
      countryFlag: 'https://flagcdn.com/us.svg',
      services: ['Web', 'Design', 'Marketing'],
      locale: [{ code: 'EN', flag: 'https://flagcdn.com/us.svg' }],
      active: true,
      status: 'approved',
    },
    {
      id: 2,
      name: 'Jane Smith',
      image: 'https://i.pravatar.cc/50?img=2',
      country: 'Canada',
      countryFlag: 'https://flagcdn.com/ca.svg',
      services: ['Design'],
      locale: [{ code: 'FR', flag: 'https://flagcdn.com/ca.svg' }],
      active: false,
      status: 'pending',
    },
    {
      id: 3,
      name: 'John Doe',
      image: 'https://i.pravatar.cc/50?img=1',
      country: 'USA',
      countryFlag: 'https://flagcdn.com/us.svg',
      services: ['Web', 'Design', 'Marketing','Web', 'Design', 'Marketing'],
      locale: [{ code: 'EN', flag: 'https://flagcdn.com/us.svg' }],
      active: true,
      status: 'approved',
    },
    {
      id: 4,
      name: 'Jane Smith',
      image: 'https://i.pravatar.cc/50?img=2',
      country: 'Canada',
      countryFlag: 'https://flagcdn.com/ca.svg',
      services: ['Design'],
      locale: [{ code: 'FR', flag: 'https://flagcdn.com/ca.svg' },{ code: 'EN', flag: 'https://flagcdn.com/us.svg' }],
      active: false,
      status: 'pending',
    },
    {
      id: 3,
      name: 'John Doe',
      image: 'https://i.pravatar.cc/50?img=1',
      country: 'USA',
      countryFlag: 'https://flagcdn.com/us.svg',
      services: ['Web', 'Design', 'Marketing','Web', 'Design', 'Marketing'],
      locale: [{ code: 'EN', flag: 'https://flagcdn.com/us.svg' }],
      active: true,
      status: 'approved',
    },
    {
      id: 4,
      name: 'Jane Smith',
      image: 'https://i.pravatar.cc/50?img=2',
      country: 'Canada',
      countryFlag: 'https://flagcdn.com/ca.svg',
      services: ['Design'],
      locale: [{ code: 'FR', flag: 'https://flagcdn.com/ca.svg' },{ code: 'EN', flag: 'https://flagcdn.com/us.svg' }],
      active: false,
      status: 'pending',
    },
    {
      id: 3,
      name: 'John Doe',
      image: 'https://i.pravatar.cc/50?img=1', 
      country: 'USA',
      countryFlag: 'https://flagcdn.com/us.svg',
      services: ['Web', 'Design', 'Marketing','Web', 'Design', 'Marketing'],
      locale: [{ code: 'EN', flag: 'https://flagcdn.com/us.svg' }],
      active: true,
      status: 'approved',
    },
    {
      id: 4,
      name: 'Jane Smith',
      image: 'https://i.pravatar.cc/50?img=2',
      country: 'Canada',
      countryFlag: 'https://flagcdn.com/ca.svg',
      services: ['Design'],
      locale: [{ code: 'FR', flag: 'https://flagcdn.com/ca.svg' },{ code: 'EN', flag: 'https://flagcdn.com/us.svg' }],
      active: false,
      status: 'pending',
    },
    {
      id: 3,
      name: 'John Doe',
      image: 'https://i.pravatar.cc/50?img=1',
      country: 'USA',
      countryFlag: 'https://flagcdn.com/us.svg',
      services: ['Web', 'Design', 'Marketing','Web', 'Design', 'Marketing'],
      locale: [{ code: 'EN', flag: 'https://flagcdn.com/us.svg' }],
      active: true,
      status: 'approved',
    },
    {
      id: 4,
      name: 'Jane Smith',
      image: 'https://i.pravatar.cc/50?img=2',
      country: 'Canada',
      countryFlag: 'https://flagcdn.com/ca.svg',
      services: ['Design'],
      locale: [{ code: 'FR', flag: 'https://flagcdn.com/ca.svg' },{ code: 'EN', flag: 'https://flagcdn.com/us.svg' }],
      active: false,
      status: 'pending',
    },
    {
      id: 3,
      name: 'John Doe',
      image: 'https://i.pravatar.cc/50?img=1',
      country: 'USA',
      countryFlag: 'https://flagcdn.com/us.svg',
      services: ['Web', 'Design', 'Marketing','Web', 'Design', 'Marketing'],
      locale: [{ code: 'EN', flag: 'https://flagcdn.com/us.svg' }],
      active: true,
      status: 'approved',
    },
    {
      id: 4,
      name: 'Jane Smith',
      image: 'https://i.pravatar.cc/50?img=2',
      country: 'Canada',
      countryFlag: 'https://flagcdn.com/ca.svg',
      services: ['Design'],
      locale: [{ code: 'FR', flag: 'https://flagcdn.com/ca.svg' },{ code: 'EN', flag: 'https://flagcdn.com/us.svg' }],
      active: false,
      status: 'pending',
    },
    {
      id: 3,
      name: 'John Doe',
      image: 'https://i.pravatar.cc/50?img=1',
      country: 'USA',
      countryFlag: 'https://flagcdn.com/us.svg',
      services: ['Web', 'Design', 'Marketing','Web', 'Design', 'Marketing'],
      locale: [{ code: 'EN', flag: 'https://flagcdn.com/us.svg' }],
      active: true,
      status: 'approved',
    },
    {
      id: 4,
      name: 'Jane Smith',
      image: 'https://i.pravatar.cc/50?img=2',
      country: 'Canada',
      countryFlag: 'https://flagcdn.com/ca.svg',
      services: ['Design'],
      locale: [{ code: 'FR', flag: 'https://flagcdn.com/ca.svg' },{ code: 'EN', flag: 'https://flagcdn.com/us.svg' }],
      active: false,
      status: 'pending',
    }
  ];
  columns: TableColumn<TableRow>[] = [
    { field: 'name',header: 'Name', type: 'avatar-and-name', width: '200px', avatarField: 'image' },
    { field: 'country', header: 'Country', type: 'country-chip', width: '150px',avatarField: 'countryFlag' },
    { field: 'services', header: 'Services', type: 'chips-group', width: '200px',class:"max-w-4rem overflow-auto custom-scrollbar" },
    { field: 'locale', header: 'Locale', type: 'languages-chips', width: '150px' },
    { field: 'active', header: 'Active', type: 'status', width: '100px' },
  ];

  actions: TableAction<TableRow>[] = [
    {
      label:"Action 1",
      callback:(row,event)=> this.edit(row,event), 
      icon: 'pi pi-pencil', 
      severity: 'primary' ,
      class: 'p-2'
    },
    {
      label:"Action 2",
      callback:(row,event)=> this.delete(row,event), 
      icon: 'pi pi-trash', severity: 'white', 
      visibleWhen: (row:TableRow) => (row.active) ,
      class: 'p-2'
    }
  ];
  edit(row: TableRow,event?:Event){
    console.log("Edit action triggered",row,event);
  }
  delete( row: TableRow,event?:Event){
    console.log("Delete action triggered",row,event);
  }
  filterItems: FilterItems[] = [
    {
      type: 'search',
      name: 'name',
      placeholder: 'Search by name ...'
    },
    {
      type: 'filter',
      filterOptions: [
        {
          type: 'select',
          label: 'Country',
          inputName: 'country',
          multiple: true,
          options: [
            { id: 'USA', name: 'USA' },
            { id: 'Canada', name: 'Canada' }
          ]
        },
        
      ]
    },
    {
      type: 'btn',
      label:"Add New Project",
      btnIcon:"pi pi-plus",
      btnSeverity:"primary",
      btnCallback:(e:Event) => this.addNewProject(e)
    },
  ];
  config: TableConfig<TableRow> = {
    columns: this.columns,
    serverSidePagination: false,
    rowsPerPageOptions: [5 , 10 , 20],
    selectionMode: 'multiple',
    sortable: true,
    serverSideSort: true,
  };

  totalRecords = this.data.length;

  onAction(event: { action: string; row: TableRow }) {
    console.log('Action clicked:', event);
  }

  onPaginationChange(event: {page: number, perPage: number}) {
    console.log('Pagination changed:', event);
  }
  selectionChange(e:TableRow[] | TableRow){
    console.log('selected items',e)
  }
  addNewProject(e:Event){
    console.log("Add New Project button clicked",e);
  }

}
