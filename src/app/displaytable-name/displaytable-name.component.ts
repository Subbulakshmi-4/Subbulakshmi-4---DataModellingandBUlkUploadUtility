import { Component, OnInit } from '@angular/core';
import { EntitylistService } from '../Services/entitylist.service';
import { Router } from '@angular/router'; // Import Router
import { EntityListDto } from '../Models/EntitylistDto.model';
import {SharedDataService} from '../Services/SharedData.service'
 
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
  hasValues: { [key: string]: boolean } = {};

  searchText = ''; // Variable to store user input for search
 
  constructor(private entitylistService: EntitylistService, private router: Router,private shareddata:SharedDataService) {} // Inject Router
 
  // ngOnInit(): void {
  //   this.entitylistService.getEntityList().subscribe(
  //     (data: any) => {
  //       this.tableNames = data.result;
  //       this.pagedData = this.tableNames;
  //       console.log(this.pagedData)
  //     },
  //     (error) => {
  //       console.error('Error fetching table names:', error);
  //       this.errorMessage = 'No Data Available';  // Update error message
  //     }
  //   );
 
  //   this.setPage(this.currentPage); // Initialize the first page
  //   this.shareddata.checkTablesHaveValues(this.pagedData.map(table => table.entityName))
  //     .subscribe(
  //       (tablesWithValues: { [key: string]: boolean }) => {
  //         console.log('Tables with values:', tablesWithValues);
  //         Object.entries(tablesWithValues).forEach(([tableName, hasValues]) => {
  //           console.log(`${tableName} has values: ${hasValues}`);
  //         });
  //       },
  //       (error) => {
  //         console.error('Error checking tables for values:', error);
  //       }
  //     );
  // }
  ngOnInit(): void {
    this.entitylistService.getEntityList().subscribe(
      (data: any) => {
        this.tableNames = data.result;
        this.pagedData = this.tableNames;
        console.log('Fetched table names:', this.pagedData);
  
        // Make the second API call inside this block
        const tableNames = this.pagedData.map(table => table.entityName);
        console.log('Table names for the second API call:', tableNames);
        this.shareddata.checkTablesHaveValues(this.pagedData.map(table => table.entityName))
        .subscribe(
          (tablesWithValues: { [key: string]: boolean }) => {
            console.log('Tables with values:', tablesWithValues);
            this.hasValues = tablesWithValues;  // Assign the values to the component property
          },
          (error) => {
            console.error('Error checking tables for values:', error);
          }
        );
      },
      (error) => {
        console.error('Error fetching table names:', error);
        this.errorMessage = 'No Data Available';  // Update error message
      }
    );
   
    this.setPage(this.currentPage); // Initialize the first page
  }
  
  editTable(entityName: string) {
    // Implement your editTable logic here
    console.log(`Editing table: ${entityName}`);
  }
  setPage(page: number) {
    const startIndex = (page - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.tableNames.length);
    this.pagedData = this.tableNames.slice(startIndex, endIndex);
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
 