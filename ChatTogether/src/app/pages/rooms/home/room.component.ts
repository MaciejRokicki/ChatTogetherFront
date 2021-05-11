import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { map } from 'rxjs/operators';
import { ColumnProperty } from 'src/app/components/table/Interfaces/columnProperty';
import { TableData } from 'src/app/components/table/Interfaces/tableData';

import { Room } from 'src/app/entities/room';
import { RoomProvider } from 'src/app/providers/room.provider';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  public tableData: TableData = {
    data: [], 
    properties: <ColumnProperty[]>[
      {
        propertyName: 'Name',
        displayName: 'Nazwa',
        isNumeric: false
      },
      {
        propertyName: 'Occupancy',
        displayName: 'Obłożenie',
        isNumeric: true     
      }
    ],
    showOrdinalNumbers: true
  };

  constructor(
    private roomProvider : RoomProvider,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.roomProvider.getRooms();

    this.roomProvider.allRooms.pipe(
      map((result: Room[]) => {
        this.tableData.data = result;
      })
    ).subscribe();
  }

  public onRowClick(index: number) {
    this.router.navigate(['conversation', this.tableData.data[index].Id])
  }

}
