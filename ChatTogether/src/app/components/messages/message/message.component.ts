import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Message } from 'src/app/entities/Message/message';
import { DeleteMessageDialogComponent } from '../delete-message-dialog/delete-message-dialog.component';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() Message?: Message;
  @Input() LeftDirection: boolean = true;
  @Input() PermissionToDeleteMessage: boolean = false;
  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    
  }

  public deleteMessageOpenDialog(event: Event, message: Message) {
    event.preventDefault();
    event.stopPropagation();

    this.dialog.open(DeleteMessageDialogComponent, {
      data: message
    });
  }

}
