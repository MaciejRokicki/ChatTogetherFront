import { Component, Input, OnInit } from '@angular/core';

import { Message } from 'src/app/entities/message';

@Component({
  selector: 'app-message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss']
})
export class MessageComponent implements OnInit {

  @Input() Message?: Message;
  @Input() LeftDirection: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}
