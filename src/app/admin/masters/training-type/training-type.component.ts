import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { trigger, transition, style, animate } from '@angular/animations';

export interface TrainingType {
  id: string;
  name: string;
  is_active: number;
}

@Component({
  selector: 'app-training-type',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgxPaginationModule],
  templateUrl: './training-type.component.html',
  styleUrls: ['./training-type.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class TrainingTypeComponent implements OnInit {
  trainingTypes: TrainingType[] = [
    { id: 'TT-001', name: 'Safety Training', is_active: 1 },
    { id: 'TT-002', name: 'Equipment Operations', is_active: 1 },
    { id: 'TT-003', name: 'Emergency Response', is_active: 1 },
  ];
  displayTypes: TrainingType[] = [];

  page: number = 1;
  totalRecords: number = 0;
  tableSize: any = 10;
  tableSizes: any = [10, 25, 50, 100, 'all'];

  filterSearch: string = '';
  filterStatus: string = '';
  showreset: boolean = false;

  modalOpen: boolean = false;
  isEditMode: boolean = false;
  viewTrainingTypeOpen: boolean = false;
  typeForm!: FormGroup;
  selectedType: TrainingType | null = null;
  selectedTrainingType: TrainingType | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.typeForm = this.fb.group({
      name: ['', Validators.required],
    });
    this.filterData();
  }

  filterData(): void {
    this.displayTypes = this.trainingTypes.filter((t) => {
      const matchSearch = t.name.toLowerCase().includes(this.filterSearch.toLowerCase());
      const matchStatus = this.filterStatus === '' || 
                          (this.filterStatus === 'Active' && t.is_active === 1) ||
                          (this.filterStatus === 'Inactive' && t.is_active === 0);
      return matchSearch && matchStatus;
    });
    this.totalRecords = this.displayTypes.length;
    this.showreset = this.filterSearch !== '' || this.filterStatus !== '';
  }

  onFilterChange(): void {
    this.page = 1;
    this.filterData();
  }

  resetFilter(): void {
    this.filterSearch = '';
    this.filterStatus = '';
    this.page = 1;
    this.filterData();
  }

  onTableDataChange(event: any): void {
    this.page = event;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value === 'all' ? 'all' : Number(event.target.value);
    this.page = 1;
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.selectedType = null;
    this.typeForm.reset();
    this.modalOpen = true;
  }

  openEditModal(type: TrainingType): void {
    this.isEditMode = true;
    this.selectedType = type;
    this.typeForm.patchValue({ name: type.name });
    this.modalOpen = true;
  }

  openviewModal(type: TrainingType): void {
    this.viewTrainingTypeOpen = true;
    this.selectedTrainingType = type;
  }

  closeModal(): void {
    this.modalOpen = false;
    this.viewTrainingTypeOpen = false;
    this.selectedTrainingType = null;
  }

  saveType(): void {
    if (this.typeForm.invalid) {
      this.typeForm.markAllAsTouched();
      return;
    }
    const val = this.typeForm.value;
    if (this.isEditMode && this.selectedType) {
      this.selectedType.name = val.name;
    } else {
      const newId = 'TT-' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      this.trainingTypes.unshift({
        id: newId,
        name: val.name,
        is_active: 1
      });
    }
    this.closeModal();
    this.filterData();
  }

  toggleStatus(type: TrainingType, status: number): void {
    type.is_active = status;
    this.filterData();
  }
}
