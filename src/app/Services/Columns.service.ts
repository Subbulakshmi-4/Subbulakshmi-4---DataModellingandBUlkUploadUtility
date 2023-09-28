import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableColumnDTO } from '../Models/TableColumnDTO.model';

@Injectable({
  providedIn: 'root'
})

export class ColumnsService {
  private apiUrl = 'https://localhost:7245/api';

  constructor(private http: HttpClient) {}

  getColumnsForEntity(entityName: string): Observable<TableColumnDTO[]> {
    const url = `${this.apiUrl}/entity/${entityName}/columns`;
    return this.http.get<TableColumnDTO[]>(url);
  }

  generateExcelTemplate(columns: TableColumnDTO[]): Observable<any> {
    const url = `${this.apiUrl}/excel/generate`;

    // Assuming that the Excel generation API expects JSON data
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      responseType: 'text' as 'json' // Set the response type to text
    };

    return this.http.post(url, columns, options);
  }
  // uploadTemplate(file: FormData): Observable<any> {
    
  //   const url = `${this.apiUrl}/excel/upload`; // Replace 'excel/upload' with your actual API endpoint

  //   const options = {
  //     headers: new HttpHeaders(),
  //     responseType: 'text' as 'json' // Set the response type to text
  //   };

  //   return this.http.post(url, file, options);
  // }
  uploadTemplate(file: FormData, tableName: string): Observable<any> {
    const url = `${this.apiUrl}/excel/upload?tableName=${tableName}`;
  
    const options = {
      headers: new HttpHeaders(),
      responseType: 'text' as 'json' // Set the response type to text
    };
  
    return this.http.post(url, file, options);
  }
}
