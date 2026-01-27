import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableAction, TableColumn, TableConfig } from '../../../../shared/components/reusable-table/reusable-table.types';
import { FilterItems } from '../../../../shared/components/filters/filters.component';
import { ReusableTableComponent } from "../../../../shared/components/reusable-table/reusable-table.component";
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { TranslateModule } from '@ngx-translate/core';
import { PaginationObj } from '../../../../core/models/global.interface';

export interface Award {
  id: number;
  name: string;
  image: string;
  awardDate: Date | string;
  description: string;
  status: boolean;
  country: string;
  countryFlag: string;
}

@Component({
  selector: 'app-awards-list',
  imports: [CommonModule, ReusableTableComponent, PageHeaderComponent,TranslateModule],
  templateUrl: './awards-list.component.html',
  styleUrl: './awards-list.component.scss'
})
export class AwardsListComponent {
  private readonly router = inject(Router);

  public data: Award[] = Array.from({ length: 50 }, (_, i) => {
    const descriptions = [
      "I had an amazing experience with this service! The team was incredibly helpful and attentive to my needs. I highly recommend them!",
      "An outstanding project that demonstrates a deep commitment to environmental excellence and sustainability.",
      "Recognized for innovative contributions to green technology and desert irrigation efficiency.",
      "The results achieved by this initiative have set a new benchmark for the local industry.",
      "A truly transformative service that has improved our community's green footprint significantly."
    ];

    return {
      id: i + 1,
      name: `UAE Green Innovation Award, ${2020 + (i % 5)}`,
      image: `https://picsum.photos/seed/award${i}/100/100`,
      awardDate: '12/12/2024',
      description: `"${descriptions[i % descriptions.length]}"`,
      status: Math.random() > 0.15,
      country: 'UAE',
      countryFlag: 'https://flagcdn.com/w40/ae.png'
    };
  });
  totalRecords = this.data.length;
  
  columns: TableColumn<Award>[] = [
    { field: 'name',header: 'awards.list.table_headers.award', type: 'avatar-and-name', avatarField: 'image' },
    { field:'awardDate',header:"awards.list.table_headers.date",type:"date"},
    { field: 'description', header: 'awards.list.table_headers.description', type: 'text' },
    { field: 'status', header: 'awards.list.table_headers.status', type: 'status' },
  ];

  actions: TableAction<Award>[] = [
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
  edit(row: Award,event?:Event){
    console.log("Edit action triggered",row,event);
  }
  delete( row: Award,event?:Event){
    console.log("Delete action triggered",row,event);
  }
  filterItems: FilterItems[] = [
    {
      type: 'search',
      name: 'keyword',
      placeholder: 'general.search_input_table_placeholder'
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
      btnCallback:(e:Event) => this.addNew()
    },
    {
      type: 'btn',
      label:"awards.list.btns.add_new",
      btnIcon:"pi pi-plus",
      btnSeverity:"primary",
      btnCallback:(e:Event) => this.addNew()
    },
  ];
  config: TableConfig<Award> = {
    columns: this.columns,
    serverSidePagination: false,
    rowsPerPageOptions: [5 , 10 , 20],
    selectionMode: 'multiple',
    sortable: true,
    serverSideSort: true,
  };


  onAction(event: { action: string; row: Award }) {
    console.log('Action clicked:', event);
  }

  onPaginationChange(event: PaginationObj) {
    console.log('Pagination changed:', event);
  }
  selectionChange(e:Award[] | Award){
    console.log('selected items',e)
  }
  addNew() {
    this.router.navigate(['/awards/add']);
  }
}
