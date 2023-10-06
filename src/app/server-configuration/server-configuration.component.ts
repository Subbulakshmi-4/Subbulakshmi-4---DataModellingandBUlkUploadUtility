import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ColumnsService } from '../Services/Columns.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-server-configuration',
  templateUrl: './server-configuration.component.html',
  styleUrls: ['./server-configuration.component.css']
})
export class ServerConfigurationComponent {
  serverConfig: any = {
    serverName: '',
    userName: '',
    password: '',
    databaseName: ''
  };

  constructor(private httpClient: HttpClient, private route: ActivatedRoute, private columnsService: ColumnsService, private router: Router ) {}
 goBackToList(){
    this.router.navigate(['/entity-list']);
  }
  // Function to handle form submission
  onSubmit() {
    // Create the connection string based on user input
    const connectionString = `Host=${this.serverConfig.serverName};Database=${this.serverConfig.databaseName};Username=${this.serverConfig.userName};Password=${this.serverConfig.password}`;

    // Make an HTTP POST request to send the connection string to the .NET backend
    this.httpClient.post('/api/setconnectionstring', { connectionString }).subscribe(
      (response) => {
        // Handle success (e.g., show a success message to the user)
        console.log('Connection string submitted successfully', response);
      },
      (error) => {
        // Handle error (e.g., display an error message to the user)
        console.error('Error submitting connection string', error);
      }
    );
  }
} 
