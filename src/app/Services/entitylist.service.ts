import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityListDto } from '../Models/EntitylistDto.model';


@Injectable({
  providedIn: 'root'
})
export class EntitylistService {
  private apiUrl = 'http://localhost:5100/api/entitylist';

  constructor(private http:HttpClient) { }

  getEntityList(): Observable<EntityListDto[]> {
    return this.http.get<EntityListDto[]>(this.apiUrl);
  }
  
}
