import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  constructor(
    private apiService: ApiService,
    private jwtService: JwtService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.jwtService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  addInventory(formData: FormData): Observable<any> {
    return this.apiService.post('v1/admin/inventories/add', formData, this.getHeaders());
  }

  updateInventoryQuantity(id: string | number, formData: FormData): Observable<any> {
    return this.apiService.post(`v1/admin/inventories/update-quantity/${id}`, formData, this.getHeaders());
  }

  bulkUploadInventory(formData: FormData): Observable<any> {
    return this.apiService.post('v1/admin/inventories/bulk-upload', formData, this.getHeaders());
  }

  assignInventory(formData: FormData): Observable<any> {
    return this.apiService.post('v1/admin/inventories/assign', formData, this.getHeaders());
  }

  getInventoryDetails(id: any): Observable<any> {
    return this.apiService.get(`v1/admin/inventories/${id}`, this.getHeaders());
  }

  getInventories(tableSize: any, page: any, search?: string): Observable<any> {
    let params = new HttpParams();

    if (tableSize !== 'all') {
      params = params.set('limit', String(tableSize)).set('page', String(page));
    }

    if (search && search.trim().length > 0) {
      params = params.set('search', search.trim());
    }

    return this.apiService.get('v1/admin/inventories', this.getHeaders(), params);
  }

  getInventoryLogs(id: any): Observable<any> {
    return this.apiService.get(`v1/admin/inventories/${id}/logs`, this.getHeaders());
  }
}
