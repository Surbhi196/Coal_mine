import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxPaginationModule } from 'ngx-pagination';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

export interface Equipment {
  id: string;
  code: string;
  name: string;
  category: string;
  model: string;
  quantity: number;
  is_active: number;
}

export interface EquipmentIssueRecord {
  id: string;
  empId: string;
  empName: string;
  department: string;
  site: string;
  equipmentCode: string;
  equipmentName: string;
  category: string;
  issueDate: string;
  returnDate: string | null;
  condition: 'Good' | 'Damaged' | 'Lost';
  returnCondition: 'Good' | 'Damaged' | 'Lost' | null;
  status: 'Issued' | 'Returned';
  remarks: string;
}

@Component({
  selector: 'app-equipment-management',
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
  templateUrl: './equipment-management.component.html',
  styleUrl: './equipment-management.component.scss',
  providers: [DatePipe],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'scale(0.85)' })),
      transition(':enter', [
        animate('0.25s ease-out', style({ opacity: 1, transform: 'scale(1)' })),
      ]),
    ]),
  ],
})
export class EquipmentManagementComponent implements OnInit {
  /* ─── pagination & search ─── */
  page = 1;
  tableSize: any = 10;
  tableSizes = [10, 20, 50, 100, 'all'];
  totalRecords = 0;
  showreset = false;
  filterSearch = '';
  filterStatus = ''; // used for active/inactive if needed
  
  /* ─── modal flags ─── */
  addEditModalOpen = false;
  isEditMode = false;
  issueModalOpen = false;
  returnModalOpen = false;
  viewModalOpen = false;

  selectedEquipment: Equipment | null = null;
  selectedRecord: EquipmentIssueRecord | null = null;

  /* ─── forms ─── */
  equipmentForm!: FormGroup;
  issueForm!: FormGroup;
  returnForm!: FormGroup;

  /* ─── display list ─── */
  displayEquipments: Equipment[] = [];
  historyRecords: EquipmentIssueRecord[] = [];

  /* ─── mock master data ─── */
  mockEmployees = [
    { id: 'E001', name: 'Ramesh Kumar', department: 'Mining', site: 'East Mine' },
    { id: 'E002', name: 'Suresh Singh', department: 'Safety', site: 'West Mine' },
    { id: 'E003', name: 'Anita Sharma', department: 'Operations', site: 'North Sector' },
    { id: 'E004', name: 'Vikas Yadav', department: 'Maintenance', site: 'East Mine' },
    { id: 'E005', name: 'Priya Patel', department: 'HR', site: 'West Mine' },
  ];

  mockCategories = [
    'Mining Machinery',
    'Safety Equipment',
    'Transport',
    'Electrical',
    'Drilling Equipment'
  ];

  mockEquipments: Equipment[] = [
    { id: '1', code: 'PPE-HLM', name: 'Safety Helmet', category: 'Safety Equipment', model: 'Standard', quantity: 150, is_active: 1 },
    { id: '2', code: 'PPE-SHO', name: 'Safety Shoes', category: 'Safety Equipment', model: 'Industrial Grade', quantity: 100, is_active: 1 },
    { id: '3', code: 'EQ-001', name: 'Coal Shearer', category: 'Mining Machinery', model: 'Atlas Copco L2D', quantity: 5, is_active: 1 },
    { id: '4', code: 'EQ-002', name: 'Underground Loader', category: 'Mining Machinery', model: 'Cat R1700G', quantity: 3, is_active: 1 },
    { id: '5', code: 'EQ-004', name: 'Hydraulic Drill Rig', category: 'Drilling Equipment', model: 'Sandvik DD421', quantity: 2, is_active: 1 },
  ];

  conditions: Array<'Good' | 'Damaged' | 'Lost'> = ['Good', 'Damaged', 'Lost'];

  /* ─── mock issue records ─── */
  allRecords: EquipmentIssueRecord[] = [
    {
      id: 'ISS-001', empId: 'E001', empName: 'Ramesh Kumar', department: 'Mining', site: 'East Mine',
      equipmentCode: 'PPE-HLM', equipmentName: 'Safety Helmet', category: 'Safety Equipment',
      issueDate: '2025-01-10', returnDate: null,
      condition: 'Good', returnCondition: null, status: 'Issued', remarks: 'New helmet issued for FY25',
    },
    {
      id: 'ISS-002', empId: 'E001', empName: 'Ramesh Kumar', department: 'Mining', site: 'East Mine',
      equipmentCode: 'PPE-SHO', equipmentName: 'Safety Shoes', category: 'Safety Equipment',
      issueDate: '2025-01-10', returnDate: null,
      condition: 'Good', returnCondition: null, status: 'Issued', remarks: 'Size 9',
    },
    {
      id: 'ISS-006', empId: 'E004', empName: 'Vikas Yadav', department: 'Maintenance', site: 'East Mine',
      equipmentCode: 'EQ-004', equipmentName: 'Hydraulic Drill Rig', category: 'Drilling Equipment',
      issueDate: '2025-03-01', returnDate: null,
      condition: 'Good', returnCondition: null, status: 'Issued', remarks: 'Assigned for Block-C drilling',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.equipmentForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      model: [''],
      quantity: ['', [Validators.required, Validators.min(1)]],
    });

    this.issueForm = this.fb.group({
      empId: ['', Validators.required],
      issueDate: ['', Validators.required],
      condition: ['Good', Validators.required],
      remarks: [''],
    });

    this.returnForm = this.fb.group({
      returnDate: ['', Validators.required],
      returnCondition: ['Good', Validators.required],
      remarks: [''],
    });

    this.applyFilter();
  }

  /* ─── filter logic ─── */
  applyFilter() {
    let data = [...this.mockEquipments];

    if (this.filterSearch.trim()) {
      const s = this.filterSearch.toLowerCase();
      data = data.filter(
        (r) =>
          r.name.toLowerCase().includes(s) ||
          r.code.toLowerCase().includes(s) ||
          r.category.toLowerCase().includes(s) ||
          r.model.toLowerCase().includes(s)
      );
    }

    if (this.filterStatus) {
      const statusVal = this.filterStatus === 'Active' ? 1 : 0;
      data = data.filter((r) => r.is_active === statusVal);
    }

    this.totalRecords = data.length;

    if (this.tableSize === 'all') {
      this.displayEquipments = data;
    } else {
      const start = (this.page - 1) * Number(this.tableSize);
      this.displayEquipments = data.slice(start, start + Number(this.tableSize));
    }
  }

  onTableSizeChange(event: any) {
    this.tableSize = event.target.value;
    this.page = 1;
    this.applyFilter();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.applyFilter();
  }

  resetFilter() {
    this.filterSearch = '';
    this.filterStatus = '';
    this.showreset = false;
    this.page = 1;
    this.applyFilter();
  }

  onFilterChange() {
    this.showreset = true;
    this.page = 1;
    this.applyFilter();
  }

  /* ─── Equipment Master Actions ─── */
  openAddModal() {
    this.isEditMode = false;
    this.selectedEquipment = null;
    this.equipmentForm.reset();
    this.addEditModalOpen = true;
  }

  openEditModal(eq: Equipment) {
    this.isEditMode = true;
    this.selectedEquipment = eq;
    this.equipmentForm.patchValue({
      name: eq.name,
      category: eq.category,
      model: eq.model,
      quantity: eq.quantity,
    });
    this.addEditModalOpen = true;
  }

  closeEquipmentModal() {
    this.addEditModalOpen = false;
  }

  saveEquipment() {
    if (this.equipmentForm.invalid) {
      this.equipmentForm.markAllAsTouched();
      return;
    }

    const val = this.equipmentForm.value;

    if (this.isEditMode && this.selectedEquipment) {
      const idx = this.mockEquipments.findIndex((e) => e.id === this.selectedEquipment!.id);
      if (idx > -1) {
        this.mockEquipments[idx].name = val.name;
        this.mockEquipments[idx].category = val.category;
        this.mockEquipments[idx].model = val.model;
        this.mockEquipments[idx].quantity = val.quantity;
      }
      this.notificationService.show('Equipment updated successfully', 'success', 3000);
    } else {
      const newId = String(this.mockEquipments.length + 1);
      const newCode = 'EQ-' + String(this.mockEquipments.length + 1).padStart(3, '0');
      this.mockEquipments.unshift({
        id: newId,
        code: newCode,
        name: val.name,
        category: val.category,
        model: val.model || '',
        quantity: val.quantity,
        is_active: 1,
      });
      this.notificationService.show('Equipment added successfully', 'success', 3000);
    }
    
    this.closeEquipmentModal();
    this.applyFilter();
  }

  toggleStatus(eq: Equipment, status: number) {
    eq.is_active = status;
    this.notificationService.show(`Equipment ${status ? 'Activated' : 'Deactivated'}`, 'success', 2000);
    this.applyFilter();
  }

  /* ─── Issue Equipment ─── */
  openIssueModal(eq: Equipment) {
    if (this.getAvailableStock(eq.code) <= 0) {
      this.notificationService.show('Limit crossed! Insufficient stock available for assignment.', 'error', 3000);
      return;
    }
    this.selectedEquipment = eq;
    this.issueForm.reset({ condition: 'Good' });
    this.issueModalOpen = true;
  }

  closeIssueModal() {
    this.issueModalOpen = false;
    this.selectedEquipment = null;
    this.issueForm.reset();
  }

  submitIssue() {
    if (this.issueForm.invalid) {
      this.issueForm.markAllAsTouched();
      return;
    }
    if (!this.selectedEquipment) return;
    
    const available = this.getAvailableStock(this.selectedEquipment.code);
    if (available <= 0) {
      this.notificationService.show('Limit crossed! Insufficient stock available for assignment.', 'error', 3000);
      return;
    }

    const val = this.issueForm.value;
    const emp = this.mockEmployees.find((e) => e.id === val.empId)!;
    const newId = `ISS-${String(this.allRecords.length + 1).padStart(3, '0')}`;

    const record: EquipmentIssueRecord = {
      id: newId,
      empId: emp.id,
      empName: emp.name,
      department: emp.department,
      site: emp.site,
      equipmentCode: this.selectedEquipment.code,
      equipmentName: this.selectedEquipment.name,
      category: this.selectedEquipment.category,
      issueDate: val.issueDate,
      returnDate: null,
      condition: val.condition,
      returnCondition: null,
      status: 'Issued',
      remarks: val.remarks || '',
    };

    this.allRecords.unshift(record);
    this.closeIssueModal();
    this.notificationService.show('Equipment assigned successfully', 'success', 3000);
    this.applyFilter(); 
    
    if (this.viewModalOpen) {
        this.loadHistory(this.selectedEquipment.code);
    }
  }

  /* ─── View Details ─── */
  openViewModal(eq: Equipment) {
    this.selectedEquipment = eq;
    this.loadHistory(eq.code);
    this.viewModalOpen = true;
  }

  closeViewModal() {
    this.viewModalOpen = false;
    this.selectedEquipment = null;
  }

  loadHistory(code: string) {
    this.historyRecords = this.allRecords.filter(r => r.equipmentCode === code);
  }

  /* ─── Return Equipment (Can be called from history view) ─── */
  openReturnModal(record: EquipmentIssueRecord) {
    this.selectedRecord = record;
    this.returnForm.reset({ returnCondition: 'Good' });
    this.returnModalOpen = true;
  }

  closeReturnModal() {
    this.returnModalOpen = false;
    this.selectedRecord = null;
  }

  submitReturn() {
    if (this.returnForm.invalid) {
      this.returnForm.markAllAsTouched();
      return;
    }

    const val = this.returnForm.value;
    const idx = this.allRecords.findIndex((r) => r.id === this.selectedRecord!.id);
    if (idx !== -1) {
      this.allRecords[idx].returnDate = val.returnDate;
      this.allRecords[idx].returnCondition = val.returnCondition;
      this.allRecords[idx].status = 'Returned';
      this.allRecords[idx].remarks = val.remarks || this.allRecords[idx].remarks;
    }

    this.closeReturnModal();
    this.notificationService.show(`Equipment returned successfully`, 'success', 3000);
    
    if (this.selectedEquipment) {
        this.loadHistory(this.selectedEquipment.code);
    }
    this.applyFilter();
  }

  /* ─── Helpers ─── */
  getIssuedStock(code: string): number {
    return this.allRecords.filter((r) => r.equipmentCode === code && r.status === 'Issued').length;
  }

  getAvailableStock(code: string): number {
    const eq = this.mockEquipments.find(e => e.code === code);
    if (!eq) return 0;
    return eq.quantity - this.getIssuedStock(code);
  }

  conditionBadgeClass(condition: string | null): string {
    if (!condition) return '';
    if (condition === 'Good') return 'badge-good';
    if (condition === 'Damaged') return 'badge-damaged';
    if (condition === 'Lost') return 'badge-lost';
    return '';
  }

  statusBadgeClass(status: string): string {
    return status === 'Issued' ? 'badge-issued' : 'badge-returned';
  }

  isOverdue(record: EquipmentIssueRecord): boolean {
    return false; // Expected Return Date removed
  }
}
