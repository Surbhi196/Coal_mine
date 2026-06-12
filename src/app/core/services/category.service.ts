import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(
    private apiService: ApiService,
    private jwtService: JwtService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.jwtService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getCategories(page?: number, limit?: number | string, search?: string): Observable<any> {
    let params = new HttpParams();
    if (page) params = params.set('page', page.toString());
    if (limit && limit !== 'all') params = params.set('limit', limit.toString());
    if (search) params = params.set('search', search);

    return this.apiService.get('v1/admin/categories', this.getHeaders(), params);
  }

  getAllCategories(): Observable<any> {
    return this.apiService.get('v1/categories', this.getHeaders());
  }

  getAllSubCategories(): Observable<any> {
    return this.apiService.get('v1/subcategories', this.getHeaders());
  }

  getCategoryById(id: string | number): Observable<any> {
    return this.apiService.get(`v1/admin/categories/${id}`, this.getHeaders());
  }

  getSubCategories(page?: number, limit?: number | string, search?: string): Observable<any> {
    let params = new HttpParams();
    if (page) params = params.set('page', page.toString());
    if (limit && limit !== 'all') params = params.set('limit', limit.toString());
    if (search) params = params.set('search', search);

    return this.apiService.get('v1/admin/subcategories', this.getHeaders(), params);
  }

  getSubCategoryById(id: string | number): Observable<any> {
    return this.apiService.get(`v1/admin/subcategories/${id}`, this.getHeaders());
  }

  createCategory(formData: FormData): Observable<any> {
    return this.apiService.post('v1/admin/categories', formData, this.getHeaders());
  }

  createSubCategory(formData: FormData): Observable<any> {
    return this.apiService.post('v1/admin/subcategories', formData, this.getHeaders());
  }

  updateSubCategory(id: string | number, formData: FormData): Observable<any> {
    return this.apiService.post(`v1/admin/subcategories/${id}`, formData, this.getHeaders());
  }

  updateCategory(id: string | number, formData: FormData): Observable<any> {
    return this.apiService.post(`v1/admin/categories/${id}`, formData, this.getHeaders());
  }

  updateCategoryStatus(id: string | number, status: number): Observable<any> {
    return this.apiService.patch(`v1/admin/categories/${id}/status`, { status }, this.getHeaders());
  }

  updateSubCategoryStatus(id: string | number, status: number): Observable<any> {
    return this.apiService.patch(`v1/admin/subcategories/${id}/status`, { status }, this.getHeaders());
  }
}

