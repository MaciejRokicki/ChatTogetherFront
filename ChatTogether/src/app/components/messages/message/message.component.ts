import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Message } from 'src/app/entities/Message/message';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarVariant } from '../../snackbar/snackbar.data';
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
  constructor(private dialog: MatDialog, private snackbarService: SnackbarService) { }

  ngOnInit(): void {
    
  }

  public deleteMessageOpenDialog(event: Event, message: Message) {
    event.preventDefault();
    event.stopPropagation();

    const editRoomDialogRef = this.dialog.open(DeleteMessageDialogComponent, {
      data: message
    });

    editRoomDialogRef.afterClosed().subscribe(result => {
      if(result?.showSnackbar) {
        this.snackbarService.open("Wiadomość została usunięta.", 3000, SnackbarVariant.SUCCESS);
      }
    });
  }

}
