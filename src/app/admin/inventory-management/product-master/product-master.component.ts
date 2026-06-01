import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';

interface Product {
  id: number;
  name: string;
  category: string;
  minStock: number;
  is_active: number;
}

@Component({
  selector: 'app-product-master',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgSelectModule, NgxPaginationModule],
  templateUrl: './product-master.component.html',
  styleUrl: './product-master.component.scss',
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
export class ProductMasterComponent implements OnInit {
  showreset = false;
  searchbarform!: FormGroup;

  // Pagination parameters
  page = 1;
  tableSize: any = 10;
  tableSizes: any = [10, 25, 50, 100, 'all'];
  totalRecords = 0;

  // Mock Categories list with Subcategories grouped under them
  categories: { name: string; subcategories: string[] }[] = [
    {
      name: 'Pump House',
      subcategories: ['Pump House', 'Pump House Fitting', 'Water Pump', 'Sump Pump']
    },
    {
      name: 'IRP',
      subcategories: ['IRP', 'IRP Valve', 'Pressure Gauge', 'Agitator Motor', 'Air Blower']
    },
    {
      name: 'Pump House+IRP',
      subcategories: ['Pump House+IRP', 'Integrated Pump', 'Flow Meter']
    },
    {
      name: 'JCB',
      subcategories: ['JCB', 'JCB Bucket', 'Hydraulic Hose']
    },
    {
      name: 'Misc',
      subcategories: ['Misc', 'General Tools', 'Safety Gear']
    },
    {
      name: 'RMC/Road Work',
      subcategories: ['RMC/Road Work', 'Admixture', 'Aggregate (10 MM)', 'Aggregate (20 MM)']
    },
    {
      name: 'Civil Work',
      subcategories: ['Civil Work', 'Cement Bags', 'Steel Rods']
    },
    {
      name: 'Combine',
      subcategories: ['Combine', 'Cut Off Machine', 'Harvester Blade']
    },
    {
      name: 'Road Work',
      subcategories: ['Road Work', 'Adjustable Props', 'Asphalt Mix']
    }
  ];

  // Flat Categories list with group mapping for ng-select
  categoriesGrouped = [
    { name: 'Pump House', category: 'Pump House' },
    { name: 'Pump House Fitting', category: 'Pump House' },
    { name: 'Water Pump', category: 'Pump House' },
    { name: 'Sump Pump', category: 'Pump House' },
    
    { name: 'IRP', category: 'IRP' },
    { name: 'IRP Valve', category: 'IRP' },
    { name: 'Pressure Gauge', category: 'IRP' },
    { name: 'Agitator Motor', category: 'IRP' },
    { name: 'Air Blower', category: 'IRP' },

    { name: 'Pump House+IRP', category: 'Pump House+IRP' },
    { name: 'Integrated Pump', category: 'Pump House+IRP' },
    { name: 'Flow Meter', category: 'Pump House+IRP' },

    { name: 'JCB', category: 'JCB' },
    { name: 'JCB Bucket', category: 'JCB' },
    { name: 'Hydraulic Hose', category: 'JCB' },

    { name: 'Misc', category: 'Misc' },
    { name: 'General Tools', category: 'Misc' },
    { name: 'Safety Gear', category: 'Misc' },

    { name: 'RMC/Road Work', category: 'RMC/Road Work' },
    { name: 'Admixture', category: 'RMC/Road Work' },
    { name: 'Aggregate (10 MM)', category: 'RMC/Road Work' },
    { name: 'Aggregate (20 MM)', category: 'RMC/Road Work' },

    { name: 'Civil Work', category: 'Civil Work' },
    { name: 'Cement Bags', category: 'Civil Work' },
    { name: 'Steel Rods', category: 'Civil Work' },

    { name: 'Combine', category: 'Combine' },
    { name: 'Cut Off Machine', category: 'Combine' },
    { name: 'Harvester Blade', category: 'Combine' },

    { name: 'Road Work', category: 'Road Work' },
    { name: 'Adjustable Props', category: 'Road Work' },
    { name: 'Asphalt Mix', category: 'Road Work' }
  ];

  // Mock Products list matching the requested project dataset
  products: Product[] = [
    { id: 1, name: '14 CUT OFF MACHINE CO 200', category: 'Combine', minStock: 5, is_active: 1 },
    { id: 2, name: 'ADJUSTABLE PROPS', category: 'Road Work', minStock: 10, is_active: 1 },
    { id: 3, name: 'ADMIXTURE', category: 'RMC/Road Work', minStock: 50, is_active: 1 },
    { id: 4, name: 'AGGREGATE (10 MM)', category: 'RMC/Road Work', minStock: 100, is_active: 1 },
    { id: 5, name: 'AGGREGATE (20 MM)', category: 'RMC/Road Work', minStock: 100, is_active: 1 },
    { id: 6, name: 'AGITATOR MOTOR WITH GEAR BOX', category: 'IRP', minStock: 2, is_active: 1 },
    { id: 7, name: 'AIR BLOWER', category: 'IRP', minStock: 4, is_active: 1 },
    { id: 8, name: 'AIR BLOWER (DAMAGE)', category: 'IRP', minStock: 0, is_active: 1 },
    { id: 9, name: 'AIR BLOWER BELT', category: 'IRP', minStock: 15, is_active: 1 },
    { id: 10, name: 'AIR BLOWER FILTER', category: 'IRP', minStock: 20, is_active: 1 }
  ];
  filteredProducts: Product[] = [];

  // Modals state flags
  createProductOpen = false;
  updateProductOpen = false;
  viewProductOpen = false;

  // Forms mapping
  createProductForm!: FormGroup;
  updateProductForm!: FormGroup;
  viewProductForm!: FormGroup;

  selectedProduct: Product | null = null;

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
    // Note: Company and UOM fields are strictly omitted as requested
    this.createProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      minStock: ['', [Validators.required, Validators.min(0)]]
    });

    this.updateProductForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      minStock: ['', [Validators.required, Validators.min(0)]]
    });

    this.viewProductForm = this.formBuilder.group({
      name: [''],
      category: [''],
      minStock: [''],
      status: ['']
    });
  }

  refreshFilteredData() {
    this.filteredProducts = [...this.products];
    this.totalRecords = this.filteredProducts.length;
  }

  searchfun() {
    const query = this.searchbarform.get('searchbar')?.value?.trim().toLowerCase();
    if (!query) {
      this.refreshFilteredData();
      return;
    }

    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );
    this.totalRecords = this.filteredProducts.length;
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

  toggleProductStatus(prod: Product) {
    prod.is_active = prod.is_active === 1 ? 0 : 1;
    this.notificationService.show(
      `Product status changed to ${prod.is_active === 1 ? 'Active' : 'Inactive'} successfully.`,
      'success',
      3000
    );
  }

  openAddProductModal() {
    this.createProductForm.reset({
      name: '',
      category: '',
      minStock: ''
    });
    this.createProductOpen = true;
  }

  openEditProductModal(prod: Product) {
    this.selectedProduct = prod;
    this.updateProductForm.patchValue({
      name: prod.name,
      category: prod.category,
      minStock: prod.minStock
    });
    this.updateProductOpen = true;
  }

  openViewProductModal(prod: Product) {
    this.selectedProduct = prod;
    this.viewProductForm.patchValue({
      name: prod.name,
      category: prod.category,
      minStock: prod.minStock,
      status: prod.is_active === 1 ? 'Active' : 'Inactive'
    });
    this.viewProductOpen = true;
  }

  closeModal() {
    this.createProductOpen = false;
    this.updateProductOpen = false;
    this.viewProductOpen = false;
    this.selectedProduct = null;
  }

  createProduct() {
    if (this.createProductForm.invalid) {
      this.createProductForm.markAllAsTouched();
      return;
    }

    const name = this.createProductForm.get('name')?.value.trim();
    const category = this.createProductForm.get('category')?.value;
    const minStock = Number(this.createProductForm.get('minStock')?.value);

    // Duplicate check
    if (this.products.some(p => p.name.toUpperCase() === name.toUpperCase())) {
      this.notificationService.show('Product Name already exists.', 'error', 3000);
      return;
    }

    const nextId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
    const newProduct: Product = {
      id: nextId,
      name: name,
      category: category,
      minStock: minStock,
      is_active: 1
    };

    this.products.unshift(newProduct);
    this.refreshFilteredData();
    this.notificationService.show('Product created successfully.', 'success', 3000);
    this.closeModal();
  }

  updateProduct() {
    if (this.updateProductForm.invalid) {
      this.updateProductForm.markAllAsTouched();
      return;
    }

    const name = this.updateProductForm.get('name')?.value.trim();
    const category = this.updateProductForm.get('category')?.value;
    const minStock = Number(this.updateProductForm.get('minStock')?.value);

    if (this.selectedProduct) {
      // Duplicate check (excluding self)
      const duplicate = this.products.some(p =>
        p.name.toUpperCase() === name.toUpperCase() && p.id !== this.selectedProduct?.id
      );

      if (duplicate) {
        this.notificationService.show('Product Name already exists.', 'error', 3000);
        return;
      }

      this.selectedProduct.name = name;
      this.selectedProduct.category = category;
      this.selectedProduct.minStock = minStock;

      this.refreshFilteredData();
      this.notificationService.show('Product updated successfully.', 'success', 3000);
      this.closeModal();
    }
  }
}
