import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { JwtService } from './jwt.service';

@Injectable({
  providedIn: 'root',
})
export class SiteService {
  constructor(
    private apiservice: ApiService,
    private jwtService: JwtService
  ) {}

  createSite(requestbody: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.apiservice.post(`v1/admin/sites`, requestbody, headers);
  }

  getSites(tableSize: any, page: any, search: any): Observable<any> {
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

    return this.apiservice.get(`v1/admin/sites`, headers, params).pipe(
      map((response: any) => {
        if (response.status === 200 && response.data) {
          response.data = response.data.map((item: any) => ({
            ...item,
            siteName: item.name,
            is_active: item.status !== undefined ? item.status : item.is_active
          }));
        }
        return response;
      })
    );
  }

  getAllSites(): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.apiservice.get(`v1/sites`, headers);
  }

  getSiteById(id: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.apiservice.get(`v1/admin/sites/${id}`, headers).pipe(
      map((response: any) => {
        if (response.status === 200 && response.data) {
          response.data = {
            ...response.data,
            siteName: response.data.name,
            is_active: response.data.status !== undefined ? response.data.status : response.data.is_active
          };
        }
        return response;
      })
    );
  }

  updateSite(id: any, body: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.apiservice.post(`v1/admin/sites/${id}`, body, headers);
  }

  updateSiteStatus(id: any, body: any): Observable<any> {
    const token = this.jwtService.getToken();
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.apiservice.post(`v1/admin/sites/${id}/status`, body, headers);
  }
}
