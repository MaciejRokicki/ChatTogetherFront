import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { map } from 'rxjs/operators';
import { ColumnProperty } from 'src/app/components/table/Interfaces/columnProperty';
import { TableData } from 'src/app/components/table/Interfaces/tableData';

import { Room } from 'src/app/entities/room';
import { RoomProvider } from 'src/app/providers/room.provider';
import { TopbarTitleService } from 'src/app/services/topbarTitle.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, OnDestroy {

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
  ) {
    this.topbarTitleService.setTitle("Pokoje");
   }

  ngOnInit(): void {
    this.roomsSub$ = this.roomProvider.rooms.pipe(
      map((rooms: Room[]) => {
        if(rooms.length === 0) {
          this.roomProvider.getRooms();
        }
        
        this.tableData.data = rooms;
      })
    ).subscribe();
  }

  public onRowClick(index: number) {
    let room = this.tableData.data[index];
    if(room.currentPeople >= room.maxPeople) {
      return;
    }

    this.router.navigate(['room', room.id])
  }

  ngOnDestroy(): void {
    this.roomsSub$.unsubscribe();
  }

}
