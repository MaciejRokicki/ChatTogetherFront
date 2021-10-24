import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageFileToUpload } from 'src/app/entities/Message/messageFileToUpload';

@Component({
  selector: 'app-message-file-to-upload',
  templateUrl: './message-file-to-upload.component.html',
  styleUrls: ['./message-file-to-upload.component.scss']
})
export class MessageFileToUploadComponent implements OnInit {
  @Input() file: MessageFileToUpload;
  @Output() removeFile: EventEmitter<MessageFileToUpload> = new EventEmitter<MessageFileToUpload>();

  constructor() { }

  ngOnInit(): void {
  }

  remove(): void {
    this.removeFile.emit(this.file);
  }

}
