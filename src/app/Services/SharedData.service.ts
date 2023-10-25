import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  constructor(private http: HttpClient) { }
    private logDetailsData = new BehaviorSubject<any>(null);
    data:any[]=[
    ];
    private apiUrl = 'https://localhost:7245/api/ExportExcel';
    getLogDetailsData() {
      return this.logDetailsData.asObservable();
    }
    // getData(parentId: number): Observable<Blob> {
    //   const url = `${this.apiUrl}/${parentId}`;
    //   // Set responseType to 'blob' to handle binary data
    //   return this.http.get(url, { responseType: 'blob' });
    // }
    getData(parentId: number, entityName: string): Observable<Blob> {
      const url = `${this.apiUrl}/${parentId}?entityName=${entityName}`;
      // Set responseType to 'blob' to handle binary data
      return this.http.get(url, { responseType: 'blob' });
    }
    
    setLogDetails(data: any) {
      this.logDetailsData.next(data);
    }
}
