import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { tap } from 'rxjs/operators';
import { Result, ResultStage } from 'src/app/entities/result';
import { UpdateRoomModel } from 'src/app/entities/Room/updateRoomModel';
import { RoomProvider } from 'src/app/providers/room.provider';
import { FormControlStateMatcher } from 'src/app/utils/formControlStateMatcher';

@Component({
  selector: 'app-edit-room-dialog',
  templateUrl: './edit-room-dialog.component.html',
  styleUrls: ['./edit-room-dialog.component.scss']
})
export class EditRoomDialogComponent implements OnInit {
  editRoomForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    maxPeople: new FormControl('', [Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)])
  });

  invalidFormMatcher = new FormControlStateMatcher();

  disabledEditButton: boolean = false;

  constructor(
    private dialogRef: MatDialogRef<EditRoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateRoomModel,
    private roomProvider: RoomProvider) { }

  ngOnInit(): void {
    this.editRoomForm.setValue({
      name: this.data.name,
      maxPeople: this.data.maxPeople
    })
  }

  close(result?: any): void {
    this.dialogRef.close(result);
  }

  editRoom(): void {
    let name: string = this.editRoomForm.get('name').value
    let maxPeople: number = Number.parseInt(this.editRoomForm.get('maxPeople').value)

    let room = <UpdateRoomModel>{
      id: this.data.id,
      name: name,
      maxPeople: maxPeople
    };

    this.roomProvider.updateRoom(room);

    this.roomProvider.resultUpdateRoom.pipe(
      tap((result: Result) => {
        switch (result.Stage) {
          case ResultStage.WAITING:
              this.disabledEditButton = true;
            break;

          case ResultStage.SUCCESS:
              this.close({
                showSnackbar: true
              });
              this.disabledEditButton = false;
            break;

          case ResultStage.ERROR:
              this.close({
                showSnackbar: false,
                success: false
              });
              this.disabledEditButton = false;
            break;
        }
      })
    ).subscribe();
  }
}