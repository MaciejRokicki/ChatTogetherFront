import { ColumnProperty } from "./columnProperty";

export interface TableData {
    data: Array<any>;
    properties: Array<ColumnProperty>;
    showOrdinalNumbers: boolean;
}