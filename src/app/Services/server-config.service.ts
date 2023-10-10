import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServerConfigService {
  constructor(private http: HttpClient) {}

  submitServerConfig(serverConfig: any) {
    const url = 'https://localhost:7245/api/entitylist/listtables'; // Replace with your API endpoint

    return this.http.post(url, serverConfig);
  }
}
