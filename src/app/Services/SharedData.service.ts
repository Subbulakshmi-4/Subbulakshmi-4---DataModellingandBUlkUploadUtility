import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
    private logDetailsData = new BehaviorSubject<any>(null);
    data:any[]=[
      
    ];
  
    getLogDetailsData() {
      return this.logDetailsData.asObservable();
    }
  
    setLogDetails(data: any) {
      this.logDetailsData.next(data);
    }
}
