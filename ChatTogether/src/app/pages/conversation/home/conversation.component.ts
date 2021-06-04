import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import {MDCTextField} from '@material/textfield';
import {MDCRipple} from '@material/ripple';

import { fromEvent, of, Subscription } from 'rxjs';
import { debounceTime, map, mergeMap, tap } from 'rxjs/operators';

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
  id$: Subscription = new Subscription();

  observer: MutationObserver = new MutationObserver(()=>{});

  messages: Message[] = []
  messages$: Subscription = new Subscription();
  msgText: string = '';

  scroll$: Subscription = new Subscription();
  showScrollDownButton: boolean = false;
  loadNextMessages: boolean = true;

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
    
    const height = (document.querySelector('.messagesContent') as Element).clientHeight;
    const messagesCount = Math.ceil(height / 71 * 2);

    const textField = new MDCTextField(document.querySelector('.mdc-text-field') as Element);

    const iconButtonRipple = new MDCRipple(document.querySelector('.mdc-icon-button') as Element);
    iconButtonRipple.unbounded = true;

    this.messageProvider.getMessages(undefined, messagesCount);
    this.messages$ = this.messageProvider.messages$.pipe(
      map((data: Message[]) => {
        this.messages = data;
      })
    ).subscribe();

    this.scroll$ = fromEvent(document.querySelector('.messagesContent') as Element, 'scroll').pipe(
      mergeMap(() => {
        var currentScrollPos = this.messagesContent.nativeElement.scrollTop;
        var scrollHeight = this.messagesContent.nativeElement.scrollHeight;
        var offsetHeight = this.messagesContent.nativeElement.offsetHeight;

        var maxScrollPos = scrollHeight - offsetHeight; 

        return of({
          currentScrollPos,
          scrollHeight,
          offsetHeight,
          maxScrollPos
        });
      }),
      tap((scroll) => {
        // przycisk do scrollowania w dol
        if(scroll.maxScrollPos - scroll.currentScrollPos >= 50) {
          this.showScrollDownButton = true;
        } else {
          this.showScrollDownButton = false;
        } 
      }),
      debounceTime(500),
      tap((scroll) => {
        // moment, w ktorym scroll jest na samej gorze
        if(this.loadNextMessages && scroll.maxScrollPos - scroll.currentScrollPos >= scroll.maxScrollPos) {
          this.messageProvider.getMessages(this.messages[0].Time);
        }
      })
    ).subscribe();
  }

  ngAfterViewInit() {
    this.messagesContent.nativeElement.scrollTop = this.messagesContent.nativeElement.scrollHeight;

    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      var height = 0;
      mutations.filter((mutation: MutationRecord) => {
        if((mutation.addedNodes[0] as Element).localName === 'app-message') {
          return true;
        }

        return false;
      }).forEach((mutation: MutationRecord) => {        
        height += (mutation.addedNodes[0] as Element).clientHeight;
      })

      this.messagesContent.nativeElement.scrollTop = height;
    });
    
    observer.observe(document.querySelector('.messagesContent') as Element, {
      attributes: true,
      childList: true,
      characterData: true
    });
  }

  scrollDown() {
    this.messagesContent.nativeElement.scrollTop = this.messagesContent.nativeElement.scrollHeight;
  }

  onSubmit() {
    var message: Message = new Message(0, 'Ja', new Date(), this.msgText);
    this.messageProvider.sendMessage(message);
    this.msgText = '';

    this.ref.detectChanges();

    // var currentScrollPos = this.messagesContent.nativeElement.scrollTop;
    var scrollHeight = this.messagesContent.nativeElement.scrollHeight;
    //var offsetHeight = this.messagesContent.nativeElement.offsetHeight;
    // var maxScrollPos = scrollHeight - offsetHeight;
    // var lastMessageHeight = this.messagesContent.nativeElement.children[this.messagesContent.nativeElement.children.length-2].clientHeight;

    const messages = this.messagesContent.nativeElement.children;
    var height = 0;

    for(let i = 0; i < messages.length; i++) {
      height += messages[i].clientHeight;
    }

    //console.log(`${height} - ${scrollHeight}`);

    // if(height <= scrollHeight || maxScrollPos - currentScrollPos <= offsetHeight) {
    if(height <= scrollHeight) {
      this.messagesContent.nativeElement.scrollTop = this.messagesContent.nativeElement.scrollHeight;
    }  
  }

  ngOnDestroy() {
    this.id$.unsubscribe();
    this.observer.disconnect();
    this.messages$.unsubscribe();
    this.scroll$.unsubscribe();
  }

}