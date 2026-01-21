import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";
import { ReusableTableComponent } from "../../../../shared/components/reusable-table/reusable-table.component";
import { TableAction, TableColumn, TableConfig } from '../../../../shared/components/reusable-table/reusable-table.types';
import { FilterItems } from '../../../../shared/components/filters/filters.component';
export interface Client {
  id: number;
  clientName: string;
  clientImage: string; // URL to the logo/image
  dateAdded: string;   // Formatted as MM/DD/YYYY or DD/MM/YYYY
  status: boolean;     // true = active, false = inactive
}
@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [CommonModule, PageHeaderComponent, ReusableTableComponent],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.scss',
})
export class ClientsComponent {
  // ========================= example table data ============================
  data: Client[] = [
  { "id": 1, "clientName": "Ministry of Climate Change & Environment", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=MC", "dateAdded": "12/12/2024", "status": true },
  { "id": 2, "clientName": "Global Tech Solutions", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=GT", "dateAdded": "01/05/2025", "status": true },
  { "id": 3, "clientName": "Summit Finance Group", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=SF", "dateAdded": "15/01/2025", "status": false },
  { "id": 4, "clientName": "Green Earth Initiative", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=GE", "dateAdded": "22/02/2025", "status": true },
  { "id": 5, "clientName": "Nova Healthcare", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=NH", "dateAdded": "10/03/2025", "status": true },
  { "id": 6, "clientName": "Apex Logistics", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=AL", "dateAdded": "18/03/2025", "status": false },
  { "id": 7, "clientName": "Horizon Education", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=HE", "dateAdded": "04/04/2025", "status": true },
  { "id": 8, "clientName": "Pinnacle Real Estate", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=PR", "dateAdded": "12/04/2025", "status": true },
  { "id": 9, "clientName": "Starlight Media", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=SM", "dateAdded": "25/04/2025", "status": true },
  { "id": 10, "clientName": "Oceanic Shipping", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=OS", "dateAdded": "02/05/2025", "status": false },
  { "id": 11, "clientName": "Swift Retail Corp", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=SR", "dateAdded": "15/05/2025", "status": true },
  { "id": 12, "clientName": "Terra Energy Partners", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=TE", "dateAdded": "28/05/2025", "status": true },
  { "id": 13, "clientName": "Velocity Automotive", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=VA", "dateAdded": "05/06/2025", "status": true },
  { "id": 14, "clientName": "Quantum AI Labs", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=QA", "dateAdded": "14/06/2025", "status": false },
  { "id": 15, "clientName": "Beacon Consulting", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=BC", "dateAdded": "22/06/2025", "status": true },
  { "id": 16, "clientName": "Elysian Hospitality", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=EH", "dateAdded": "30/06/2025", "status": true },
  { "id": 17, "clientName": "Ironclad Security", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=IS", "dateAdded": "07/07/2025", "status": true },
  { "id": 18, "clientName": "Zenith Architecture", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=ZA", "dateAdded": "15/07/2025", "status": false },
  { "id": 19, "clientName": "Aura Wellness", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=AW", "dateAdded": "23/07/2025", "status": true },
  { "id": 20, "clientName": "Titan Manufacturing", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=TM", "dateAdded": "01/08/2025", "status": true },
  { "id": 21, "clientName": "Pulse Marketing", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=PM", "dateAdded": "10/08/2025", "status": true },
  { "id": 22, "clientName": "Vanguard Law Firm", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=VL", "dateAdded": "18/08/2025", "status": false },
  { "id": 23, "clientName": "Solaris Tech", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=ST", "dateAdded": "26/08/2025", "status": true },
  { "id": 24, "clientName": "Nimbus Cloud Services", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=NC", "dateAdded": "03/09/2025", "status": true },
  { "id": 25, "clientName": "Evolve Fitness", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=EF", "dateAdded": "11/09/2025", "status": true },
  { "id": 26, "clientName": "Oracle Data Systems", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=OD", "dateAdded": "19/09/2025", "status": false },
  { "id": 27, "clientName": "Primrose Florals", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=PF", "dateAdded": "27/09/2025", "status": true },
  { "id": 28, "clientName": "Galactic Aerospace", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=GA", "dateAdded": "05/10/2025", "status": true },
  { "id": 29, "clientName": "Harbor Port Authority", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=HP", "dateAdded": "13/10/2025", "status": true },
  { "id": 30, "clientName": "Crestview Banking", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=CB", "dateAdded": "21/10/2025", "status": false },
  { "id": 31, "clientName": "Urban Planning Dept", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=UP", "dateAdded": "29/10/2025", "status": true },
  { "id": 32, "clientName": "Midnight Software", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=MS", "dateAdded": "06/11/2025", "status": true },
  { "id": 33, "clientName": "Sovereign Wealth", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=SW", "dateAdded": "14/11/2025", "status": true },
  { "id": 34, "clientName": "Tidal Wave Designs", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=TW", "dateAdded": "22/11/2025", "status": false },
  { "id": 35, "clientName": "Evergreen Landscaping", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=EL", "dateAdded": "30/11/2025", "status": true },
  { "id": 36, "clientName": "Focus Pharma", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=FP", "dateAdded": "08/12/2025", "status": true },
  { "id": 37, "clientName": "Gentry Fashion", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=GF", "dateAdded": "16/12/2025", "status": true },
  { "id": 38, "clientName": "Atlas Construction", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=AC", "dateAdded": "24/12/2025", "status": false },
  { "id": 39, "clientName": "Blue Sky Aviation", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=BA", "dateAdded": "01/01/2026", "status": true },
  { "id": 40, "clientName": "Unity Nonprofit", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=UN", "dateAdded": "09/01/2026", "status": true },
  { "id": 41, "clientName": "Spark Electronics", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=SE", "dateAdded": "17/01/2026", "status": true },
  { "id": 42, "clientName": "Visionary Arts", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=VA", "dateAdded": "25/01/2026", "status": false },
  { "id": 43, "clientName": "North Star Insurance", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=NI", "dateAdded": "02/02/2026", "status": true },
  { "id": 44, "clientName": "Emerald City Cafe", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=EC", "dateAdded": "10/02/2026", "status": true },
  { "id": 45, "clientName": "Shield Cyber Defense", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=SC", "dateAdded": "18/02/2026", "status": true },
  { "id": 46, "clientName": "Pathfinder Travel", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=PT", "dateAdded": "26/02/2026", "status": false },
  { "id": 47, "clientName": "Lumina Research", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=LR", "dateAdded": "06/03/2026", "status": true },
  { "id": 48, "clientName": "Apex Media Agency", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=AM", "dateAdded": "14/03/2026", "status": true },
  { "id": 49, "clientName": "Summit Peak Ventures", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=SP", "dateAdded": "22/03/2026", "status": true },
  { "id": 50, "clientName": "Origin Coffee Co", "clientImage": "https://api.dicebear.com/7.x/initials/svg?seed=OC", "dateAdded": "30/03/2026", "status": false }
]
  columns: TableColumn<Client>[] = [
    { field: 'clientName',header: 'Client name', type: 'text', avatarField: 'image' },
    { field: 'clientImage', header: 'Client image', type: 'image',avatarField: 'countryFlag' },
    { field: 'dateAdded', header: 'Date added', type: 'date',class:"max-w-4rem overflow-auto custom-scrollbar" },
    { field: 'status', header: 'Status', type: 'status' },
  ];

  actions: TableAction<Client>[] = [
    {
      callback:(row,event)=> this.edit(row,event), 
      icon: 'pi pi-pencil', 
      severity: 'white' ,
      class: 'p-2'
    },
    {
      callback:(row,event)=> this.delete(row,event), 
      icon: 'pi pi-trash', 
      severity: 'white', 
      visibleWhen: (row:Client) => (row.status),
      class: 'p-2'
    }
  ];
  edit(row: Client,event?:Event){
    console.log("Edit action triggered",row,event);
  }
  delete( row: Client,event?:Event){
    console.log("Delete action triggered",row,event);
  }
  filterItems: FilterItems[] = [
    {
      type: 'search',
      name: 'keyword',
      placeholder: 'Search by name ...'
    },
    {
      type: 'btn',
      label:"Add New Client",
      btnIcon:"pi pi-plus",
      btnSeverity:"primary",
      btnCallback:(e:Event) => this.addNewProject(e)
    },
    {
      type: 'btn',
      label:"Import CSV",
      btnIcon:"pi pi-download",
      btnSeverity:"white",
      btnCallback:(e:Event) => this.addNewProject(e)
    },
  ];
  config: TableConfig<Client> = {
    columns: this.columns,
    serverSidePagination: false,
    rowsPerPageOptions: [5 , 10 , 20],
    selectionMode: 'multiple',
    sortable: true,
    serverSideSort: true,
  };

  totalRecords = this.data.length;

  onAction(event: { action: string; row: Client }) {
    console.log('Action clicked:', event);
  }

  onPaginationChange(event: {page: number, perPage: number}) {
    console.log('Pagination changed:', event);
  }
  selectionChange(e:Client[] | Client){
    console.log('selected items',e)
  }
  addNewProject(e:Event){
    console.log("Add New Project button clicked",e);
  }
}
