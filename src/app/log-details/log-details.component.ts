import { Component } from '@angular/core';

@Component({
  selector: 'app-log-details',
  templateUrl: './log-details.component.html',
  styleUrls: ['./log-details.component.css']
})
export class LogDetailsComponent {
  tableData: any[] = [
    // Add your data objects here, for example:
    { id: 1, parentId: 1, childId: 1, userId: 1, errorMessage: 'Datatypemismatch', timestamp: 1697005938 },
    { id: 1, parentId: 1, childId: 1, userId: 1, errorMessage: 'PleaseChecklength', timestamp: 1697005939 },
    { id: 1, parentId: 1, childId: 1, userId: 1, errorMessage: 'fail', timestamp: 1697005940 },
    { id: 1, parentId: 1, childId: 1, userId: 1, errorMessage: 'PleaseCheckName', timestamp: 1697005941 },
    { id: 1, parentId: 1, childId: 1, userId: 1, errorMessage: 'Datatypesmismatch', timestamp: 1697005942 },
    { id: 1, parentId: 1, childId: 1, userId: 1, errorMessage: 'Datatypesmismatch', timestamp: 1697005943 },
    { id: 1, parentId: 1, childId: 1, userId: 1, errorMessage: 'Datatypesmismatch', timestamp: 1697005944 },
    { id: 1, parentId: 1, childId: 1, userId: 1, errorMessage: 'Datatypesmismatch', timestamp: 1697005945 },
    { id: 1, parentId: 1, childId: 1, userId: 1, errorMessage: 'Datatypesmismatch', timestamp: 1697005946 },
    { id: 1, parentId: 1, childId: 1, userId: 1, errorMessage: 'Datatypesmismatch', timestamp: 1697005947 },
  ];
}
