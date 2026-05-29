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
  selector: 'app-employee-management',
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
  templateUrl: './employee-management.component.html',
  styleUrl: './employee-management.component.scss',
  animations: [
    trigger('fadeIn', [
      state(
        'void',
        style({
          opacity: 0,
          transform: 'scale(0.95)',
        }),
      ),
      transition(':enter', [
        animate(
          '0.3s ease-out',
          style({
            opacity: 1,
            transform: 'scale(1)',
          }),
        ),
      ]),
      transition(':leave', [
        animate(
          '0.2s ease-in',
          style({
            opacity: 0,
            transform: 'scale(0.95)',
          }),
        ),
      ]),
    ]),
  ],
})
export class EmployeeManagementComponent implements OnInit {
  showreset: boolean = false;
  searchbarform!: FormGroup;
  filterForm!: FormGroup;
  
  employeeForm!: FormGroup;
  
  tableSize: any = 10;
  tableSizes: any = [10, 20, 50, 100, 'all'];
  totalRecords: any;
  page: number = 1;
  
  employeeModalOpen: boolean = false;
  isEditMode: boolean = false;
  viewEmployeeOpen: boolean = false;
  currentEmployeeId: any;
  selectedEmployee: any = null;
  
  activeTab: 'personal' | 'employment' | 'payroll' = 'personal';
  
  employeeList: any[] = [];
  
  table_heading = [
    {
      heading0: 'Emp ID',
      heading1: 'Name',
      heading2: 'Contact',
      heading3: 'Site',
      heading4: 'Department',
      heading5: 'Designation',
      heading6: 'Status',
      heading7: 'Action',
    },
  ];

  mockSites = ['East Mine', 'West Mine', 'North Sector'];
  mockDepartments = ['Mining', 'Security', 'Maintenance', 'HR'];
  mockDesignations = ['Worker', 'Supervisor', 'Engineer', 'Manager'];
  mockSupervisors = ['Suresh Singh', 'Ravi Verma', 'Self'];

  mockEmployees: any[] = [
    { 
      id: '1', 
      empId: 'EMP-001', 
      name: 'Ramesh Kumar', 
      fatherName: 'Lal Bahadur', 
      dob: '1990-05-15', 
      gender: 'Male',
      mobile: '9876543210', 
      address: '123 Mine Road, Dhanbad',
      emergencyContact: '9876543211', 
      joiningDate: '2020-01-15',
      empType: 'Permanent', 
      department: 'Mining', 
      site: 'East Mine', 
      designation: 'Worker', 
      supervisor: 'Suresh Singh', 
      salaryType: 'Monthly', 
      basicSalary: 15000, 
      isPfApplicable: 'Yes', 
      pfNumber: 'PF123456789', 
      bankName: 'State Bank of India',
      accountNumber: '1234567890',
      ifscCode: 'SBIN0001234',
      isMessApplicable: 'Yes',
      is_active: 1 
    },
    { 
      id: '2', 
      empId: 'EMP-002', 
      name: 'Suresh Singh', 
      fatherName: 'Ram Singh',
      dob: '1985-08-22', 
      gender: 'Male',
      mobile: '8765432109', 
      address: '456 West Area, Dhanbad',
      emergencyContact: '8765432100', 
      joiningDate: '2018-05-10',
      empType: 'Permanent', 
      department: 'Mining', 
      site: 'East Mine', 
      designation: 'Supervisor', 
      supervisor: 'Ravi Verma', 
      salaryType: 'Monthly', 
      basicSalary: 25000, 
      isPfApplicable: 'Yes', 
      pfNumber: 'PF987654321', 
      bankName: 'HDFC Bank',
      accountNumber: '0987654321',
      ifscCode: 'HDFC0004321',
      isMessApplicable: 'No',
      is_active: 1 
    },
    { 
      id: '3', 
      empId: 'EMP-003', 
      name: 'Anita Sharma', 
      fatherName: 'K. P. Sharma',
      dob: '1992-11-10', 
      gender: 'Female',
      mobile: '7654321098', 
      address: '789 North Colony, Ranchi',
      emergencyContact: '7654321099', 
      joiningDate: '2021-10-01',
      empType: 'Daily Wage', 
      department: 'HR', 
      site: 'North Sector', 
      designation: 'Manager', 
      supervisor: 'Self', 
      salaryType: 'Monthly', 
      basicSalary: 45000, 
      isPfApplicable: 'No', 
      pfNumber: '', 
      bankName: 'ICICI Bank',
      accountNumber: '1122334455',
      ifscCode: 'ICIC0001122', 
      isMessApplicable: 'No',
      is_active: 1 
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.searchbarform = this.formBuilder.group({
      searchbar: ['', [Validators.required]],
    });

    this.filterForm = this.formBuilder.group({
      siteFilter: [''],
      deptFilter: [''],
    });

    this.initEmployeeForm();
    this.GetEmployeeFun();
  }

  initEmployeeForm() {
    this.employeeForm = this.formBuilder.group({
      // Personal
      empId: [{ value: '', disabled: true }],
      name: ['', [Validators.required]],
      fatherName: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      address: ['', [Validators.required]],
      emergencyContact: ['', [Validators.pattern('^[0-9]{10}$')]],
      
      // Employment
      joiningDate: ['', [Validators.required]],
      empType: ['', [Validators.required]],
      department: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      site: ['', [Validators.required]],
      supervisor: [''],
      
      // Payroll
      salaryType: ['', [Validators.required]],
      basicSalary: ['', [Validators.required, Validators.min(0)]],
      isPfApplicable: ['No', [Validators.required]],
      pfNumber: [''],
      bankName: ['', [Validators.required]],
      accountNumber: ['', [Validators.required]],
      ifscCode: ['', [Validators.required]],
      isMessApplicable: ['No', [Validators.required]],
    });

    // Dynamic validator for PF Number based on PF Applicability
    this.employeeForm.get('isPfApplicable')?.valueChanges.subscribe(val => {
      const pfNumCtrl = this.employeeForm.get('pfNumber');
      if (val === 'Yes') {
        pfNumCtrl?.setValidators([Validators.required]);
      } else {
        pfNumCtrl?.clearValidators();
        pfNumCtrl?.setValue('');
      }
      pfNumCtrl?.updateValueAndValidity();
    });
  }

  setTab(tab: 'personal' | 'employment' | 'payroll') {
    this.activeTab = tab;
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.GetEmployeeFun();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.GetEmployeeFun();
  }

  searchfun() {
    if (this.searchbarform.valid || this.filterForm.value.siteFilter || this.filterForm.value.deptFilter) {
      this.showreset = true;
      this.GetEmployeeFun();
    } else {
      this.searchbarform.markAllAsTouched();
    }
  }

  resetsearchbar() {
    this.searchbarform.reset();
    this.filterForm.reset();
    this.showreset = false;
    this.page = 1;
    this.GetEmployeeFun();
  }

  openAddModal() {
    this.isEditMode = false;
    this.employeeForm.reset({ isPfApplicable: 'No', isMessApplicable: 'No' });
    this.activeTab = 'personal';
    this.employeeModalOpen = true;
  }

  closeModal() {
    this.employeeModalOpen = false;
    this.viewEmployeeOpen = false;
    this.selectedEmployee = null;
  }

  openviewModal(employee: any): void {
    this.viewEmployeeOpen = true;
    this.selectedEmployee = employee;
  }

  openEditModal(employee: any): void {
    this.isEditMode = true;
    this.currentEmployeeId = employee.id;
    this.employeeForm.patchValue(employee);
    this.activeTab = 'personal';
    this.employeeModalOpen = true;
  }

  saveEmployee() {
    if (this.employeeForm.valid) {
      const empData = this.employeeForm.getRawValue();
      
      if (this.isEditMode) {
        const index = this.mockEmployees.findIndex((d) => d.id === this.currentEmployeeId);
        if (index !== -1) {
          this.mockEmployees[index] = { ...this.mockEmployees[index], ...empData };
          this.notificationService.show('Employee updated successfully', 'success', 3000);
        }
      } else {
        const newId = (this.mockEmployees.length + 1).toString();
        const autoEmpId = 'EMP-' + Math.floor(1000 + Math.random() * 9000); // Mocking backend generation
        this.mockEmployees.unshift({ id: newId, empId: autoEmpId, ...empData, is_active: 1 });
        this.notificationService.show('Employee added successfully', 'success', 3000);
      }
      
      this.closeModal();
      this.GetEmployeeFun();
    } else {
      this.employeeForm.markAllAsTouched();
      // Switch to first invalid tab
      const personalControls = ['name', 'fatherName', 'dob', 'gender', 'mobile', 'address'];
      const employmentControls = ['joiningDate', 'empType', 'department', 'designation', 'site'];
      
      const isPersonalInvalid = personalControls.some(ctrl => this.employeeForm.get(ctrl)?.invalid);
      const isEmploymentInvalid = employmentControls.some(ctrl => this.employeeForm.get(ctrl)?.invalid);

      if (isPersonalInvalid) {
        this.activeTab = 'personal';
      } else if (isEmploymentInvalid) {
        this.activeTab = 'employment';
      } else {
        this.activeTab = 'payroll';
      }
      this.notificationService.show('Please fill all required fields correctly.', 'error', 3000);
    }
  }

  GetEmployeeFun() {
    const searchText = this.searchbarform.get('searchbar')?.value?.toLowerCase();
    const siteFilter = this.filterForm.get('siteFilter')?.value;
    const deptFilter = this.filterForm.get('deptFilter')?.value;

    let filteredData = this.mockEmployees;

    if (searchText) {
      filteredData = filteredData.filter((d) =>
        d.name.toLowerCase().includes(searchText) || 
        d.empId.toLowerCase().includes(searchText) ||
        d.mobile.includes(searchText)
      );
    }

    if (siteFilter) {
      filteredData = filteredData.filter((d) => d.site === siteFilter);
    }

    if (deptFilter) {
      filteredData = filteredData.filter((d) => d.department === deptFilter);
    }

    this.totalRecords = filteredData.length;

    if (this.tableSize === 'all') {
      this.employeeList = filteredData;
    } else {
      const startIndex = (this.page - 1) * this.tableSize;
      const endIndex = startIndex + this.tableSize;
      this.employeeList = filteredData.slice(startIndex, endIndex);
    }
  }

  async Status(id: string, status: any) {
    const index = this.mockEmployees.findIndex((d) => d.id === id);
    if (index !== -1) {
      this.mockEmployees[index].is_active = status;
      this.notificationService.show(
        `Employee ${status ? 'activated' : 'deactivated'} successfully`,
        'success',
        2000,
      );
      this.GetEmployeeFun();
    }
  }
}
