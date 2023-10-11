export interface TableColumnDTO {
  id: number;
  entityColumnName: string;
  datatype: string;
  length: number;
  description:String;
  isNullable: boolean;
  defaultValue: string;
  ColumnPrimaryKey: boolean; // This represents if the column is a primary key locally
}
