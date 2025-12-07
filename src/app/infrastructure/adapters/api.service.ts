// Infrastructure Adapter - Generic HTTP API Service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiPort } from '../../domain/ports/api.port';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements ApiPort {
  private readonly baseUrl: string = environment.baseUrl;

  constructor(private readonly http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}${endpoint}`) as Observable<T>;
  }
}
