// Port (Interface) - Defines contract for outbound API communication
import { Observable } from 'rxjs';

export interface ApiPort {
  get<T>(endpoint: string): Observable<T>;
}
