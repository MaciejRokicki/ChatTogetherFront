import { Component, Input, OnInit } from '@angular/core';
import { MessageFile } from 'src/app/entities/Message/messageFile';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-message-file',
  templateUrl: './message-file.component.html',
  styleUrls: ['./message-file.component.scss']
})
export class MessageFileComponent implements OnInit {
  @Input() MessageFile: MessageFile;
  readonly url = `${environment.staticUrl}`;
  
  constructor() { }

  ngOnInit(): void {
  }

}
