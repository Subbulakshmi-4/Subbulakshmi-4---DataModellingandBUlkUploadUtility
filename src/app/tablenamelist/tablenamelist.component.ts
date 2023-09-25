import { Component } from '@angular/core';
import { catchError, tap } from 'rxjs';
import { EntityListDto } from '../EntityListDto.model';
import { EntityListServiceService } from '../entity-list-service.service';

@Component({
  selector: 'app-tablenamelist',
  templateUrl: './tablenamelist.component.html',
  styleUrls: ['./tablenamelist.component.css']
})
export class TablenamelistComponent {
  tableNames: EntityListDto[] = [];

  constructor(private entityListService: EntityListServiceService) { }

  ngOnInit(): void {
    this.entityListService.getEntityList().subscribe(
      (data) => {
        this.tableNames = data;
      },
      (error) => {
        console.error('Error fetching table names:', error);
      }
    );
  }
}


