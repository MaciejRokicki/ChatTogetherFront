import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { map, take, tap } from 'rxjs/operators';
import { SnackbarVariant } from 'src/app/components/snackbar/snackbar.data';

import { Room } from 'src/app/entities/Room/room';
import { UpdateRoomModel } from 'src/app/entities/Room/updateRoomModel';
import { Role, User } from 'src/app/entities/user';
import { RoomProvider } from 'src/app/providers/room.provider';
import { SecurityProvider } from 'src/app/providers/security.provider';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { TopbarTitleService } from 'src/app/services/topbarTitle.service';
import { CreateRoomDialogComponent } from '../create-room-dialog/create-room-dialog.component';
import { DeleteRoomDialogComponent } from '../delete-room-dialog/delete-room-dialog.component';
import { EditRoomDialogComponent } from '../edit-room-dialog/edit-room-dialog.component';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.scss']
})
export class RoomsComponent implements OnInit, OnDestroy {
  user: User;
  user$: Subscription = new Subscription();
  
  dataSource: Room[] = []
  displayedColumns = ['name', 'currentPeople', 'maxPeople']

  rooms$: Subscription = new Subscription();

  constructor(
    private roomProvider : RoomProvider,
    private router: Router,
    private topbarTitleService: TopbarTitleService,
    private securityProvider: SecurityProvider,
    private dialog: MatDialog,
    private snackbarService: SnackbarService
  ) {
    this.topbarTitleService.setTitle("Pokoje");
   }

  ngOnInit(): void {
    this.user$ = this.securityProvider.user.pipe(
      tap((user: User) => {
        this.user = user;
        
        if (user.role === Role.ADMINISTRATOR) {
          this.displayedColumns = ['name', 'currentPeople', 'maxPeople', 'action']
        }
      })
    ).subscribe();

    this.roomProvider.getRooms();

    this.rooms$ = this.roomProvider.rooms.pipe(
      tap((rooms: Room[]) => {
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

  public createRoomOpenModal(event: Event) {
    event.preventDefault();
    event.stopPropagation();

    const createRoomDialogRef = this.dialog.open(CreateRoomDialogComponent, {
      width: 'calc(100% - 30px)',
      minWidth: 300,
      maxWidth: 400,
    });

    createRoomDialogRef.afterClosed().subscribe(result => {
      if(result?.showSnackbar) {
        this.snackbarService.open("Pokój został dodany.", 10000, SnackbarVariant.SUCCESS);
      }
    }); 
  }

  public editRoomOpenModal(event: Event, room: UpdateRoomModel) {
    event.preventDefault();
    event.stopPropagation();

    const editRoomDialogRef = this.dialog.open(EditRoomDialogComponent, {
      width: 'calc(100% - 30px)',
      minWidth: 300,
      maxWidth: 400,
      data: <UpdateRoomModel>{
        id: room.id,
        name: room.name,
        maxPeople: room.maxPeople,
      }
    });

    editRoomDialogRef.afterClosed().subscribe(result => {
      if(result?.showSnackbar) {
        this.snackbarService.open("Pokój został zaktualizowany.", 10000, SnackbarVariant.SUCCESS);
      }
    });
  }

  public deleteRoomOpenModal(event: Event, room: UpdateRoomModel) {
    event.preventDefault();
    event.stopPropagation();

    const deleteRoomDialogRef = this.dialog.open(DeleteRoomDialogComponent, {
      width: 'calc(100% - 30px)',
      minWidth: 300,
      maxWidth: 400,
      data: <UpdateRoomModel>{
        id: room.id,
        name: room.name,
        maxPeople: room.maxPeople,
      }
    });

    deleteRoomDialogRef.afterClosed().subscribe(result => {
      if(result?.showSnackbar) {
        this.snackbarService.open("Pokój został usunięty.", 10000, SnackbarVariant.SUCCESS);
      }
    });
  }

  ngOnDestroy(): void {
    this.user$.unsubscribe();
    this.rooms$.unsubscribe();
  }
}
