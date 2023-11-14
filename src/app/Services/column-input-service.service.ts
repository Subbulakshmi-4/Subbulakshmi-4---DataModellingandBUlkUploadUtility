import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ColumnInputServiceService {
  //private apiUrl = 'https://localhost:7245'; 
        //https://localhost:7254/create-table

   private ApiUrlGateWay = 'https://localhost:7093';

  constructor(private http: HttpClient) { }
  
  getDataFromBackend(): Observable<any> {
    return this.http.get<any>(`${this.ApiUrlGateWay}/your-endpoint`);
  }

  createTable(request: any): Observable<any> {
    // return this.http.post<any>(`${this.apiUrl}/api/dynamic/create-table`, request)
    return this.http.post<any>(`${this.ApiUrlGateWay}/create-table`, request)
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
