import { Component, Input, OnInit } from '@angular/core';

import { MDCDataTable } from '@material/data-table';
import { TableData } from './Interfaces/tableData';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() tableData?: TableData;

  constructor() { }

  ngOnInit(): void {
    const dataTable = new MDCDataTable(document.querySelector('.mdc-data-table') as Element);
  }

  public onRowClick(index: number): void {
    console.log(index);
  }

}
