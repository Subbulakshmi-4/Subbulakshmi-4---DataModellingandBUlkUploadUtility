import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';

@Injectable({

  providedIn: 'root'

})

export class ColumnInputServiceService {
  private apiUrl = 'https://localhost:7245'; // Replace with your actual API endpoint URL

  constructor(private http: HttpClient) { }

  createTable(request: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/api/dynamic/create-table`, request)
      .pipe(
        catchError(error => {
          // Handle error and extract error message
          let errorMessage = 'An error occurred while creating the table.';
          if (error.error && error.error.errorMessage && error.error.errorMessage.length > 0) {
            errorMessage = error.error.errorMessage[0]; // Extract the first error message
          }
          return throwError(errorMessage);
        })
      );
  }
  // constructor(private http: HttpClient) {}

  // createTable(formData: any): Observable<any> {
  //   const url = 'https://localhost:7245/api/dynamic/create-table';
  //   console.log("testing")
  //   return this.http.post(url, formData);
  // }
}