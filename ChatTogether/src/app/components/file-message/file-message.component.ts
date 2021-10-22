import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageFile } from 'src/app/entities/messageFile';

@Component({
  selector: 'app-file-message',
  templateUrl: './file-message.component.html',
  styleUrls: ['./file-message.component.scss']
})
export class FileMessageComponent implements OnInit {
  @Input() file: MessageFile;
  @Output() removeFile: EventEmitter<MessageFile> = new EventEmitter<MessageFile>();

  constructor() { }

  ngOnInit(): void {
  }

  remove(): void {
    this.removeFile.emit(this.file);
  }

}
