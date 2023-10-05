import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityListDto } from '../Models/EntitylistDto.model';


@Injectable({ 
  providedIn: 'root'
})
export class EntitylistService {
  private apiUrl = 'https://localhost:7245/api/entitylist';
  // http://localhost:7245/api/entitylist

  constructor(private http:HttpClient) { }

  getEntityList(): Observable<EntityListDto[]> {    
    return this.http.get<EntityListDto[]>(this.apiUrl);
  }
  
}
