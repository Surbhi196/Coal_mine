import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-fuel-station-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatDialogModule, MatButtonModule],
  template: `
    <div class="modal-content border-0 p-4">
      <div class="modal-header border-0 d-flex justify-content-between align-items-center mb-4 p-0">
        <h4 class="modal-title m-0" style="font-weight: 500;">Create Fuel Station</h4>
        <button type="button" class="btn-close" style="font-size: 14px;" (click)="close()"></button>
      </div>
      <div class="modal-body p-0">
        <div class="row mb-3">
          <div class="col-md-3 d-flex align-items-center">
            <label class="form-lable-custom m-0" style="font-weight: 400; font-size: 14px;">Name</label>
          </div>
          <div class="col-md-9">
            <input type="text" class="form-control form-input-custom" placeholder="Fuel Station Name" style="border-radius: 4px; border: 1px solid #e0e6ed;">
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-md-3 d-flex align-items-center">
            <label class="form-lable-custom m-0" style="font-weight: 400; font-size: 14px;">Contact Number</label>
          </div>
          <div class="col-md-9">
            <input type="text" class="form-control form-input-custom" placeholder="Contact Number" style="border-radius: 4px; border: 1px solid #e0e6ed;">
          </div>
        </div>
        <div class="row mb-4">
          <div class="col-md-3">
            <label class="form-lable-custom m-0 pt-2" style="font-weight: 400; font-size: 14px;">Address</label>
          </div>
          <div class="col-md-9">
            <textarea class="form-control form-input-custom" rows="4" style="border-radius: 4px; border: 1px solid #e0e6ed; resize: none;"></textarea>
          </div>
        </div>
      </div>
      <div class="modal-footer border-0 p-0 mt-2 d-flex justify-content-end">
        <button type="button" class="btn btn-secondary me-2" style="background-color: #8898aa; border: none; padding: 6px 16px;" (click)="close()">Close</button>
        <button type="button" class="btn btn-custom-primary" style="padding: 6px 16px;">Save</button>
      </div>
    </div>
  `,
  styles: [`
    .modal-content { font-family: inherit; }
    .form-input-custom::placeholder { color: #c0c4cc; font-size: 14px; }
  `]
})
export class FuelStationDialogComponent {
  constructor(public dialogRef: MatDialogRef<FuelStationDialogComponent>) {}

  close(): void {
    this.dialogRef.close();
  }
}
