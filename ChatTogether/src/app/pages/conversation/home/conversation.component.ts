import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import {MDCTextField} from '@material/textfield';
import {MDCRipple} from '@material/ripple';

import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { Message } from 'src/app/entities/message';
import { MessageProvider } from 'src/app/providers/message.provider';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss']
})
export class ConversationComponent implements OnInit, OnDestroy {
  @ViewChild('scroll') messagesContent!: ElementRef;

  id: number = 0;
  private id$ = new Subscription();

  messages: Message[] =  []

  msgText: string = '';

  constructor(
    private route: ActivatedRoute,
    private messageProvider: MessageProvider,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.id$ = this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
    });

    console.log(this.id);

    const textField = new MDCTextField(document.querySelector('.mdc-text-field') as Element);

    const iconButtonRipple = new MDCRipple(document.querySelector('.mdc-icon-button') as Element);
    iconButtonRipple.unbounded = true;

    this.messageProvider.getMessages();
    this.messageProvider.messages$.pipe(
      map((data: Message[]) => {
        this.messages = data;
      })
    ).subscribe();
  }

  ngAfterViewInit() {
    this.messagesContent.nativeElement.scrollTop = this.messagesContent.nativeElement.scrollHeight;
  }

  onSubmit() {
    var message: Message = new Message(0, 'Ja', new Date(), this.msgText);
    
    this.messageProvider.sendMessage(message);

    this.msgText = '';

    this.ref.detectChanges();

    var currentScrollPos = this.messagesContent.nativeElement.scrollTop;
    var scrollHeight = this.messagesContent.nativeElement.scrollHeight;
    var offsetHeight = this.messagesContent.nativeElement.offsetHeight;
    var maxScrollPos = scrollHeight - offsetHeight;
    var lastMessageHeight = this.messagesContent.nativeElement['lastElementChild']['clientHeight'];

    if(maxScrollPos - currentScrollPos == lastMessageHeight) {
      this.messagesContent.nativeElement.scrollTop = this.messagesContent.nativeElement.scrollHeight;
    } else {
      //ikonka do przewiajania na sam dol i z info ze sa nowe wiadomosci
    }   
  }

  ngOnDestroy() {
    this.id$.unsubscribe();
  }

}
