import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { MDCDataTable } from '@material/data-table';
import { TableData } from './Interfaces/tableData';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() tableData?: TableData;
  @Input() method: Function = () => {};

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    const dataTable = new MDCDataTable(document.querySelector('.mdc-data-table') as Element);
  }
}