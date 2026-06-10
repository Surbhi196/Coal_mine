import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class SalaryStructureService {
  constructor(
    private apiservice: ApiService,
    private jwtService: JwtService
  ) {}

  createSalaryStructure(requestbody: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.apiservice.post(`v1/admin/salarystructure`, requestbody, headers);
  }

  updateSalaryStructure(id: any, requestbody: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.apiservice.post(`v1/admin/salarystructure/${id}`, requestbody, headers);
  }

  getSalaryStructures(tableSize: any, page: any, search: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    let params = new HttpParams();
    if (tableSize !== 'all') {
      params = params.set('limit', tableSize.toString());
      params = params.set('page', page.toString());
    }

    if (search && search.length > 0) {
      params = params.set('search', search);
    }

    return this.apiservice.get(`v1/admin/salarystructure`, headers, params).pipe(
      map((response: any) => {
        if (response.status === 200 && response.data) {
          response.data = response.data.map((item: any) => ({
            ...item,
            designationId: item.designation_id,
            basicSalary: item.basic_salary,
            shiftAllowance: item.shift_allowance,
            incentives: item.incentives,
            otherDeductions: item.other_deduction,
            isPfApplicable: item.pf_applicable,
            isMessDeduction: item.mess_deduction_applicable,
            is_active: item.status !== undefined ? item.status : item.is_active
          }));
        }
        return response;
      })
    );
  }

  updateSalaryStructureStatus(id: any, requestbody: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.apiservice.post(`v1/admin/salarystructure/${id}/status`, requestbody, headers);
  }

  getSalaryStructureById(id: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.apiservice.get(`v1/admin/salarystructure/${id}`, headers).pipe(
      map((response: any) => {
        if (response.status === 200 && response.data) {
          response.data = {
            ...response.data,
            designationId: response.data.designation_id,
            basicSalary: response.data.basic_salary,
            shiftAllowance: response.data.shift_allowance,
            incentives: response.data.incentives,
            otherDeductions: response.data.other_deduction,
            isPfApplicable: response.data.pf_applicable,
            isMessDeduction: response.data.mess_deduction_applicable,
            is_active: response.data.status !== undefined ? response.data.status : response.data.is_active
          };
        }
        return response;
      })
    );
  }
}
