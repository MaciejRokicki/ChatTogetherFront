import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { map } from 'rxjs/operators';

import { Room } from 'src/app/entities/room';
import { RoomProvider } from 'src/app/providers/room.provider';
import { TopbarTitleService } from 'src/app/services/topbarTitle.service';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, OnDestroy {
  dataSource: Room[] = []
  displayedColumns = ['name', 'currentPeople', 'maxPeople']

  roomsSub$: Subscription = new Subscription();

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
        
        this.dataSource = rooms;
      })
    ).subscribe();
  }

  public onRowClick(room: Room) {
    if(room.currentPeople >= room.maxPeople) {
      return;
    }

    this.router.navigate(['room', room.id])
  }

  ngOnDestroy(): void {
    this.roomsSub$.unsubscribe();
  }

}
