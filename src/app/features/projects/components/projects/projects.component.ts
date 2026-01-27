import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { ReusableTableComponent } from "../../../../shared/components/reusable-table/reusable-table.component";
import { TranslateModule } from '@ngx-translate/core';
import { FilterItems } from '../../../../shared/components/filters/filters.component';
import { TableAction, TableColumn, TableConfig } from '../../../../shared/components/reusable-table/reusable-table.types';
import { ProjectsService } from '../../services/projects.service';
import { DropDownOption, PaginationObj } from '../../../../core/models/global.interface';
import { Project } from '../../models/projects.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ReusableTableComponent, TranslateModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
})
export class ProjectsComponent implements OnInit {
  private readonly service = inject(ProjectsService);
  private readonly router = inject(Router);

  data: WritableSignal<Project[]> = signal([])
  totalRecords = signal(0);
  countriesDD: DropDownOption[] = []
  citiesDD: DropDownOption[] = []
  paginationObj: PaginationObj = {
    page: 1,
    size: 10,
  }
  filterObj:any;
  columns: TableColumn<Project>[] = [
    { field: 'name', header: 'projects.list.table_headers.project', type: 'avatar-and-name', avatarField: 'image' },
    { field: 'countryName', header: 'projects.list.table_headers.country', type: 'country-chip', avatarField: 'countryLogo' },
    { field: 'cityName', header: 'projects.list.table_headers.city', type: 'text' },
    { field: 'services', header: 'projects.list.table_headers.services', type: 'chips-group' },
    { field: 'localeComplete', header: 'projects.list.table_headers.locale', type: 'languages-chips' },
    { field: 'status', header: 'projects.list.table_headers.status', type: 'status' },
  ];

  actions: TableAction<Project>[] = [
    {
      callback: (row) => this.addNew(),
      icon: 'pi pi-pencil',
      severity: 'white',
      class: 'p-2'
    },
    {
      callback: (row, event) => this.delete(row, event),
      icon: 'pi pi-trash',
      severity: 'white',
      class: 'p-2'
    }
  ];
  edit(row: Project, event?: Event) {
    console.log("Edit action triggered", row, event);
  }
  delete(row: Project, event?: Event) {
    console.log("Delete action triggered", row, event);
  }
  filterItems: FilterItems[] = []
  config: TableConfig<Project> = {
    columns: this.columns,
    rowsPerPage: 10,
    serverSidePagination: true,
    rowsPerPageOptions: [5, 10, 20],
    selectionMode: 'multiple',
    sortable: true,
    serverSideSort: true,
    serverSideFilter: true,
  };
  ngOnInit(): void {
    this.initFilterConfig()
    this.getDropDowns()
    this.fetchData(this.paginationObj)
  }
  fetchData(pagination: PaginationObj) {
    this.service.getAll(pagination,this.filterObj?.key || '',this.filterObj).subscribe({
      next: (res) => {
        this.data.set(res.result)
        this.totalRecords.set(res.total!)
      },
      error: (err) => {
        console.error('Failed to load projects', err);
      }
    })
  }
  getDropDowns() {
    forkJoin({
      countries: this.service.getCountries(),
      cities: this.service.getAllCities()
    }).subscribe({
      next: (res) => {
        this.countriesDD = res.countries.result
        this.citiesDD = res.cities.result
        this.initFilterConfig()
      },
      error: (err) => {
        console.error(err)
      }
    })
  }
  initFilterConfig() {
    this.filterItems = [
      {
        type: 'search',
        name: 'name',
        placeholder: 'Search by name ...'
      },
      {
        type: 'filter',
        btnIcon: "pi pi-download",
        btnSeverity: "white",
        filterOptions: [
          {
            type: 'select',
            multiple: true,
            label: 'country',
            inputName: 'country_ids',
            options: this.countriesDD,
          },
          {
            type: 'select',
            multiple: true,
            label: 'city',
            inputName: 'city_ids',
            options: this.citiesDD,
          },
        ]
      },
      {
        type: 'btn',
        label: "Import CSV",
        btnIcon: "pi pi-download",
        btnSeverity: "white",
        btnCallback: (e: Event) => this.addNewProject(e)
      },
      {
        type: 'btn',
        label: "projects.list.btns.add_new",
        btnIcon: "pi pi-plus",
        btnSeverity: "primary",
        btnCallback: (e: Event) => this.addNew()
      },
    ];
  }
  onAction(event: { action: string; row: Project }) {
    console.log('Action clicked:', event);
  }

  onPaginationChange(event: PaginationObj) {
    this.paginationObj = event
    this.fetchData(this.paginationObj)
  }
  selectionChange(e: Project[] | Project) {
    console.log('selected items', e)
  }
  addNewProject(e: Event) {
    console.log("Add New Project button clicked", e);
  }
  onFilterChange(filter:any){
    this.filterObj = filter
    this.fetchData(this.paginationObj)

    console.log(filter);
  }
  addNew() {
    this.router.navigate(['/projects/add']);
  }
}
