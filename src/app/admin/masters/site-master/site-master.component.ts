import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

@Component({
  selector: 'app-site-master',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgxPaginationModule,
  ],
  templateUrl: './site-master.component.html',
  styleUrl: './site-master.component.scss',
  animations: [
    trigger('fadeIn', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'scale(0.5)', 
        }),
      ),
      transition(':enter', [
        animate(
          '0.5s ease-out',
          style({
            opacity: 1,
            transform: 'scale(1)', 
          }),
        ),
      ]),
    ]),
  ],
})
export class SiteMasterComponent implements OnInit {
  showreset: boolean = false; 
  searchbarform!: FormGroup;
  createSiteForm!: FormGroup;
  updateSiteForm!: FormGroup;
  viewSiteForm!: FormGroup;
  
  tableSize: any = 10;
  tableSizes: any = [10, 20, 50, 100, 'all'];
  totalRecords: any;
  page: number = 1;
  
  createSiteOpen: boolean = false;
  updateSiteOpen: boolean = false;
  viewSiteOpen: boolean = false;
  currentSiteId: any;
  selectedSite: any = null;
  
  siteList: any[] = [];
  
  table_heading = [
    {
      heading0: 'Serial No.',
      heading1: 'Site Name',
      heading2: 'Address',
      heading3: 'Status',
      heading4: 'Action',
    },
  ];

  mockSites: any[] = [
    { id: '1', siteName: 'East Mine', address: 'Block A, East Sector', is_active: 1 },
    { id: '2', siteName: 'West Mine', address: 'Block B, West Sector', is_active: 1 },
    { id: '3', siteName: 'North Mine', address: 'Block C, North Sector', is_active: 0 },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.searchbarform = this.formBuilder.group({
      searchbar: ['', [Validators.required]],
    });

    this.createSiteForm = this.formBuilder.group({
      siteName: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });

    this.updateSiteForm = this.formBuilder.group({
      siteName: ['', [Validators.required]],
      address: ['', [Validators.required]],
    });

    this.viewSiteForm = this.formBuilder.group({
      siteName: [''],
      address: [''],
    });
    
    this.GetSiteFun();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.GetSiteFun();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.GetSiteFun();
  }

  searchfun() {
    if (this.searchbarform.valid) {
      this.showreset = true;
      this.GetSiteFun();
    } else {
      this.searchbarform.markAllAsTouched();
    }
  }

  resetsearchbar() {
    this.searchbarform.get('searchbar')?.reset();
    this.showreset = false;
    this.page = 1;
    this.GetSiteFun();
  }

  openAddModal() {
    this.createSiteOpen = true;
  }

  closeModal() {
    this.updateSiteOpen = false;
    this.createSiteOpen = false;
    this.viewSiteOpen = false;
    this.selectedSite = null;
    this.createSiteForm.reset();
  }

  OpenEditModal(site: any): void {
    this.currentSiteId = site.id;
    this.updateSiteOpen = true;
    this.GetupdateSitebyid(this.currentSiteId);
  }

  openviewModal(site: any): void {
    this.viewSiteOpen = true;
    this.currentSiteId = site.id;
    this.selectedSite = site;
    this.viewSiteForm.patchValue({ 
      siteName: site.siteName,
      address: site.address
    });
  }

  GetupdateSitebyid(siteId: any) {
    const site = this.mockSites.find((d) => d.id === siteId);
    if (site) {
      this.updateSiteForm.patchValue({
        siteName: site.siteName,
        address: site.address
      });
    }
  }

  createSite() {
    if (this.createSiteForm.valid) {
      const siteName = this.createSiteForm.get('siteName')?.value;
      const address = this.createSiteForm.get('address')?.value;

      const newId = (this.mockSites.length + 1).toString();
      this.mockSites.unshift({ id: newId, siteName: siteName, address: address, is_active: 1 });
      this.closeModal();
      this.notificationService.show(
        'Site created successfully',
        'success',
        3000,
      );
      this.GetSiteFun();
    } else {
      this.createSiteForm.markAllAsTouched();
    }
  }

  updateSite() {
    if (this.updateSiteForm.valid) {
      const siteName = this.updateSiteForm.get('siteName')?.value;
      const address = this.updateSiteForm.get('address')?.value;

      const index = this.mockSites.findIndex((d) => d.id === this.currentSiteId);
      if (index !== -1) {
        this.mockSites[index].siteName = siteName;
        this.mockSites[index].address = address;
        this.closeModal();
        this.notificationService.show(
          'Site updated successfully',
          'success',
          3000,
        );
        this.GetSiteFun();
      }
    } else {
      this.updateSiteForm.markAllAsTouched();
    }
  }

  GetSiteFun() {
    const searchText = this.searchbarform.get('searchbar')?.value?.toLowerCase();
    let filteredData = this.mockSites;

    if (searchText) {
      filteredData = this.mockSites.filter((d) =>
        d.siteName.toLowerCase().includes(searchText) || d.address.toLowerCase().includes(searchText)
      );
    }

    this.totalRecords = filteredData.length;

    if (this.tableSize === 'all') {
      this.siteList = filteredData;
    } else {
      const startIndex = (this.page - 1) * this.tableSize;
      const endIndex = startIndex + this.tableSize;
      this.siteList = filteredData.slice(startIndex, endIndex);
    }
  }

  async Status(id: string, status: any) {
    const index = this.mockSites.findIndex((d) => d.id === id);
    if (index !== -1) {
      this.mockSites[index].is_active = status;
      this.notificationService.show(
        `Site ${status ? 'activated' : 'deactivated'} successfully`,
        'success',
        2000,
      );
      this.GetSiteFun();
    }
  }
}
