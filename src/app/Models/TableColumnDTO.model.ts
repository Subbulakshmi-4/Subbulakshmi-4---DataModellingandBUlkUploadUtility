export interface TableColumnDTO {
  entityname: string;
  id: number;
  entityColumnName: string;
  entityId:number;
  datatype: string;
  length: number;
  minLength: number;
  maxLength: number;
  dateMinValue: string;
  dateMaxValue:string;
  description:String;
  isNullable: boolean;
  defaultValue: string;
  ColumnPrimaryKey: boolean; 
  True: string; 
  False: string; 
}
