import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  constructor(
    private http: HttpClient,
    private apiservice: ApiService,
    private jwtService: JwtService
  ) {}

  createShift(requestbody: any): Observable<any> {
    const token = this.jwtService.getToken();
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    if (!(requestbody instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return this.apiservice.post(`v1/admin/shift`, requestbody, headers);
  }

  getShifts(tableSize: any, page: any, search: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    let url = '';
    if (tableSize !== 'all') {
      url = `v1/admin/shift?limit=${tableSize}&page=${page}`;
    } else {
      url = `v1/admin/shift`;
    }

    if (search && search.length > 0) {
      url += (url.includes('?') ? '&' : '?') + `search=${search}`;
    }

    return this.apiservice.get(url, headers);
  }

  getShiftById(id: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    return this.apiservice.get(`v1/admin/shift/${id}`, headers);
  }

  updateShift(id: any, body: any): Observable<any> {
    const token = this.jwtService.getToken();
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    if (!(body instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return this.apiservice.post(`v1/admin/shift/${id}`, body, headers);
  }

  updateShiftStatus(id: any, body: any): Observable<any> {
    const token = this.jwtService.getToken();
    let headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
    if (!(body instanceof FormData)) {
      headers = headers.set('Content-Type', 'application/json');
    }
    return this.apiservice.post(`v1/admin/shift/${id}/status`, body, headers);
  }

  assignBulkShift(payload: { employee_ids: string[], shift_code: string, date?: string, start_date?: string, end_date?: string }): Observable<any> {
    const stored = localStorage.getItem('shiftAssignments');
    const assignments = stored ? JSON.parse(stored) : {};
    const { employee_ids, shift_code } = payload;
    const startDate = payload.start_date || payload.date || '';
    const endDate = payload.end_date || startDate;

    if (!startDate || !endDate) {
      return of({ status: 400, message: 'Please select a valid shift date range.' });
    }

    const dates = this.getDateRange(startDate, endDate);
    if (dates.length === 0) {
      return of({ status: 400, message: 'End date cannot be before start date.' });
    }

    employee_ids.forEach((empId: string) => {
      const idStr = String(empId);
      if (!assignments[idStr]) {
        assignments[idStr] = {};
      }
      dates.forEach(date => {
        assignments[idStr][date] = shift_code;
      });
    });

    localStorage.setItem('shiftAssignments', JSON.stringify(assignments));

    return of({ status: 200, message: `Shift "${shift_code}" successfully assigned to ${employee_ids.length} employee(s) from ${startDate} to ${endDate}.` });
  }

  getShiftGroups(): Observable<any> {
    const storedDefault = localStorage.getItem('employeeDefaultShifts');
    const defaultShifts = storedDefault ? JSON.parse(storedDefault) : {};

    const employeeIds = new Set<string>();
    for (const empId in defaultShifts) {
      employeeIds.add(empId);
    }
    ['1', '2', '3', '4', '5', '6'].forEach(id => employeeIds.add(id));

    const groups: { [shiftCode: string]: string[] } = { "Shift A": [], "Shift B": [], "Shift C": [] };

    employeeIds.forEach(empId => {
      const shiftCode = defaultShifts[empId] || 'Shift A';
      if (groups[shiftCode] !== undefined) {
        groups[shiftCode].push(empId);
      }
    });

    return of({ status: 200, data: groups });
  }

  rotateBulkGroup(payload: { source_group: string, target_shift: string }): Observable<any> {
    const { source_group, target_shift } = payload;
    
    const storedDefault = localStorage.getItem('employeeDefaultShifts');
    const defaultShifts = storedDefault ? JSON.parse(storedDefault) : {};

    const employeeIds = new Set<string>();
    for (const empId in defaultShifts) {
      employeeIds.add(empId);
    }
    ['1', '2', '3', '4', '5', '6'].forEach(id => employeeIds.add(id));

    const targetEmployeeIds: string[] = [];
    employeeIds.forEach(empId => {
      const currentDefault = defaultShifts[empId] || 'Shift A';
      if (currentDefault === source_group) {
        targetEmployeeIds.push(empId);
      }
    });

    if (targetEmployeeIds.length === 0) {
      return of({ status: 400, message: `No employees currently have "${source_group}" set as their default shift.` });
    }

    targetEmployeeIds.forEach(empId => {
      defaultShifts[empId] = target_shift;
    });

    localStorage.setItem('employeeDefaultShifts', JSON.stringify(defaultShifts));

    return of({
      status: 200,
      message: `Successfully rotated default shift of ${targetEmployeeIds.length} employee(s) from "${source_group}" to "${target_shift}".`
    });
  }

  private getDateRange(startDate: string, endDate: string): string[] {
    const dates: string[] = [];
    const start = this.parseDate(startDate);
    const end = this.parseDate(endDate);

    if (!start || !end || start > end) {
      return dates;
    }

    const current = new Date(start);
    while (current <= end) {
      dates.push(this.formatDate(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  }

  private parseDate(dateStr: string): Date | null {
    const parts = dateStr.split('-').map(Number);
    if (parts.length !== 3 || parts.some(part => Number.isNaN(part))) {
      return null;
    }
    return new Date(parts[0], parts[1] - 1, parts[2]);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
