import { Component, OnInit } from '@angular/core';

import { EntityListDto } from '../Models/EntitylistDto.model';

import { EntitylistService } from '../Services/entitylist.service';

import { Router } from '@angular/router'; // Import Router

 

@Component({

  selector: 'app-displaytable-name',

  templateUrl: './displaytable-name.component.html',

  styleUrls: ['./displaytable-name.component.css']

})

 

export class DisplaytableNameComponent implements OnInit {

  tableNames: EntityListDto[] = [];

  errorMessage: string = '';

 

  pagedData: any[] = [];

  currentPage = 1;

  itemsPerPage = 5; // Number of items per page

 

  searchText = ''; // Variable to store user input for search

 

  constructor(private entitylistService: EntitylistService, private router: Router) {} // Inject Router

 

  ngOnInit(): void {

    this.entitylistService.getEntityList().subscribe(

      (data: any) => {

        this.tableNames = data.result;

        this.setPage(this.currentPage); // Initialize the first page

      },

      (error) => {

        console.error('Error fetching table names:', error);

        this.errorMessage = 'No Data Available';  // Update error message

      }

    );

  }

 

  setPage(page: number) {

    const startIndex = (page - 1) * this.itemsPerPage;

    const endIndex = Math.min(startIndex + this.itemsPerPage, this.tableNames.length);

    this.pagedData = this.tableNames.slice(startIndex, endIndex);

    console.log("page data",this.pagedData);

  }

 

  nextPage() {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

      this.setPage(this.currentPage);

    }

  }

 

  previousPage() {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.setPage(this.currentPage);

    }

  }

 

  onSearch() {

 

    console.log(this.searchText)

    // Filter the data based on the searchText

    if (this.searchText) {

      this.pagedData = this.tableNames.filter(item =>

        item.entityName.toLowerCase().includes(this.searchText.toLowerCase())

      );

    } else {

      // If search text is empty, reset to the original data

      this.setPage(this.currentPage);

    }

  }

 

  get totalPages(): number {

    return Math.ceil(this.tableNames.length / this.itemsPerPage);

  }

 

  createTable() {

    // ... Your existing createTable code ...

 

    // Navigate to the "createtable" route when the button is clicked

    console.log("forchecking")

    this.router.navigate(['/createtable']);

  }

 

  onEntityClicked(entityName: string): void {

    this.router.navigate(['/entity', entityName]); // Navigate to EntityDetailsComponent with entityName parameter

  }

}

 