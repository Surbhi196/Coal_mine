import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgxPaginationModule } from 'ngx-pagination';

export interface FuelStation {
  id: number;
  name: string;
  address: string;
  status: boolean;
}

const ELEMENT_DATA: FuelStation[] = [
  { id: 1, name: 'RAJIB PETROLEUM AGENCY', address: 'UDAIPUR', status: true },
  { id: 2, name: 'RM SAHA', address: 'SANTIRBAZAR', status: true },
  { id: 3, name: 'ANNAPURNA FILLING STATION', address: 'KAMALPUR', status: true },
  { id: 4, name: 'BASUDEB PETROLEUM AGENCY', address: 'JOLAIBARI', status: true },
  { id: 5, name: 'MONALI & ANALISHA PET', address: 'BANIKYA CHOWMANI', status: true },
  { id: 6, name: 'DEBNATH PETROLEUM AGENCY', address: 'KALYANPUR', status: true },
  { id: 7, name: 'M/S KIRON PETROLEUM AGENCY', address: 'MANU', status: true },
  { id: 8, name: 'MAA PETROLEUM', address: 'MOHANPUR', status: true },
  { id: 9, name: 'COCO JOYGURU', address: 'BISHALGARH', status: true },
  { id: 10, name: 'DRUM', address: 'NA', status: true },
];

@Component({
  selector: 'app-fuel-stations',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSlideToggleModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule
  ],
  templateUrl: './fuel-stations.component.html',
  styleUrl: './fuel-stations.component.scss'
})
export class FuelStationsComponent {
  displayedColumns: string[] = ['id', 'name', 'address', 'status', 'action'];
  dataSource = ELEMENT_DATA;
  showEntries: number = 10;
  searchText: string = '';
  p: number = 1;

  createFuelStationOpen: boolean = false;
  updateFuelStationOpen: boolean = false;
  viewFuelStationOpen: boolean = false;
  currentStation: FuelStation | null = null;
  selectedViewStation: FuelStation | null = null;

  constructor() {}

  openAddModal() {
    this.createFuelStationOpen = true;
  }

  openEditModal(station: FuelStation) {
    this.currentStation = station;
    this.updateFuelStationOpen = true;
  }

  openViewModal(station: FuelStation) {
    this.selectedViewStation = station;
    this.viewFuelStationOpen = true;
  }

  closeModal() {
    this.createFuelStationOpen = false;
    this.updateFuelStationOpen = false;
    this.viewFuelStationOpen = false;
    this.selectedViewStation = null;
  }
}
