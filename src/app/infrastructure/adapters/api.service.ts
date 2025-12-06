// Infrastructure Adapter - Generic HTTP API Service
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiPort } from '../../domain/ports/api.port';

@Injectable({
  providedIn: 'root',
})
export class ApiService implements ApiPort {
  constructor(private http: HttpClient) {}

  get<T>(endpoint: string): Observable<T> {
    return this.http.get<T>(endpoint) as Observable<T>;
  }
}
