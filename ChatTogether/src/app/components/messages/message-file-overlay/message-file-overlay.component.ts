import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MessageFile } from 'src/app/entities/Message/messageFile';
import { MessageProvider } from 'src/app/providers/message.provider';
import { MessageFileOverlayService } from 'src/app/services/messageFileOverlay.service';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-message-file-overlay',
  templateUrl: './message-file-overlay.component.html',
  styleUrls: ['./message-file-overlay.component.scss']
})
export class MessageFileOverlayComponent implements OnInit {
  readonly url = `${environment.staticUrl}/`;

  messageFile: MessageFile = null;
  messageFile$: Subscription = new Subscription();

  constructor(
    private messageFileOverlayService: MessageFileOverlayService,
    private messageProvider: MessageProvider) { }

  ngOnInit(): void {
    this.messageFile$ = this.messageFileOverlayService.messageFile.pipe(
      tap((messageFile: MessageFile) => {
        this.messageFile = messageFile;
      })
    ).subscribe();
  }

  downloadFile(messageFile: MessageFile): void {
    this.messageProvider.downloadFile(messageFile);
  }

  closeOverlay(): void {
    this.messageFileOverlayService.close();
  }
}
