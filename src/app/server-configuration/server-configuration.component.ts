import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ColumnsService } from '../Services/columns.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ServerConfigService } from '../Services/server-config.service';
@Component({
  selector: 'app-server-configuration',
  templateUrl: './server-configuration.component.html',
  styleUrls: ['./server-configuration.component.css']
})
export class ServerConfigurationComponent {
  serverConfig: any = {};

  constructor(private httpClient: HttpClient, private route: ActivatedRoute, private columnsService: ColumnsService, private router: Router,private serverConfigService: ServerConfigService ) {}
 goBackToList(){
    this.router.navigate(['/entity-list']);
  }
  // Function to handle form submission
  onSubmit() {
    this.serverConfigService.submitServerConfig(this.serverConfig).subscribe((response) => {
      // Handle the API response here if needed
      console.log('API Response:', response);
  
      // Navigate to the Entity List page
      this.router.navigate(['/entity-list']);
    });
  }
} 
