import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityListDto } from './EntityListDto.model';

@Injectable({
  providedIn: 'root'
})
export class EntityListServiceService {
  private apiUrl = 'https://localhost:7245/api/entitylist';

  constructor(private http:HttpClient) { }

  getEntityList(): Observable<EntityListDto[]> {
    return this.http.get<EntityListDto[]>(this.apiUrl);
  }
}

