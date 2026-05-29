import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { EmployeeService } from 'src/app/core/services/Employee.service';
import { JwtService } from 'src/app/core/services/jwt.service';
import { NotificationService } from 'src/app/core/services/notificationnew.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { NgxPaginationModule } from 'ngx-pagination';

interface Staff {
  id: any;
  name: string;
  email: string;
  mobile: string;
  address?: string;
  dob?: string;
  emergency_contact?: string;
  joining_date?: string;
  branches: string[];
  department: string;
  designation: string;
  is_active: any;
  image?: string;
}

@Component({
  selector: 'app-staff',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    NgxPaginationModule,
    RouterModule,
  ],
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.scss'],
  animations: [
    trigger('succesfullyMessage', [
      state(
        'void',
        style({
          transform: 'translateX(-30%)',
          opacity: 0,
        }),
      ),
      transition(':enter, :leave', [
        animate('0.8s cubic-bezier(0.68, -0.55, 0.27, 1.55)'),
      ]),
    ]),
    trigger('slideIn', [
      state(
        'void',
        style({
          transform: 'translateX(100%)',
          opacity: 0,
        }),
      ),
      transition(':enter', [
        animate(
          '0.5s ease-out',
          style({
            transform: 'translateX(0)',
            opacity: 1,
          }),
        ),
      ]),
    ]),
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
export class StaffComponent implements OnInit {
  showreset: any = false;
  searchText: any;
  tableSize: any = 10;
  tableSizes: any = [10, 20, 50, 100, 'all'];
  totalRecords: any;
  page: number = 1;
  searchbarform!: FormGroup;
  staffcreate!: FormGroup;
  staffupdate!: FormGroup;
  staffview!: FormGroup;
  staffcreateopen: boolean = false;
  staffviewopen: boolean = false;
  staffupdateopen: boolean = false;

  // Upload modal state
  uploadModalOpen: boolean = false;
  uploadForm!: FormGroup;
  selectedUploadFile: File | null = null;
  selectedUploadFileName: string = '';

  // Mock Data
  branchesList = ['Jaipur', 'Delhi', 'Mumbai', 'Ahmedabad', 'Pune'];
  designationsList = ['Manager', 'Supervisor', 'Clerk', 'Driver', 'Loader'];

  mockStaffData: Staff[] = [
    {
      id: 1,
      name: 'Rahul Sharma',
      email: 'rahul@chandracargo.com',
      mobile: '9876543210',
      address: 'Jaipur, Rajasthan',
      dob: '1995-05-15',
      emergency_contact: '9988776655',
      joining_date: '2023-01-10',
      branches: ['Jaipur'],
      department: 'Operations',
      designation: 'Manager',
      is_active: 1,
    },
    {
      id: 2,
      name: 'Amit Kumar',
      email: 'amit@chandracargo.com',
      mobile: '8877665544',
      address: 'Delhi, India',
      dob: '1992-08-20',
      emergency_contact: '7766554433',
      joining_date: '2023-02-15',
      branches: ['Delhi', 'Jaipur'],
      department: 'Logistics',
      designation: 'Supervisor',
      is_active: 1,
    },
    {
      id: 3,
      name: 'Priya Singh',
      email: 'priya@chandracargo.com',
      mobile: '7766554499',
      address: 'Mumbai, Maharashtra',
      dob: '1994-03-12',
      emergency_contact: '9988112233',
      joining_date: '2023-03-01',
      branches: ['Mumbai'],
      department: 'Accounts',
      designation: 'Clerk',
      is_active: 1,
    },
    {
      id: 4,
      name: 'Suresh Patel',
      email: 'suresh@chandracargo.com',
      mobile: '6655443322',
      address: 'Ahmedabad, Gujarat',
      dob: '1988-11-30',
      emergency_contact: '8877112233',
      joining_date: '2022-12-20',
      branches: ['Ahmedabad'],
      department: 'Operations',
      designation: 'Supervisor',
      is_active: 1,
    },
    {
      id: 5,
      name: 'Anjali Gupta',
      email: 'anjali@chandracargo.com',
      mobile: '9911223344',
      address: 'Pune, Maharashtra',
      dob: '1996-07-25',
      emergency_contact: '7711223344',
      joining_date: '2023-05-10',
      branches: ['Pune'],
      department: 'HR',
      designation: 'Manager',
      is_active: 1,
    },
    {
      id: 6,
      name: 'Vikram Singh',
      email: 'vikram@chandracargo.com',
      mobile: '8811223344',
      address: 'Jaipur, Rajasthan',
      dob: '1990-01-05',
      emergency_contact: '6611223344',
      joining_date: '2023-01-20',
      branches: ['Jaipur'],
      department: 'Logistics',
      designation: 'Driver',
      is_active: 1,
    },
    {
      id: 7,
      name: 'Neha Verma',
      email: 'neha@chandracargo.com',
      mobile: '7711223344',
      address: 'Delhi, India',
      dob: '1993-09-18',
      emergency_contact: '5511223344',
      joining_date: '2023-04-15',
      branches: ['Delhi'],
      department: 'Accounts',
      designation: 'Manager',
      is_active: 1,
    },
    {
      id: 8,
      name: 'Deepak Raj',
      email: 'deepak@chandracargo.com',
      mobile: '6611223344',
      address: 'Mumbai, Maharashtra',
      dob: '1991-06-14',
      emergency_contact: '4411223344',
      joining_date: '2023-02-10',
      branches: ['Mumbai'],
      department: 'Operations',
      designation: 'Loader',
      is_active: 1,
    },
    {
      id: 9,
      name: 'Sneha Kapur',
      email: 'sneha@chandracargo.com',
      mobile: '5511223344',
      address: 'Ahmedabad, Gujarat',
      dob: '1995-12-22',
      emergency_contact: '3311223344',
      joining_date: '2023-06-01',
      branches: ['Ahmedabad'],
      department: 'HR',
      designation: 'Supervisor',
      is_active: 1,
    },
    {
      id: 10,
      name: 'Rohan Mehra',
      email: 'rohan@chandracargo.com',
      mobile: '4411223344',
      address: 'Pune, Maharashtra',
      dob: '1992-04-30',
      emergency_contact: '2211223344',
      joining_date: '2023-03-15',
      branches: ['Pune'],
      department: 'Logistics',
      designation: 'Clerk',
      is_active: 1,
    },
    {
      id: 11,
      name: 'Karan Johar',
      email: 'karan@chandracargo.com',
      mobile: '3311223344',
      address: 'Jaipur, Rajasthan',
      dob: '1989-08-10',
      emergency_contact: '1111223344',
      joining_date: '2022-11-01',
      branches: ['Jaipur'],
      department: 'Operations',
      designation: 'Manager',
      is_active: 1,
    },
    {
      id: 12,
      name: 'Pooja Hegde',
      email: 'pooja@chandracargo.com',
      mobile: '2211223344',
      address: 'Delhi, India',
      dob: '1994-10-05',
      emergency_contact: '9900112233',
      joining_date: '2023-07-01',
      branches: ['Delhi'],
      department: 'Accounts',
      designation: 'Supervisor',
      is_active: 1,
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private employeeService: EmployeeService,
    private jwtService: JwtService,
    private notificationService: NotificationService,
    private router: Router,
  ) {}

  user_id: any;
  ngOnInit(): void {
    this.user_id = this.jwtService.getpanelUserId();
    this.searchbarform = this.formBuilder.group({
      searchbar: ['', [Validators.required]],
    });
    this.staffcreate = this.formBuilder.group({
      image: [''],
      name: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]],
      address: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      emergency_contact: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      joining_date: ['', [Validators.required]],
      branches: [[], [Validators.required]],
      department: ['', [Validators.required]],
      designation: ['', [Validators.required]],
    });
    this.staffupdate = this.formBuilder.group({
      image: [''],
      name: ['', [Validators.required]],
      mobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]],
      address: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      emergency_contact: [
        '',
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      joining_date: ['', [Validators.required]],
      branches: [[], [Validators.required]],
      department: ['', [Validators.required]],
      designation: ['', [Validators.required]],
    });
    this.staffview = this.formBuilder.group({
      image: [''],
      name: [''],
      mobile: [''],
      email: [''],
      address: [''],
      dob: [''],
      emergency_contact: [''],
      joining_date: [''],
      branches: [[]],
      department: [''],
      designation: [''],
    });
    this.uploadForm = this.formBuilder.group({
      file: ['', Validators.required],
    });

    this.GetStaff();
    this.GetDepartment();
  }

  staffTable: Staff[] = [];
  GetStaff() {
    // Mock Logic with Filtering and Searching
    let filteredData = [...this.mockStaffData];

    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      filteredData = filteredData.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.mobile.includes(search) ||
          s.email.toLowerCase().includes(search),
      );
    }

    if (this.selectedDepartment) {
      filteredData = filteredData.filter(
        (s) => s.department === this.selectedDepartment,
      );
    }

    if (this.selectedBranch) {
      filteredData = filteredData.filter((s) =>
        s.branches.includes(this.selectedBranch as string),
      );
    }

    this.staffTable = filteredData;
    this.totalRecords = filteredData.length;
  }
  GetStaffByDepartment() {
    this.GetStaff();
  }
  departmentTable: any;
  rolesList: any;
  GetDepartment() {
    this.departmentTable = [
      { id: 'Operations', name: 'Operations' },
      { id: 'Logistics', name: 'Logistics' },
      { id: 'Accounts', name: 'Accounts' },
      { id: 'HR', name: 'HR' },
    ];
  }
  selectedDepartment: string | undefined;
  onDepartmentFilterChange(event: any): void {
    this.selectedDepartment = event.target.value || undefined;
    if (this.selectedDepartment === 'all') this.selectedDepartment = undefined;
    this.page = 1;
    this.GetStaffByDepartment();
  }

  selectedBranch: string | undefined;
  onBranchFilterChange(event: any): void {
    this.selectedBranch = event.target.value || undefined;
    if (this.selectedBranch === 'all') this.selectedBranch = undefined;
    this.page = 1;
    this.GetStaff();
  }

  onDepartmentChange(event: Event) {
    const selectedStateId = (event.target as HTMLSelectElement).value;

    if (selectedStateId) {
      console.log('Selected State ID:', selectedStateId);
      this.getRoles(selectedStateId);
      if (this.staffcreateopen) {
        this.staffcreate.get('designation')?.setValue(null);
      } else if (this.staffupdateopen) {
        this.staffupdate.get('designation')?.setValue(null);
      }
    } else {
      this.rolesList = [];
    }
  }
  getRoles(departmentId: any, selectedRoleId?: any) {
    // Mock role fetching based on department
    const mockRoles: any = {
      Operations: [
        { id: 'Manager', name: 'Operations Manager' },
        { id: 'Supervisor', name: 'Shift Supervisor' },
        { id: 'Loader', name: 'Loader' },
      ],
      Logistics: [
        { id: 'Manager', name: 'Logistics Manager' },
        { id: 'Supervisor', name: 'Warehouse Supervisor' },
        { id: 'Driver', name: 'Delivery Driver' },
      ],
      Accounts: [
        { id: 'Manager', name: 'Finance Manager' },
        { id: 'Clerk', name: 'Accountant' },
      ],
      HR: [
        { id: 'Manager', name: 'HR Manager' },
        { id: 'Supervisor', name: 'HR Coordinator' },
      ],
    };

    this.rolesList = mockRoles[departmentId] || [];

    if (selectedRoleId) {
      this.staffupdate.get('designation')?.setValue(selectedRoleId);
    } else {
      this.staffupdate.get('designation')?.setValue(null);
    }
    this.staffupdate.get('designation')?.markAsUntouched();

    /*
    this.employeeService.GetRoles(departmentId).subscribe((response: any) => {
      if (response.status === 200 || response.status === 201) {
        this.rolesList = response.data;
        // If a role should be prefilled, set it after roles are loaded
        if (selectedRoleId) {
          this.staffupdate.get('designation')?.setValue(selectedRoleId);
        } else {
          this.staffupdate.get('designation')?.setValue(null);
        }
        this.staffupdate.get('designation')?.markAsUntouched();
      }
    });
    */
  }

  table_heading = [
    {
      heading0: 'Sr No',
      heading1: 'Name',
      heading2: 'Email',
      heading3: 'Mobile',
      heading4: 'Department',
      heading5: 'Role',
      heading6: 'Status',
      heading7: 'Action',
    },
  ];

  statusfilter: any;
  onStatusChange(event: any) {
    const status = event.target.value;
    if (status === '') {
      this.statusfilter = undefined;
    } else if (status === '1') {
      this.statusfilter = '1';
    } else if (status === '0') {
      this.statusfilter = '0';
    }
    this.GetStaff();
  }

  searchfun() {
    if (this.searchbarform.valid) {
      this.showreset = true;
      this.searchText = this.searchbarform.get('searchbar')?.value;
      this.GetStaff();
    } else {
      this.searchbarform.markAllAsTouched();
    }
  }

  resetsearchbar() {
    window.location.reload();
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.GetStaff();
  }

  onTableDataChange(event: any) {
    this.page = event;
    this.GetStaff();
  }

  selectedFileNames: string[] = [];
  selectedFiles: any[] = [];
  selectedImages: { imageSrc: string | null; id: number }[] = [];
  fileSizeError: string = '';

  removeImage(index: number) {
    this.selectedImages.splice(index, 1);
    this.selectedFileNames.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  generateUniqueId(): number {
    return Math.floor(Math.random() * Date.now());
  }

  onSingleFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const fileType = file.type;
      const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSizeBytes = 5000000;
      const maxHeight = 700;

      if (!validImageTypes.includes(fileType)) {
        this.fileSizeError = 'Only PNG, JPEG, and JPG formats are allowed.';
        this.selectedImages = [];
        this.selectedFileNames = [];
        this.selectedFiles = [];
        return;
      }

      if (file.size > maxSizeBytes) {
        this.selectedImages = [];
        this.selectedFileNames = [];
        this.selectedFiles = [];
        this.fileSizeError =
          'The selected file exceeds the maximum allowed size (5MB).';
        return;
      }

      const reader = new FileReader();
      this.selectedFileNames = [file.name];
      this.selectedFiles = [file];

      reader.onload = () => {
        if (typeof reader.result === 'string' || reader.result === null) {
          const id = this.generateUniqueId();
          const imageSrc = reader.result as string;
          const image = new Image();
          image.src = imageSrc;

          image.onload = () => {
            if (image.height > maxHeight) {
              this.selectedImages = [];
              this.selectedFileNames = [];
              this.selectedFiles = [];
              this.fileSizeError =
                'The selected image dimensions exceed the maximum allowed size';
            } else {
              this.selectedImages = [{ imageSrc, id }];
              this.fileSizeError = '';
            }
          };
        }
      };

      reader.readAsDataURL(file);
    }
  }

  successName: any = '';
  openSecondsuccess: boolean = false;
  errorMessage: any;
  submitted!: boolean;

  // Createstaff() {
  //   if (this.staffcreate.valid) {
  //     const formData: FormData = new FormData();
  //     formData.append('name', this.staffcreate.get('name')?.value);
  //     formData.append('email', this.staffcreate.get('email')?.value);
  //     formData.append('mobile', this.staffcreate.get('mobile')?.value);
  //     formData.append(
  //       'department_id',
  //       this.staffcreate.get('department')?.value
  //     );
  //     formData.append('role_id', this.staffcreate.get('role')?.value);

  //     this.employeeService.createStaff(formData).subscribe((response: any) => {
  //       if (response.status === 200 || response.status === 201) {
  //         this.closeModal();
  //         this.successName = 'Employee Created';
  //         // this.ngOnInit();
  //         this.GetStaff();
  //         setTimeout(() => {
  //           this.openSecondsuccess = true;
  //           setTimeout(() => {
  //             this.openSecondsuccess = false;
  //           }, 1800);
  //         }, 200);
  //       } else {
  //         this.submitted = false;
  //         this.errorMessage = response.errors || response.message;
  //         alert(this.errorMessage);
  //       }
  //     });
  //   } else {
  //     this.submitted = false;
  //     this.errorMessage = 'Please enter all the details';
  //     this.staffcreate.markAllAsTouched();
  //     console.log(this.findInvalidControls(this.staffcreate));
  //   }
  // }
  Createstaff() {
    if (this.staffcreate.valid) {
      // Mock Logic
      const newStaff: Staff = {
        id: this.generateUniqueId(),
        ...this.staffcreate.value,
        is_active: 1,
      };
      this.mockStaffData.unshift(newStaff);
      this.GetStaff();
      this.closeModal();
      this.notificationService.show(
        'Employee Created Successfully (Mock)',
        'success',
      );
      this.successName = 'Employee Created';
      this.openSecondsuccess = true;
      setTimeout(() => {
        this.openSecondsuccess = false;
      }, 1800);

      // Commented out API Call
      /*
      const formData: FormData = new FormData();
      formData.append('name', this.staffcreate.get('name')?.value);
      formData.append('email', this.staffcreate.get('email')?.value);
      formData.append('mobile', this.staffcreate.get('mobile')?.value);
      formData.append(
        'department_id',
        this.staffcreate.get('department')?.value,
      );
      formData.append('role_id', this.staffcreate.get('role')?.value);

      this.employeeService.createStaff(formData).subscribe({
        next: (response: any) => {
          if (response.status === 200 || response.status === 201) {
            this.closeModal();
            this.successName = 'Employee Created';
            this.GetStaff();
            setTimeout(() => {
              this.openSecondsuccess = true;
              setTimeout(() => {
                this.openSecondsuccess = false;
              }, 1800);
            }, 200);
          } else {
            this.submitted = false;
            this.errorMessage = response.errors || response.message;
            alert(this.errorMessage);
          }
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.notificationService.show(this.errorMessage, 'error', 3000);
        },
      });
      */
    } else {
      this.submitted = false;
      this.errorMessage = 'Please enter all the details';
      this.staffcreate.markAllAsTouched();
      console.log(this.findInvalidControls(this.staffcreate));
    }
  }

  Updatestaff() {
    if (this.staffupdate.valid) {
      // Mock Logic
      const index = this.mockStaffData.findIndex((s) => s.id === this.staffId);
      if (index !== -1) {
        this.mockStaffData[index] = {
          ...this.mockStaffData[index],
          ...this.staffupdate.value,
        };
        this.GetStaff();
        this.closeModal();
        this.notificationService.show(
          'Staff Updated Successfully (Mock)',
          'success',
        );
        this.successName = 'Staff Updated';
        this.openSecondsuccess = true;
        setTimeout(() => {
          this.openSecondsuccess = false;
        }, 1800);
      }

      // Commented out API Call
      /*
      const formData: FormData = new FormData();
      formData.append('name', this.staffupdate.get('name')?.value);
      formData.append('email', this.staffupdate.get('email')?.value);
      formData.append('mobile', this.staffupdate.get('mobile')?.value);
      formData.append(
        'department_id',
        this.staffupdate.get('department')?.value,
      );
      formData.append('role_id', this.staffupdate.get('role')?.value);
      formData.append('_method', 'put');

      this.employeeService.updateStaff(formData, this.staffId).subscribe({
        next: (response: any) => {
          if (response.status === 200 || response.status === 201) {
            this.closeModal();
            this.successName = 'Staff Updated';
            this.ngOnInit();
            setTimeout(() => {
              this.openSecondsuccess = true;
              setTimeout(() => {
                this.openSecondsuccess = false;
              }, 1800);
            }, 200);
          } else {
            this.submitted = false;
            this.errorMessage = response.errors || response.message;
            this.notificationService.show(this.errorMessage, 'error', 3000);
          }
        },
        error: (error) => {
          this.errorMessage = error.message;
          this.notificationService.show(this.errorMessage, 'error', 3000);
        },
      });
      */
    } else {
      this.submitted = false;
      this.errorMessage = 'Please enter all the details';
      this.staffupdate.markAllAsTouched();
    }
  }

  findInvalidControls(formName: any) {
    const invalid = [];
    const controls = formName.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    console.log(invalid);
    return invalid;
  }

  staffId: any;
  async OpenEditModal(staff: any) {
    this.staffupdateopen = true;
    this.staffId = staff.id;
    this.staffupdate.patchValue({
      name: staff.name,
      mobile: staff.mobile,
      email: staff.email,
      address: staff.address,
      dob: staff.dob,
      emergency_contact: staff.emergency_contact,
      joining_date: staff.joining_date,
      branches: staff.branches,
      department: staff.department,
      designation: staff.designation,
      image: staff.image,
    });
    if (staff.image) {
      this.selectedImages = [
        { imageSrc: staff.image, id: this.generateUniqueId() },
      ];
    } else {
      this.selectedImages = [];
    }
  }

  async OpenviewModal(staff: any) {
    this.staffviewopen = true;
    this.staffId = staff.id;
    this.staffview.patchValue({
      name: staff.name,
      mobile: staff.mobile,
      email: staff.email,
      address: staff.address,
      dob: staff.dob,
      emergency_contact: staff.emergency_contact,
      joining_date: staff.joining_date,
      branches: staff.branches,
      department: staff.department,
      designation: staff.designation,
      image: staff.image,
    });
  }

  async fillUpdateForm(response: any) {
    this.staffupdate = this.formBuilder.group({
      image: [response.image, [Validators.required]],
      name: [response.name, [Validators.required]],
      email: [response.email, [Validators.required, Validators.email]],
      mobile: [
        response.mobile,
        [Validators.required, Validators.pattern('^[0-9]{10}$')],
      ],
      department: [response.department.id, [Validators.required]],
      role: [response.role.id, [Validators.required]],
    });

    // const file = await this.createFile(response.image);
    // if (file) {
    //   const maxSizeBytes = 5000000;
    //   const maxHeight = 700;
    //   const fileType = file.type;
    //   const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    //   if (!validImageTypes.includes(fileType)) {
    //     this.fileSizeError = 'Only PNG, JPEG, and JPG formats are allowed.';
    //     this.selectedImages = [];
    //     this.selectedFileNames = [];
    //     this.selectedFiles = [];
    //     return;
    //   }

    //   if (file.size > maxSizeBytes) {
    //     this.selectedImages = [];
    //     this.selectedFileNames = [];
    //     this.selectedFiles = [];
    //     this.fileSizeError =
    //       'The selected file exceeds the maximum allowed size (5MB).';
    //     return;
    //   }

    //   const reader = new FileReader();
    //   this.selectedFileNames = [file.name];
    //   this.selectedFiles = [file];

    //   reader.onload = () => {
    //     if (typeof reader.result === 'string' || reader.result === null) {
    //       const id = this.generateUniqueId();
    //       const imageSrc = reader.result as string;
    //       const image = new Image();
    //       image.src = imageSrc;

    //       image.onload = () => {
    //         if (image.height > maxHeight) {
    //           this.selectedImages = [];
    //           this.selectedFileNames = [];
    //           this.selectedFiles = [];
    //           this.fileSizeError =
    //             'The selected image dimensions exceed the maximum allowed size';
    //         } else {
    //           this.selectedImages = [{ imageSrc, id }];
    //           this.fileSizeError = '';
    //         }
    //       };
    //     }
    //   };

    //   reader.readAsDataURL(file);
    // }
  }

  async fillViewForm(response: any) {
    this.staffview = this.formBuilder.group({
      // image: [response.image],
      name: [response.name],
      email: [response.email],
      mobile: [response.mobile],
      department: [response.department.name],
      role: [response.role.name],
    });

    // const file = await this.createFile(response.image);
    // if (file) {
    //   const maxSizeBytes = 5000000;
    //   const maxHeight = 700;
    //   const fileType = file.type;
    //   const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];

    //   if (!validImageTypes.includes(fileType)) {
    //     this.fileSizeError = 'Only PNG, JPEG, and JPG formats are allowed.';
    //     this.selectedImages = [];
    //     this.selectedFileNames = [];
    //     this.selectedFiles = [];
    //     return;
    //   }

    //   if (file.size > maxSizeBytes) {
    //     this.selectedImages = [];
    //     this.selectedFileNames = [];
    //     this.selectedFiles = [];
    //     this.fileSizeError =
    //       'The selected file exceeds the maximum allowed size (5MB).';
    //     return;
    //   }

    //   const reader = new FileReader();
    //   this.selectedFileNames = [file.name];
    //   this.selectedFiles = [file];

    //   reader.onload = () => {
    //     if (typeof reader.result === 'string' || reader.result === null) {
    //       const id = this.generateUniqueId();
    //       const imageSrc = reader.result as string;
    //       const image = new Image();
    //       image.src = imageSrc;

    //       image.onload = () => {
    //         if (image.height > maxHeight) {
    //           this.selectedImages = [];
    //           this.selectedFileNames = [];
    //           this.selectedFiles = [];
    //           this.fileSizeError =
    //             'The selected image dimensions exceed the maximum allowed size';
    //         } else {
    //           this.selectedImages = [{ imageSrc, id }];
    //           this.fileSizeError = '';
    //         }
    //       };
    //     }
    //   };

    //   reader.readAsDataURL(file);
    // }
  }

  async createFile(url: string) {
    const fileName = url.substring(url.lastIndexOf('/') + 1, url.length);
    const response = await fetch(url);
    const data = await response.blob();
    const metadata = { type: 'image/jpeg' };
    const file = new File([data], fileName, metadata);
    return file;
  }

  viewProfile(staff: any) {
    this.router.navigate(['/admin/user-management/view-profile', staff.id]);
  }

  bannermodal() {
    this.staffcreateopen = true;
    this.selectedImages = [];
    this.selectedFileNames = [];
    this.selectedFiles = [];
  }

  closeModal() {
    this.staffcreateopen = false;
    this.staffcreate.reset();
    this.staffupdateopen = false;
    this.staffviewopen = false;
  }

  ClickexamModalconent(event: Event): void {
    event.stopPropagation();
  }

  async Status(id: any, status: any) {
    // Mock Logic
    const index = this.mockStaffData.findIndex((s) => s.id === id);
    if (index !== -1) {
      this.mockStaffData[index].is_active = status;
      this.GetStaff();
      this.successName = status ? 'Activated' : 'Deactivated';
      this.openSecondsuccess = true;
      setTimeout(() => {
        this.openSecondsuccess = false;
      }, 1800);
      return;
    }

    // Commented out API Call
    /*
    const actionMessage = status ? 'activated' : 'deactivated';
    let type = 'User';
    this.employeeService
      .changestatuss(id, status, type)
      .subscribe((response: any) => {
        if (response.status === 200) {
          this.successName = actionMessage;
          this.ngOnInit();
          setTimeout(() => {
            this.openSecondsuccess = true;
            setTimeout(() => {
              this.openSecondsuccess = false;
            }, 1800);
          }, 200);
        }
      });
    */
  }

  openUploadModal() {
    this.uploadModalOpen = true;
    this.uploadForm.reset();
    this.selectedUploadFile = null;
    this.selectedUploadFileName = '';
  }

  closeUploadModal() {
    this.uploadModalOpen = false;
    this.selectedUploadFile = null;
    this.selectedUploadFileName = '';
  }

  onUploadFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedUploadFile = file;
      this.selectedUploadFileName = file.name;
      this.uploadForm.get('file')?.markAsTouched();
      this.uploadForm.get('file')?.updateValueAndValidity();
    }
  }

  uploadFile() {
    if (this.uploadForm.invalid || !this.selectedUploadFile) {
      this.uploadForm.markAllAsTouched();
      return;
    }

    // Mock upload logic
    this.notificationService.show(
      'Staff file uploaded successfully (Mock)',
      'success',
      3000,
    );
    this.closeUploadModal();
    this.uploadForm.get('file')?.reset();
    this.GetStaff();

    /*
    const formData = new FormData();
    formData.append(
      'file',
      this.selectedUploadFile,
      this.selectedUploadFile.name,
    );

    this.employeeService.uploadStaffFile(formData).subscribe({
      next: (res) => {
        this.closeUploadModal();
        this.uploadForm.get('file')?.reset();
        this.notificationService.show(res.message, 'success', 3000);
        this.GetStaff();
      },
      error: () => {
        this.notificationService.show('File upload failed', 'error', 3000);
      },
    });
    */
  }
  downloadSampleFile() {
    const headers =
      'Name,Email,Mobile,Address,DOB,EmergencyContact,JoiningDate,Department,Designation\n';
    const sampleData =
      'John Doe,john@example.com,9876543210,Sample Address,1990-01-01,9988776655,2023-01-01,Operations,Manager';
    const blob = new Blob([headers + sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'staff_bulk_upload_sample.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    this.notificationService.show(
      'Sample file downloaded successfully',
      'success',
      2000,
    );
  }
}
