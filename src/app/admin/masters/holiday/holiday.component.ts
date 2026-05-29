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
  selector: 'app-holiday',
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
  templateUrl: './holiday.component.html',
  styleUrl: './holiday.component.scss',
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
export class HolidayComponent implements OnInit {
  showreset: boolean = false; 
  searchbarform!: FormGroup;
  createHolidayForm!: FormGroup;
  updateHolidayForm!: FormGroup;
  viewHolidayForm!: FormGroup;
  
  tableSize: any = 10;
  tableSizes: any = [10, 20, 50, 100, 'all'];
  totalRecords: any;
  page: number = 1;
  
  createHolidayOpen: boolean = false;
  updateHolidayOpen: boolean = false;
  viewHolidayOpen: boolean = false;
  currentHolidayId: any;
  selectedHoliday: any = null;
  
  holidayList: any[] = [];
  
  table_heading = [
    {
      heading0: 'Serial No.',
      heading1: 'Holiday Name',
      heading2: 'Date',
      heading3: 'Site',
      heading4: 'Holiday Type',
      heading5: 'Status',
      heading6: 'Action',
    },
  ];

  mockSites: any[] = [
    { id: '1', siteName: 'East Mine' },
    { id: '2', siteName: 'West Mine' },
    { id: '3', siteName: 'All Sites' },
  ];

  mockHolidays: any[] = [
    { id: '1', holidayName: 'Republic Day', date: '2025-01-26', site: 'All Sites', holidayType: 'National', is_active: 1 },
    { id: '2', holidayName: 'Diwali', date: '2024-11-01', site: 'All Sites', holidayType: 'Festival', is_active: 1 },
    { id: '3', holidayName: 'Local Election', date: '2024-04-15', site: 'East Mine', holidayType: 'Local', is_active: 1 },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.searchbarform = this.formBuilder.group({
      searchbar: ['', [Validators.required]],
    });

    this.createHolidayForm = this.formBuilder.group({
      holidayName: ['', [Validators.required]],
      date: ['', [Validators.required]],
      site: ['', [Validators.required]],
      holidayType: ['', [Validators.required]],
    });

    this.updateHolidayForm = this.formBuilder.group({
      holidayName: ['', [Validators.required]],
      date: ['', [Validators.required]],
      site: ['', [Validators.required]],
      holidayType: ['', [Validators.required]],
    });

    this.viewHolidayForm = this.formBuilder.group({
      holidayName: [''],
      date: [''],
      site: [''],
      holidayType: [''],
    });
    
    this.GetHolidayFun();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.GetHolidayFun();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.GetHolidayFun();
  }

  searchfun() {
    if (this.searchbarform.valid) {
      this.showreset = true;
      this.GetHolidayFun();
    } else {
      this.searchbarform.markAllAsTouched();
    }
  }

  resetsearchbar() {
    this.searchbarform.get('searchbar')?.reset();
    this.showreset = false;
    this.page = 1;
    this.GetHolidayFun();
  }

  openAddModal() {
    this.createHolidayOpen = true;
  }

  closeModal() {
    this.updateHolidayOpen = false;
    this.createHolidayOpen = false;
    this.viewHolidayOpen = false;
    this.selectedHoliday = null;
    this.createHolidayForm.reset({ site: 'All Sites', holidayType: 'Festival' });
  }

  OpenEditModal(holiday: any): void {
    this.currentHolidayId = holiday.id;
    this.updateHolidayOpen = true;
    this.GetupdateHolidaybyid(this.currentHolidayId);
  }

  openviewModal(holiday: any): void {
    this.viewHolidayOpen = true;
    this.currentHolidayId = holiday.id;
    this.selectedHoliday = holiday;
    this.viewHolidayForm.patchValue({ 
      holidayName: holiday.holidayName,
      date: holiday.date,
      site: holiday.site,
      holidayType: holiday.holidayType,
    });
  }

  GetupdateHolidaybyid(holidayId: any) {
    const holiday = this.mockHolidays.find((d) => d.id === holidayId);
    if (holiday) {
      this.updateHolidayForm.patchValue({
        holidayName: holiday.holidayName,
        date: holiday.date,
        site: holiday.site,
        holidayType: holiday.holidayType,
      });
    }
  }

  createHoliday() {
    if (this.createHolidayForm.valid) {
      const holidayData = this.createHolidayForm.value;

      const newId = (this.mockHolidays.length + 1).toString();
      this.mockHolidays.unshift({ 
        id: newId, 
        ...holidayData, 
        is_active: 1 
      });
      
      this.closeModal();
      this.notificationService.show(
        'Holiday created successfully',
        'success',
        3000,
      );
      this.GetHolidayFun();
    } else {
      this.createHolidayForm.markAllAsTouched();
    }
  }

  updateHoliday() {
    if (this.updateHolidayForm.valid) {
      const holidayData = this.updateHolidayForm.value;

      const index = this.mockHolidays.findIndex((d) => d.id === this.currentHolidayId);
      if (index !== -1) {
        this.mockHolidays[index] = { ...this.mockHolidays[index], ...holidayData };
        this.closeModal();
        this.notificationService.show(
          'Holiday updated successfully',
          'success',
          3000,
        );
        this.GetHolidayFun();
      }
    } else {
      this.updateHolidayForm.markAllAsTouched();
    }
  }

  GetHolidayFun() {
    const searchText = this.searchbarform.get('searchbar')?.value?.toLowerCase();
    let filteredData = this.mockHolidays;

    if (searchText) {
      filteredData = this.mockHolidays.filter((d) =>
        d.holidayName.toLowerCase().includes(searchText) || d.site.toLowerCase().includes(searchText)
      );
    }

    this.totalRecords = filteredData.length;

    if (this.tableSize === 'all') {
      this.holidayList = filteredData;
    } else {
      const startIndex = (this.page - 1) * this.tableSize;
      const endIndex = startIndex + this.tableSize;
      this.holidayList = filteredData.slice(startIndex, endIndex);
    }
  }

  async Status(id: string, status: any) {
    const index = this.mockHolidays.findIndex((d) => d.id === id);
    if (index !== -1) {
      this.mockHolidays[index].is_active = status;
      this.notificationService.show(
        `Holiday ${status ? 'activated' : 'deactivated'} successfully`,
        'success',
        2000,
      );
      this.GetHolidayFun();
    }
  }
}
