export interface TableColumnDTO {
  id: number;
  entityColumnName: string;
  datatype: string;
  length: number;
  isNullable: boolean; // Add this property
  defaultValue: string;
  isPrimaryKey: boolean; // Add this property
}
