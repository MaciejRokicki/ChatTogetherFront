import { Component, OnInit } from '@angular/core';

import { map } from 'rxjs/operators';

import { Room } from 'src/app/entities/room';
import { RoomProvider } from 'src/app/providers/room.provider';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  public tableData: Array<Room> = [];
  public columns: Array<string> = [ 'name', 'currentPeople', 'maxPeople' ];

  constructor(private roomProvider : RoomProvider) { }

  ngOnInit(): void {
    this.roomProvider.getRooms();

    this.roomProvider.allRooms.pipe(
      map((result: Room[]) => {
        this.tableData = result;
      })
    ).subscribe();
  }

}
