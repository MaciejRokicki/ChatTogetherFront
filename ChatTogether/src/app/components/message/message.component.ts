import { Component, Input, OnInit } from '@angular/core';

import { Message } from 'src/app/entities/Message/message';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() Message?: Message;
  @Input() LeftDirection: boolean = true;
  readonly url = `${environment.staticUrl}`;

  constructor() { }

  ngOnInit(): void {
    
  }

}
