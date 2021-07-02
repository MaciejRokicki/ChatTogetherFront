import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { map, skip } from 'rxjs/operators';
import { ColumnProperty } from 'src/app/components/table/Interfaces/columnProperty';
import { TableData } from 'src/app/components/table/Interfaces/tableData';

import { Room } from 'src/app/entities/room';
import { RoomProvider } from 'src/app/providers/room.provider';
import { TopbarTitleService } from 'src/app/services/topbarTitle.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {

  roomsSub$: Subscription = new Subscription();

  public tableData: TableData = {
    data: [], 
    properties: <ColumnProperty[]>[
      {
        propertyName: 'name',
        displayName: 'Nazwa',
        isNumeric: false
      },
      {
        propertyName: 'currentPeople',
        displayName: 'Użytkownicy',
        isNumeric: true     
      },
      {
        propertyName: 'maxPeople',
        displayName: 'Rozmiar pokoju',
        isNumeric: true     
      }
    ],
    showOrdinalNumbers: true
  };

  constructor(
    private roomProvider : RoomProvider,
    private router: Router,
    private topbarTitleService: TopbarTitleService
  ) { }

  ngOnInit(): void {
    this.topbarTitleService.setTitle("Pokoje");

    this.roomsSub$ = this.roomProvider.rooms.pipe(
      map((rooms: Room[]) => {
        if(rooms.length === 0) {
          this.roomProvider.getRooms();
        }

        console.log(rooms);
        this.tableData.data = rooms;
      })
    ).subscribe();
  }

  public onRowClick(index: number) {
    this.router.navigate(['conversation', this.tableData.data[index].id])
  }

  ngOnDestroy(): void {
    console.log("T");
    this.roomsSub$.unsubscribe();
  }

}
