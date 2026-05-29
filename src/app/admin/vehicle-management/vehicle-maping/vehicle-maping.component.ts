import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-vehicle-maping',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MatMenuModule,
    NgxPaginationModule
  ],
  templateUrl: './vehicle-maping.component.html',
  styleUrl: './vehicle-maping.component.scss'
})
export class VehicleMapingComponent {
  showEntries: number = 10;
  searchText: string = '';
  p: number = 1;

  mapDriverModalOpen: boolean = false;
  historyModalOpen: boolean = false;
  unmapConfirmModalOpen: boolean = false;

  currentVehicle: any = null;

  drivers = ['NAMAN SETHIA', 'GHANSHYAM BHATI', 'DRIVERTEST', 'SANDIPAN DEBNATH', 'Tariq Test'];

  displayedColumns: string[] = ['id', 'vehicleNo', 'driverName', 'modelName', 'type', 'status', 'action'];
  dataSource = [
    { id: 1, vehicleNo: 'TR01AV1506', driverName: 'NAMAN SETHIA', modelName: '1920 TRUCK', type: '1', status: 'Mapped' },
    { id: 2, vehicleNo: 'RJ07HS2600', driverName: 'GHANSHYAM BHATI', modelName: 'BIKE', type: '1', status: 'Mapped' },
    { id: 3, vehicleNo: 'RJ23EA0873', driverName: 'DRIVERTEST', modelName: 'COMPRESSOR', type: '1', status: 'Mapped' },
    { id: 4, vehicleNo: 'RJ07EA1966', driverName: '-', modelName: 'BACKHOE LOADER', type: '1', status: 'Not Mapped' },
    { id: 5, vehicleNo: 'RJ14UJ9427', driverName: '-', modelName: 'FORTUNER', type: '1', status: 'Not Mapped' },
    { id: 6, vehicleNo: 'RJ07CD9719', driverName: '-', modelName: 'HYRYDER', type: '1', status: 'Not Mapped' },
    { id: 7, vehicleNo: 'TR01AV1523', driverName: 'SANDIPAN DEBNATH', modelName: '1815 TRUCK', type: '1', status: 'Mapped' },
    { id: 8, vehicleNo: 'TR01BV0422', driverName: 'Tariq Test', modelName: 'CAMPER', type: '1', status: 'Mapped' },
    { id: 9, vehicleNo: 'RJ07UC4455', driverName: '-', modelName: 'INNOVA HYCROSS', type: '1', status: 'Not Mapped' },
    { id: 10, vehicleNo: 'TR01AR8580', driverName: '-', modelName: 'ACTIVA 125', type: '1', status: 'Not Mapped' },
  ];

  historyDisplayedColumns: string[] = ['vehicleNo', 'action', 'date', 'driver'];
  historyDataSource = [
    { vehicleNo: 'TR01AV1506', action: 'Map', date: '01/11/2025', driver: 'NAMAN SETHIA' }
  ];

  openMapDriverModal(element: any) {
    this.currentVehicle = element;
    this.mapDriverModalOpen = true;
  }

  openHistoryModal(element: any) {
    this.currentVehicle = element;
    this.historyModalOpen = true;
  }

  openUnmapConfirmModal(element: any) {
    this.currentVehicle = element;
    this.unmapConfirmModalOpen = true;
  }

  closeModal() {
    this.mapDriverModalOpen = false;
    this.historyModalOpen = false;
    this.unmapConfirmModalOpen = false;
    this.currentVehicle = null;
  }
}

