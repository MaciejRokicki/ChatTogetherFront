import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UpdateRoomModel } from 'src/app/entities/Room/updateRoomModel';
import { RoomProvider } from 'src/app/providers/room.provider';

@Component({
  selector: 'app-delete-room-dialog',
  templateUrl: './delete-room-dialog.component.html',
  styleUrls: ['./delete-room-dialog.component.scss']
})
export class DeleteRoomDialogComponent implements OnInit {
  deleteRoomForm = new FormGroup({ });

  constructor(
    private dialogRef: MatDialogRef<DeleteRoomDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateRoomModel,
    private roomProvider: RoomProvider) { }

  ngOnInit(): void { }

  close(result?: any): void {
    this.dialogRef.close(result);
  }

  deleteRoom(): void {
    this.roomProvider.deleteRoom(this.data.id);

    this.close({
      showSnackbar: true
    });
  }
}