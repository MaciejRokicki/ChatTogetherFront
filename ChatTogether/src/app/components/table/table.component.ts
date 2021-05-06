import { Component, Input, OnInit } from '@angular/core';

import { MDCDataTable } from '@material/data-table';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() data: Array<any> = [
    { 
      test: '1test1',
      test2: '1test2'
    },
    { 
      test: '2test1',
      test2: '2test2'
    },
    { 
      test: '3test1',
      test2: '3test2'
    }
  ];
  @Input() columns: Array<string> = [ 'test', 'test2' ];

  constructor() { }

  ngOnInit(): void {
    const dataTable = new MDCDataTable(document.querySelector('.mdc-data-table') as Element);
  }

  public onRowClick(index: number): void {
    console.log(index);
  }

}
