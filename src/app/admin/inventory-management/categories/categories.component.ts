import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

interface Category {
  id: number;
  categoryName: string;
  is_active: number;
}

interface SubCategory {
  id: number;
  name: string;
  categoryId: number;
  is_active: number;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgxPaginationModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
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
export class CategoriesComponent implements OnInit {
  activeTab: 'Categories' | 'Sub Categories' = 'Categories';
  
  // Search parameters
  searchbarform!: FormGroup;
  showreset = false;

  // Pagination parameters
  page = 1;
  tableSize: any = 10;
  tableSizes: any = [10, 25, 50, 100, 'all'];
  totalRecords = 0;

  // Categories Datasets
  categories: Category[] = [
    { id: 1, categoryName: 'PUMP HOUSE', is_active: 1 },
    { id: 2, categoryName: 'IRP', is_active: 1 },
    { id: 3, categoryName: 'PUMP HOUSE+IRP', is_active: 1 },
    { id: 4, categoryName: 'JCB', is_active: 1 },
    { id: 5, categoryName: 'MISC', is_active: 1 },
    { id: 6, categoryName: 'RMC/ROAD WORK', is_active: 1 },
    { id: 7, categoryName: 'CIVIL WORK', is_active: 1 },
    { id: 8, categoryName: 'COMBINE', is_active: 1 },
    { id: 9, categoryName: 'ROAD WORK', is_active: 1 }
  ];
  filteredCategories: Category[] = [];

  // Sub Categories Datasets
  subCategories: SubCategory[] = [
    { id: 1, name: 'DI PIPE AND FITTINGS', categoryId: 1, is_active: 1 },
    { id: 2, name: 'PVC PIPE AND FITTINGS', categoryId: 1, is_active: 1 },
    { id: 3, name: 'GI PIPE AND FITTINGS', categoryId: 1, is_active: 1 },
    { id: 4, name: 'SUBMERSIBLE MOTOR PUMP', categoryId: 1, is_active: 1 },
    { id: 5, name: 'ELECTRICAL FITTINGS-PH', categoryId: 1, is_active: 1 },
    { id: 6, name: 'TRANCHER MATERIALS', categoryId: 1, is_active: 1 },
    { id: 7, name: 'FAN BELT', categoryId: 1, is_active: 1 },
    { id: 8, name: 'MEASUREMENT', categoryId: 1, is_active: 1 },
    { id: 9, name: 'HDPE PIPE AND FITTINGS', categoryId: 1, is_active: 1 },
    { id: 10, name: 'AIR BLOWER', categoryId: 2, is_active: 1 }
  ];
  filteredSubCategories: SubCategory[] = [];

  // Modals state management
  createCategoryOpen = false;
  updateCategoryOpen = false;
  viewCategoryOpen = false;

  createSubCategoryOpen = false;
  updateSubCategoryOpen = false;
  viewSubCategoryOpen = false;

  // Reactives Form Groups
  createCategoryForm!: FormGroup;
  updateCategoryForm!: FormGroup;
  viewCategoryForm!: FormGroup;

  createSubCategoryForm!: FormGroup;
  updateSubCategoryForm!: FormGroup;
  viewSubCategoryForm!: FormGroup;

  // Trackers
  selectedCategory: Category | null = null;
  selectedSubCategory: SubCategory | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.initSearchForm();
    this.initForms();
    this.refreshFilteredData();
  }

  // Active Tab Toggling
  setActiveTab(tab: 'Categories' | 'Sub Categories') {
    this.activeTab = tab;
    this.page = 1;
    this.searchbarform.reset({ searchbar: '' });
    this.showreset = false;
    this.refreshFilteredData();
  }

  // Search logic init
  initSearchForm() {
    this.searchbarform = this.formBuilder.group({
      searchbar: ['']
    });

    // Realtime search query value changes subscription
    this.searchbarform.get('searchbar')?.valueChanges.subscribe(val => {
      this.showreset = !!val;
      this.searchfun();
    });
  }

  initForms() {
    // Categories Forms
    this.createCategoryForm = this.formBuilder.group({
      categoryName: ['', Validators.required]
    });
    this.updateCategoryForm = this.formBuilder.group({
      categoryName: ['', Validators.required]
    });
    this.viewCategoryForm = this.formBuilder.group({
      categoryName: [''],
      status: ['']
    });

    // Sub Categories Forms
    this.createSubCategoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
    this.updateSubCategoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
    this.viewSubCategoryForm = this.formBuilder.group({
      name: [''],
      categoryId: [''],
      status: ['']
    });
  }

  refreshFilteredData() {
    if (this.activeTab === 'Categories') {
      this.filteredCategories = [...this.categories];
      this.totalRecords = this.filteredCategories.length;
    } else {
      this.filteredSubCategories = [...this.subCategories];
      this.totalRecords = this.filteredSubCategories.length;
    }
  }

  // Filtering lists dynamically
  searchfun() {
    const query = this.searchbarform.get('searchbar')?.value?.trim().toLowerCase();
    if (!query) {
      this.refreshFilteredData();
      return;
    }

    if (this.activeTab === 'Categories') {
      this.filteredCategories = this.categories.filter(c => 
        c.categoryName.toLowerCase().includes(query)
      );
      this.totalRecords = this.filteredCategories.length;
    } else {
      this.filteredSubCategories = this.subCategories.filter(sc => 
        sc.name.toLowerCase().includes(query) ||
        this.getCategoryName(sc.categoryId).toLowerCase().includes(query)
      );
      this.totalRecords = this.filteredSubCategories.length;
    }
    this.page = 1;
  }

  resetsearchbar() {
    this.searchbarform.patchValue({ searchbar: '' });
    this.showreset = false;
    this.refreshFilteredData();
  }

  // Slices table data based on current page and table size limits
  getPaginatedCategories(): Category[] {
    const start = (this.page - 1) * this.tableSize;
    return this.filteredCategories.slice(start, start + this.tableSize);
  }

  getPaginatedSubCategories(): SubCategory[] {
    const start = (this.page - 1) * this.tableSize;
    return this.filteredSubCategories.slice(start, start + this.tableSize);
  }

  // Sizing changes
  onTableSizeChange(event: any) {
    this.tableSize = event.target.value;
    this.page = 1;
  }

  onTableDataChange(pageNumber: number) {
    this.page = pageNumber;
  }

  getCategoryName(categoryId?: number | null): string {
    if (categoryId === undefined || categoryId === null) return '—';
    const cat = this.categories.find(c => c.id === Number(categoryId));
    return cat ? cat.categoryName : '—';
  }

  // Status triggers
  toggleCategoryStatus(cat: Category) {
    cat.is_active = cat.is_active === 1 ? 0 : 1;
    this.notificationService.show(
      `Category status changed to ${cat.is_active === 1 ? 'Active' : 'Inactive'} successfully.`,
      'success',
      3000
    );
  }

  toggleSubCategoryStatus(sub: SubCategory) {
    sub.is_active = sub.is_active === 1 ? 0 : 1;
    this.notificationService.show(
      `Sub Category status changed to ${sub.is_active === 1 ? 'Active' : 'Inactive'} successfully.`,
      'success',
      3000
    );
  }

  // Categories Modals triggers
  openAddCategoryModal() {
    this.createCategoryForm.reset({ categoryName: '' });
    this.createCategoryOpen = true;
  }

  openEditCategoryModal(cat: Category) {
    this.selectedCategory = cat;
    this.updateCategoryForm.patchValue({
      categoryName: cat.categoryName
    });
    this.updateCategoryOpen = true;
  }

  openViewCategoryModal(cat: Category) {
    this.selectedCategory = cat;
    this.viewCategoryForm.patchValue({
      categoryName: cat.categoryName,
      status: cat.is_active === 1 ? 'Active' : 'Inactive'
    });
    this.viewCategoryOpen = true;
  }

  closeModal() {
    this.createCategoryOpen = false;
    this.updateCategoryOpen = false;
    this.viewCategoryOpen = false;

    this.createSubCategoryOpen = false;
    this.updateSubCategoryOpen = false;
    this.viewSubCategoryOpen = false;

    this.selectedCategory = null;
    this.selectedSubCategory = null;
  }

  // Categories Transactions
  createCategory() {
    if (this.createCategoryForm.invalid) {
      this.createCategoryForm.markAllAsTouched();
      return;
    }
    const name = this.createCategoryForm.get('categoryName')?.value.trim();
    
    // Duplicate check
    if (this.categories.some(c => c.categoryName.toUpperCase() === name.toUpperCase())) {
      this.notificationService.show('Category Name already exists.', 'error', 3000);
      return;
    }

    const nextId = this.categories.length > 0 ? Math.max(...this.categories.map(c => c.id)) + 1 : 1;
    const newCat: Category = {
      id: nextId,
      categoryName: name,
      is_active: 1
    };

    this.categories.push(newCat);
    this.refreshFilteredData();
    this.notificationService.show('Category created successfully.', 'success', 3000);
    this.closeModal();
  }

  updateCategory() {
    if (this.updateCategoryForm.invalid) {
      this.updateCategoryForm.markAllAsTouched();
      return;
    }
    const name = this.updateCategoryForm.get('categoryName')?.value.trim();

    if (this.selectedCategory) {
      // Duplicate check (excluding self)
      const duplicate = this.categories.some(c => 
        c.categoryName.toUpperCase() === name.toUpperCase() && c.id !== this.selectedCategory?.id
      );
      if (duplicate) {
        this.notificationService.show('Category Name already exists.', 'error', 3000);
        return;
      }

      this.selectedCategory.categoryName = name;
      this.refreshFilteredData();
      this.notificationService.show('Category updated successfully.', 'success', 3000);
      this.closeModal();
    }
  }

  // Sub Categories Modals triggers
  openAddSubCategoryModal() {
    this.createSubCategoryForm.reset({
      name: '',
      categoryId: ''
    });
    this.createSubCategoryOpen = true;
  }

  openEditSubCategoryModal(sub: SubCategory) {
    this.selectedSubCategory = sub;
    this.updateSubCategoryForm.patchValue({
      name: sub.name,
      categoryId: sub.categoryId
    });
    this.updateSubCategoryOpen = true;
  }

  openViewSubCategoryModal(sub: SubCategory) {
    this.selectedSubCategory = sub;
    this.viewSubCategoryForm.patchValue({
      name: sub.name,
      categoryId: this.getCategoryName(sub.categoryId),
      status: sub.is_active === 1 ? 'Active' : 'Inactive'
    });
    this.viewSubCategoryOpen = true;
  }

  // Sub Categories Transactions
  createSubCategory() {
    if (this.createSubCategoryForm.invalid) {
      this.createSubCategoryForm.markAllAsTouched();
      return;
    }
    const name = this.createSubCategoryForm.get('name')?.value.trim();
    const categoryId = Number(this.createSubCategoryForm.get('categoryId')?.value);

    // Duplicate check
    if (this.subCategories.some(sc => sc.name.toUpperCase() === name.toUpperCase())) {
      this.notificationService.show('Sub Category Name already exists.', 'error', 3000);
      return;
    }

    const nextId = this.subCategories.length > 0 ? Math.max(...this.subCategories.map(sc => sc.id)) + 1 : 1;
    const newSub: SubCategory = {
      id: nextId,
      name: name,
      categoryId: categoryId,
      is_active: 1
    };

    this.subCategories.push(newSub);
    this.refreshFilteredData();
    this.notificationService.show('Sub Category created successfully.', 'success', 3000);
    this.closeModal();
  }

  updateSubCategory() {
    if (this.updateSubCategoryForm.invalid) {
      this.updateSubCategoryForm.markAllAsTouched();
      return;
    }
    const name = this.updateSubCategoryForm.get('name')?.value.trim();
    const categoryId = Number(this.updateSubCategoryForm.get('categoryId')?.value);

    if (this.selectedSubCategory) {
      // Duplicate check (excluding self)
      const duplicate = this.subCategories.some(sc => 
        sc.name.toUpperCase() === name.toUpperCase() && sc.id !== this.selectedSubCategory?.id
      );
      if (duplicate) {
        this.notificationService.show('Sub Category Name already exists.', 'error', 3000);
        return;
      }

      this.selectedSubCategory.name = name;
      this.selectedSubCategory.categoryId = categoryId;
      this.refreshFilteredData();
      this.notificationService.show('Sub Category updated successfully.', 'success', 3000);
      this.closeModal();
    }
  }
}
