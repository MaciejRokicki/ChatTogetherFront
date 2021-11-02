import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Message } from 'src/app/entities/Message/message';
import { MessageProvider } from 'src/app/providers/message.provider';

@Component({
  selector: 'app-delete-message-dialog',
  templateUrl: './delete-message-dialog.component.html',
  styleUrls: ['./delete-message-dialog.component.scss']
})
export class DeleteMessageDialogComponent implements OnInit {
  deleteMessageForm = new FormGroup({ });

  constructor(
    private dialogRef: MatDialogRef<DeleteMessageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Message,
    private messageProvider: MessageProvider) { }

  ngOnInit(): void { }

  close(result?: any): void {
    this.dialogRef.close(result);
  }

  deleteMessage(): void {
    this.messageProvider.deleteMessage(this.data.roomId, this.data.id);
    this.close({
      showSnackbar: true
    });
  }
}
