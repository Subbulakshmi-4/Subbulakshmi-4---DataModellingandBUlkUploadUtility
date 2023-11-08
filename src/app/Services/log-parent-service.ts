import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, catchError, throwError } from 'rxjs';

@Injectable({

  providedIn: 'root'

})

export class LogparentService {
  
  constructor(private http: HttpClient) { }
 
  private apiUrl = 'https://localhost:7245/api//Excel/upload?tableName=testing'; // Replace this URL with your API endpoint URL


  generateExcelFile(columns: any[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate`, columns);
  }

  uploadFile(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/upload`, formData);
  }
}