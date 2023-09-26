import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TableColumn } from '../Models/TableColumn.model';

@Injectable({
  providedIn: 'root'
})
export class ColumnsService {
  private apiUrl = 'http://localhost:5100/api';

  constructor(private http: HttpClient) {}

  getColumnsForEntity(entityName: string): Observable<TableColumn[]> {
    const url = `${this.apiUrl}/entity/${entityName}/columns`;
    return this.http.get<TableColumn[]>(url);
  }

  generateExcelTemplate(columns: TableColumn[]): Observable<any> {
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
}
