import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageFileToUpload } from 'src/app/entities/Message/messageFileToUpload';

@Component({
  selector: 'app-file-message',
  templateUrl: './file-message.component.html',
  styleUrls: ['./file-message.component.scss']
})
export class FileMessageComponent implements OnInit {
  @Input() file: MessageFileToUpload;
  @Output() removeFile: EventEmitter<MessageFileToUpload> = new EventEmitter<MessageFileToUpload>();

  constructor() { }

  ngOnInit(): void {
  }

  remove(): void {
    this.removeFile.emit(this.file);
  }

}
