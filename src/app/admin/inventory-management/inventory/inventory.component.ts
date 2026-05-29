import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificationService } from 'src/app/core/services/notificationnew.service';

interface InventoryItem {
  id: number;
  productName: string;
  category: string;
  subCategory: string;
  totalStock: number;
  employeeName: string;
}

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss',
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0, transform: 'scale(0.95)' })),
      transition(':enter', [
        animate('0.25s ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('0.15s ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class InventoryComponent implements OnInit {
  showreset = false;
  searchbarform!: FormGroup;

  // Pagination parameters
  page = 1;
  tableSize: any = 10;
  tableSizes: any = [10, 25, 50, 100, 'all'];
  totalRecords = 0;

  // Mock Products list for selector dropdown
  productList: string[] = [
    'SAND', 'WATER PURIFIER 80 LTR (FILTER)', 'WOOD CUT PIECES 8\'x3\'x2"', 'WOOD CUT PIECES 4\'x3\'x2"',
    'WIRE BRUSH', 'WIRE 2 CORE ALUMINIUM', 'WIRE 1.50 MM', 'WELDING ELECTRODES', 'VOLT METER 500 V. (DAMAGE)', 'VESSEL CAP'
  ];

  // Mock Inventory items matching the requested project dataset exactly (omitting Company and Locations as requested)
  inventoryItems: InventoryItem[] = [
    { id: 1, productName: 'SAND', category: 'PUMP HOUSE+IRP', subCategory: 'TRANCHER MATERIALS', totalStock: 680953.71, employeeName: 'Ramesh Kumar' },
    { id: 2, productName: 'WATER PURIFIER 80 LTR (FILTER)', category: 'CIVIL WORK', subCategory: 'DI PIPE AND FITTINGS', totalStock: 1, employeeName: 'Sanjay Sharma' },
    { id: 3, productName: 'WOOD CUT PIECES 8\'x3\'x2"', category: 'MISC', subCategory: 'MEASUREMENT', totalStock: 35, employeeName: 'Ramesh Kumar' },
    { id: 4, productName: 'WOOD CUT PIECES 4\'x3\'x2"', category: 'MISC', subCategory: 'MEASUREMENT', totalStock: 6, employeeName: 'Vijay Yadav' },
    { id: 5, productName: 'WIRE BRUSH', category: 'MISC', subCategory: 'TRANCHER MATERIALS', totalStock: 2, employeeName: 'Sanjay Sharma' },
    { id: 6, productName: 'WIRE 2 CORE ALUMINIUM', category: 'IRP', subCategory: 'ELECTRICAL FITTINGS-PH', totalStock: 53, employeeName: 'Vijay Yadav' },
    { id: 7, productName: 'WIRE 1.50 MM', category: 'IRP', subCategory: 'ELECTRICAL FITTINGS-PH', totalStock: 130, employeeName: 'Ramesh Kumar' },
    { id: 8, productName: 'WELDING ELECTRODES', category: 'IRP', subCategory: 'DI PIPE AND FITTINGS', totalStock: 1, employeeName: 'Vijay Yadav' },
    { id: 9, productName: 'VOLT METER 500 V. (DAMAGE)', category: 'IRP', subCategory: 'ELECTRICAL FITTINGS-PH', totalStock: 1, employeeName: 'Sanjay Sharma' },
    { id: 10, productName: 'VESSEL CAP', category: 'MISC', subCategory: 'FAN BELT', totalStock: 2, employeeName: 'Ramesh Kumar' }
  ];
  filteredInventoryItems: InventoryItem[] = [];

  // Modals state flags
  createInventoryOpen = false;
  bulkUploadOpen = false;
  viewInventoryOpen = false;

  // Forms mapping
  createInventoryForm!: FormGroup;
  bulkUploadForm!: FormGroup;
  viewInventoryForm!: FormGroup;

  selectedItem: InventoryItem | null = null;
  uploadedFileName = '';

  // Assignments & Employee Databases for Cascading Allocations
  mockEmployees = [
    { id: 'EMP001', name: 'Ramesh Kumar', site: 'East Mine', department: 'Excavation' },
    { id: 'EMP002', name: 'Sanjay Sharma', site: 'East Mine', department: 'Safety' },
    { id: 'EMP003', name: 'Vijay Yadav', site: 'West Mine', department: 'Maintenance' },
    { id: 'EMP004', name: 'Amit Mishra', site: 'West Mine', department: 'Operations' },
    { id: 'EMP005', name: 'Rajesh Patel', site: 'North Sector', department: 'Excavation' },
    { id: 'EMP006', name: 'Vikram Singh', site: 'North Sector', department: 'Safety' }
  ];

  assignments: any[] = [
    { id: 1, productName: 'SAND', category: 'PUMP HOUSE+IRP', subCategory: 'TRANCHER MATERIALS', quantity: 500, employeeName: 'Ramesh Kumar', employeeId: 'EMP001', site: 'East Mine', department: 'Excavation', issueDate: '2026-05-27' },
    { id: 2, productName: 'WIRE BRUSH', category: 'MISC', subCategory: 'TRANCHER MATERIALS', quantity: 1, employeeName: 'Sanjay Sharma', employeeId: 'EMP002', site: 'East Mine', department: 'Safety', issueDate: '2026-05-26' }
  ];

  assignProductOpen = false;
  assignForm!: FormGroup;
  selectedProductMaxStock = 0;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initSearchForm();
    this.initForms();
    this.refreshFilteredData();
  }

  initSearchForm() {
    this.searchbarform = this.formBuilder.group({
      searchbar: ['']
    });

    this.searchbarform.get('searchbar')?.valueChanges.subscribe(val => {
      this.showreset = !!val;
      this.searchfun();
    });
  }

  initForms() {
    // Note: Warehouse and Vendor are strictly omitted as requested
    this.createInventoryForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: [{ value: '', disabled: true }],
      subCategory: [{ value: '', disabled: true }],
      quantity: ['', [Validators.required, Validators.min(1)]]
    });

    this.bulkUploadForm = this.formBuilder.group({
      file: [null, Validators.required]
    });

    // View Details includes: product name, employee name, category, total stock
    this.viewInventoryForm = this.formBuilder.group({
      productName: [''],
      employeeName: [''],
      category: [''],
      totalStock: ['']
    });

    this.assignForm = this.formBuilder.group({
      productName: ['', Validators.required],
      category: [{ value: '', disabled: true }],
      subCategory: [{ value: '', disabled: true }],
      site: ['', Validators.required],
      department: ['', Validators.required],
      employeeId: [{ value: '', disabled: true }, Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      issueDate: [new Date().toISOString().substring(0, 10), Validators.required]
    });

    this.assignForm.get('site')?.valueChanges.subscribe(() => this.updateEmployeeSelectorState());
    this.assignForm.get('department')?.valueChanges.subscribe(() => this.updateEmployeeSelectorState());
  }

  refreshFilteredData() {
    this.filteredInventoryItems = [...this.inventoryItems];
    this.totalRecords = this.filteredInventoryItems.length;
  }

  searchfun() {
    const query = this.searchbarform.get('searchbar')?.value?.trim().toLowerCase();
    if (!query) {
      this.refreshFilteredData();
      return;
    }

    this.filteredInventoryItems = this.inventoryItems.filter(item =>
      item.productName.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
    this.totalRecords = this.filteredInventoryItems.length;
    this.page = 1;
  }

  resetsearchbar() {
    this.searchbarform.patchValue({ searchbar: '' });
    this.showreset = false;
    this.refreshFilteredData();
  }

  onTableSizeChange(event: any) {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  onTableDataChange(pageNumber: number) {
    this.page = pageNumber;
  }

  onProductChange(event: any) {
    const productName = event.target.value;
    // Map categories and subcategories dynamically to make UX super premium!
    const mapping: any = {
      'SAND': { cat: 'PUMP HOUSE+IRP', subCat: 'TRANCHER MATERIALS' },
      'WATER PURIFIER 80 LTR (FILTER)': { cat: 'CIVIL WORK', subCat: 'DI PIPE AND FITTINGS' },
      'WOOD CUT PIECES 8\'x3\'x2"': { cat: 'MISC', subCat: 'MEASUREMENT' },
      'WOOD CUT PIECES 4\'x3\'x2"': { cat: 'MISC', subCat: 'MEASUREMENT' },
      'WIRE BRUSH': { cat: 'MISC', subCat: 'TRANCHER MATERIALS' },
      'WIRE 2 CORE ALUMINIUM': { cat: 'IRP', subCat: 'ELECTRICAL FITTINGS-PH' },
      'WIRE 1.50 MM': { cat: 'IRP', subCat: 'ELECTRICAL FITTINGS-PH' },
      'WELDING ELECTRODES': { cat: 'IRP', subCat: 'DI PIPE AND FITTINGS' },
      'VOLT METER 500 V. (DAMAGE)': { cat: 'IRP', subCat: 'ELECTRICAL FITTINGS-PH' },
      'VESSEL CAP': { cat: 'MISC', subCat: 'FAN BELT' }
    };

    const selected = mapping[productName] || { cat: 'Misc', subCat: '—' };
    this.createInventoryForm.patchValue({
      category: selected.cat,
      subCategory: selected.subCat
    });
  }

  openAddProductModal() {
    this.createInventoryForm.reset({
      productName: '',
      category: '',
      subCategory: '',
      quantity: ''
    });
    this.createInventoryOpen = true;
  }

  openBulkUploadModal() {
    this.bulkUploadForm.reset();
    this.uploadedFileName = '';
    this.bulkUploadOpen = true;
  }

  openViewProductModal(item: InventoryItem) {
    this.selectedItem = item;
    this.viewInventoryForm.patchValue({
      productName: item.productName,
      employeeName: item.employeeName,
      category: item.category,
      totalStock: item.totalStock
    });
    this.viewInventoryOpen = true;
  }

  closeModal() {
    this.createInventoryOpen = false;
    this.bulkUploadOpen = false;
    this.viewInventoryOpen = false;
    this.assignProductOpen = false;
    this.selectedItem = null;
  }

  createInventoryItem() {
    if (this.createInventoryForm.invalid) {
      this.createInventoryForm.markAllAsTouched();
      return;
    }

    const productName = this.createInventoryForm.get('productName')?.value;
    const category = this.createInventoryForm.get('category')?.value;
    const subCategory = this.createInventoryForm.get('subCategory')?.value;
    const quantity = Number(this.createInventoryForm.get('quantity')?.value);

    // If item already exists in inventory, sum up totalStock, else create next
    const existing = this.inventoryItems.find(item => item.productName.toUpperCase() === productName.toUpperCase());

    if (existing) {
      existing.totalStock += quantity;
      existing.employeeName = 'Ramesh Kumar'; // Modified by current logged supervisor
    } else {
      const nextId = this.inventoryItems.length > 0 ? Math.max(...this.inventoryItems.map(item => item.id)) + 1 : 1;
      const newItem: InventoryItem = {
        id: nextId,
        productName: productName,
        category: category || 'Misc',
        subCategory: subCategory || '—',
        totalStock: quantity,
        employeeName: 'Ramesh Kumar'
      };
      this.inventoryItems.unshift(newItem);
    }

    this.refreshFilteredData();
    this.notificationService.show('Product added to inventory successfully.', 'success', 3000);
    this.closeModal();
  }

  onFileChange(event: any) {
    const file = event.target.files?.[0];
    if (file) {
      this.uploadedFileName = file.name;
      this.bulkUploadForm.patchValue({ file: file });
    }
  }

  uploadBulkFile() {
    if (this.bulkUploadForm.invalid) {
      this.bulkUploadForm.markAllAsTouched();
      return;
    }

    this.notificationService.show(`Bulk inventory file "${this.uploadedFileName}" uploaded and processed successfully.`, 'success', 3000);
    this.closeModal();
  }

  // --- Assign Product to Employee Logic ---
  openAssignModal() {
    this.assignForm.reset({
      productName: '',
      category: '',
      subCategory: '',
      site: '',
      department: '',
      employeeId: '',
      quantity: '',
      issueDate: new Date().toISOString().substring(0, 10)
    });
    this.selectedProductMaxStock = 0;
    this.assignForm.get('employeeId')?.disable();
    this.assignProductOpen = true;
  }

  onAssignProductChange(event: any) {
    const productName = event.target.value;
    const selectedItem = this.inventoryItems.find(item => item.productName === productName);
    if (selectedItem) {
      this.selectedProductMaxStock = selectedItem.totalStock;
      this.assignForm.patchValue({
        category: selectedItem.category,
        subCategory: selectedItem.subCategory
      });
      this.assignForm.get('quantity')?.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(selectedItem.totalStock)
      ]);
      this.assignForm.get('quantity')?.updateValueAndValidity();
    } else {
      this.selectedProductMaxStock = 0;
      this.assignForm.patchValue({
        category: '',
        subCategory: ''
      });
      this.assignForm.get('quantity')?.setValidators([Validators.required, Validators.min(1)]);
      this.assignForm.get('quantity')?.updateValueAndValidity();
    }
  }

  updateEmployeeSelectorState() {
    const site = this.assignForm.get('site')?.value;
    const department = this.assignForm.get('department')?.value;
    const empControl = this.assignForm.get('employeeId');
    if (site && department) {
      empControl?.enable();
    } else {
      empControl?.disable();
      empControl?.setValue('');
    }
  }

  getFilteredEmployees() {
    const site = this.assignForm.get('site')?.value;
    const department = this.assignForm.get('department')?.value;
    if (!site || !department) return [];
    return this.mockEmployees.filter(emp => emp.site === site && emp.department === department);
  }

  submitAssignment() {
    if (this.assignForm.invalid) {
      this.assignForm.markAllAsTouched();
      return;
    }

    const formValues = this.assignForm.getRawValue();
    const { productName, employeeId, quantity, site, department, issueDate } = formValues;

    // Deduct stock in real-time
    const selectedItem = this.inventoryItems.find(item => item.productName === productName);
    if (selectedItem) {
      if (selectedItem.totalStock < quantity) {
        this.notificationService.show('Assigned quantity cannot exceed available stock.', 'error', 3000);
        return;
      }
      selectedItem.totalStock -= quantity;
    }

    // Find Employee details
    const emp = this.mockEmployees.find(e => e.id === employeeId);
    const employeeName = emp ? emp.name : 'Unknown';

    // Store in assignments log
    const nextId = this.assignments.length > 0 ? Math.max(...this.assignments.map(a => a.id)) + 1 : 1;
    const newAssignment = {
      id: nextId,
      productName,
      category: selectedItem?.category || 'Misc',
      subCategory: selectedItem?.subCategory || '—',
      quantity,
      employeeName,
      employeeId,
      site,
      department,
      issueDate
    };
    this.assignments.unshift(newAssignment);

    this.refreshFilteredData();
    this.notificationService.show(`Successfully assigned ${quantity} unit(s) of ${productName} to ${employeeName}.`, 'success', 3000);
    this.closeModal();
  }

  getProductAssignments(productName: string): any[] {
    return this.assignments.filter(a => a.productName === productName);
  }
}
