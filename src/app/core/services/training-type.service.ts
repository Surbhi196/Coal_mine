import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class TrainingTypeService {
  constructor(
    private apiservice: ApiService,
    private jwtService: JwtService
  ) {}

  createTrainingType(requestbody: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.apiservice.post(`v1/admin/trainingtype`, requestbody, headers);
  }

  getTrainingTypes(tableSize: any, page: any, search: any): Observable<any> {
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

    return this.apiservice.get(`v1/admin/trainingtype`, headers, params);
  }

  getTrainingTypeById(id: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.apiservice.get(`v1/admin/trainingtype/${id}`, headers);
  }

  updateTrainingType(id: any, body: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.apiservice.post(`v1/admin/trainingtype/${id}`, body, headers);
  }

  updateTrainingTypeStatus(id: any, body: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.apiservice.post(`v1/admin/trainingtype/${id}/status`, body, headers);
  }
}

