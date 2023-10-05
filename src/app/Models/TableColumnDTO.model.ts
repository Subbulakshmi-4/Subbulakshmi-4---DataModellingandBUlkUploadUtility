export interface TableColumnDTO {
  id: number;
  entityColumnName: string;
  datatype: string;
  length: number;
  isNullable: boolean;
  defaultValue: string;
  isPrimaryKey: boolean; // This represents if the column is a primary key locally
}
