import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ReusableTableComponent } from "../../shared/components/reusable-table/reusable-table.component";
import { TranslateModule } from '@ngx-translate/core';
import { FilterItems } from '../../shared/components/filters/filters.component';
import { Client } from '../../features/clients/components/clients/clients.component';
import { TableAction, TableColumn, TableConfig } from '../../shared/components/reusable-table/reusable-table.types';
export interface Project {
  id: number;
  name: string;
  image: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  city: string;
  services: string[];
  locales: { code: string; flag: string; status: boolean }[];
  status: boolean;
}
@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ReusableTableComponent, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent {
  private router = inject(Router);

  data:Project[] = [
    {
      id: 1,
      name: `Plantation UAE Project ${1}`,
      image: `https://picsum.photos/seed/${50}/100/100`,
      country: 'UAE',
      countryCode: 'AE',
      countryFlag: 'https://flagcdn.com/w40/ae.png', // Flag URL property
      city: 'Sohag',
      services: ['Service 1','Service 2','Service 3','Service 4'],
      locales: [
        { code: 'EN', flag: '🇬🇧', status: true },
        { code: 'AR', flag: '🇦🇪', status: false } // AR only for some
      ],
      status: Math.random() > 0.2 // 80% active
    }
  ]
  totalRecords = this.data.length;
  
    columns: TableColumn<Project>[] = [
      { field: 'name',header: 'projects.list.table_headers.project', type: 'avatar-and-name', avatarField: 'image' },
      { field: 'country', header: 'projects.list.table_headers.country', type: 'country-chip',avatarField: 'countryFlag' },
      { field: 'city', header: 'projects.list.table_headers.city', type: 'text' },
      { field: 'services', header: 'projects.list.table_headers.services', type: 'chips-group' },
      { field: 'locales', header: 'projects.list.table_headers.locale', type: 'languages-chips' },
      { field: 'status', header: 'projects.list.table_headers.status', type: 'status' },
    ];
  
    actions: TableAction<Project>[] = [
      {
        callback:(row)=> this.addNew(), 
        icon: 'pi pi-pencil', 
        severity: 'white' ,
        class: 'p-2'
      },
      {
        callback:(row,event)=> this.delete(row,event), 
        icon: 'pi pi-trash', 
        severity: 'white', 
        class: 'p-2'
      }
    ];
    edit(row: Project,event?:Event){
      console.log("Edit action triggered",row,event);
    }
    delete( row: Project,event?:Event){
      console.log("Delete action triggered",row,event);
    }
    filterItems: FilterItems[] = [
      {
        type: 'search',
        name: 'keyword',
        placeholder: 'Search by name ...'
      },
      // {
      //   type: 'filter',
      //   btnIcon:"pi pi-download",
      //   btnSeverity:"white",
      // },
      {
        type: 'btn',
        label:"Import CSV",
        btnIcon:"pi pi-download",
        btnSeverity:"white",
        btnCallback:(e:Event) => this.addNewProject(e)
      },
      {
        type: 'btn',
        label:"projects.list.btns.add_new",
        btnIcon:"pi pi-plus",
        btnSeverity:"primary",
        btnCallback:(e:Event) => this.addNew()
      },
    ];
    config: TableConfig<Project> = {
      columns: this.columns,
      serverSidePagination: false,
      rowsPerPageOptions: [5 , 10 , 20],
      selectionMode: 'multiple',
      sortable: true,
      serverSideSort: true,
    };
  
  
    onAction(event: { action: string; row: Project }) {
      console.log('Action clicked:', event);
    }
  
    onPaginationChange(event: {page: number, perPage: number}) {
      console.log('Pagination changed:', event);
    }
    selectionChange(e:Project[] | Project){
      console.log('selected items',e)
    }
    addNewProject(e:Event){
      console.log("Add New Project button clicked",e);
    }
  addNew() {
    this.router.navigate(['/projects/add']);
  }
}
