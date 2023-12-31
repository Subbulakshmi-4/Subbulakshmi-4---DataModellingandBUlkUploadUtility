import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ColumnInputServiceService {
  private apiUrl = 'https://localhost:7245'; 

  
  constructor(private http: HttpClient) { }
  
  getDataFromBackend(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/your-endpoint`);
  }

  createTable(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/dynamic/create-table`, request)
      .pipe(
        catchError(error => {
          let errorMessage = 'An error occurred while creating the table.';
          if (error.error && error.error.errorMessage && error.error.errorMessage.length > 0) {
            errorMessage = error.error.errorMessage[0]; 
          }
          return throwError(errorMessage);
        })
      );
  }
}
