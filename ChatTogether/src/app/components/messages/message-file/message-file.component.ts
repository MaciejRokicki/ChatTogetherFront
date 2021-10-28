import { Component, Input, OnInit } from '@angular/core';
import { MessageFile } from 'src/app/entities/Message/messageFile';
import { MessageProvider } from 'src/app/providers/message.provider';
import { MessageFileOverlayService } from 'src/app/services/messageFileOverlay.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-message-file',
  templateUrl: './message-file.component.html',
  styleUrls: ['./message-file.component.scss']
})
export class MessageFileComponent implements OnInit {
  @Input() MessageFile: MessageFile;
  readonly url = `${environment.staticUrl}`;
  
  constructor(
    private messageFileOverlayService: MessageFileOverlayService,
    private messageProvider: MessageProvider) 
    { }

  ngOnInit(): void {
  }

  openOverlay(messageFile: MessageFile): void {
    this.messageFileOverlayService.open(messageFile);
  }

  downloadFile(messageFile: MessageFile): void {
    this.messageProvider.downloadFile(messageFile);
  }

}
