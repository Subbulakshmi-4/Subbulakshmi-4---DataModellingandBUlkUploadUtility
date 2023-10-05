import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({

  providedIn: 'root'

})

export class ColumnInputServiceService {

  constructor(private http: HttpClient) {}

  createTable(formData: any): Observable<any> {

    // console.log("testing")

    const url = 'https://localhost:7245/api/dynamic/create-table';
    console.log("testing")
    return this.http.post(url, formData);

  }

}