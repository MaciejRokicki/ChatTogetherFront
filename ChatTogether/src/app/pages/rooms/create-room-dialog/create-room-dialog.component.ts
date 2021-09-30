import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Result, ResultStage } from 'src/app/entities/result';
import { CreateRoomModel } from 'src/app/entities/Room/createRoomModel';
import { RoomProvider } from 'src/app/providers/room.provider';
import { FormControlStateMatcher } from 'src/app/utils/formControlStateMatcher';

@Component({
  selector: 'app-create-room-dialog',
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.scss']
})
export class CreateRoomDialogComponent implements OnInit {
  createRoomForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    maxPeople: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])
  });

  invalidFormMatcher = new FormControlStateMatcher();

  constructor(
    private dialogRef: MatDialogRef<CreateRoomDialogComponent>,
    private roomProvider: RoomProvider) { }

  ngOnInit(): void { }

  close(result?: any): void {
    this.dialogRef.close(result);
  }

  createRoom(): void {
    let name: string = this.createRoomForm.get('name').value
    let maxPeople: number = Number.parseInt(this.createRoomForm.get('maxPeople').value)

    let room = <CreateRoomModel>{
      name: name,
      maxPeople: maxPeople
    };

    this.roomProvider.createRoom(room);

    this.roomProvider.resultCreateRoom.pipe(
      tap((result: Result) => {
        switch (result.Stage) {
          case ResultStage.WAITING:
            
            break;

          case ResultStage.SUCCESS:
            this.close({
              showSnackbar: true
            });
            break;

          case ResultStage.ERROR:
            this.close({
              showSnackbar: false,
              success: false
            })
            break;
        }
      })
    ).subscribe();
  }
}