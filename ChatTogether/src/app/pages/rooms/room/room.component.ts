import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { MDCTextField } from '@material/textfield';
import { MDCRipple } from '@material/ripple';

import { fromEvent, of, Subscription } from 'rxjs';
import { debounceTime, map, mergeMap, skip, tap } from 'rxjs/operators';

import { Message } from 'src/app/entities/message';
import { MessageProvider } from 'src/app/providers/message.provider';
import { RoomProvider } from 'src/app/providers/room.provider';
import { TopbarTitleService } from 'src/app/services/topbarTitle.service';
import { Room } from 'src/app/entities/room';
import { SecurityProvider } from 'src/app/providers/security.provider';
import { User } from 'src/app/entities/user';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  @ViewChild('scroll') messagesContent!: ElementRef;

  id: number = 0;

  userNickname: string;
  user$: Subscription = new Subscription();

  room: Room;
  roomSub$: Subscription = new Subscription();

  observer: MutationObserver = new MutationObserver(()=>{});

  messages: Message[] = []
  messages$: Subscription = new Subscription();
  msgText: string = '';

  scroll$: Subscription = new Subscription();
  showScrollDownButton: boolean = false;
  loadNextMessages: boolean = true;
  stopScroll: boolean;

  height: number;

  constructor(
    private route: ActivatedRoute,
    private securityProvider: SecurityProvider,
    private roomProvider: RoomProvider,
    private messageProvider: MessageProvider,
    private ref: ChangeDetectorRef,
    private topbarTitleService: TopbarTitleService
  ) { 
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
    }).unsubscribe();

    this.roomProvider.getRoom(this.id);
    this.roomSub$ = this.roomProvider.room.pipe(
      tap((room: Room) => {
          this.room = room;
          this.topbarTitleService.setTitle(this.room.name);
      })
    ).subscribe();
  }

  ngOnInit(): void {
    this.securityProvider.user.pipe(
      tap((user: User) => {
        this.userNickname = user.nickname
      })
    ).subscribe();

    this.roomProvider.onRoomEnter(this.id);
    this.messageProvider.setListeningOnNewMessages();

    const height = (document.querySelector('.messagesContent') as Element).clientHeight;
    const messagesCount = Math.ceil(height / 71 * 2);

    this.messageProvider.getMessages(this.id, messagesCount);
    this.messages$ = this.messageProvider.messages.pipe(
      skip(1),
      map((data: Message[]) => {
        if(data.length !== 0 && data.length === this.messages.length) {
          this.stopScroll = false;
          console.log("OUT"); //TODO: jakies info ze nie ma juz wiecej wiadomosci do pobrania
        } 
        if (data.length === 0) {
          console.log("NULL") //TODO: jakies info zeby cos napisac bo nie ma wiadomosci
        }
        this.messages = data;
      })
    ).subscribe();

    const textField = new MDCTextField(document.querySelector('.mdc-text-field') as Element);

    const iconButtonRipple = new MDCRipple(document.querySelector('.mdc-icon-button') as Element);
    iconButtonRipple.unbounded = true;

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
          this.messageProvider.getMessages(this.id, undefined, new Date(this.messages[0].receivedTime));
          this.stopScroll = true;
        }
      })
    ).subscribe();
  }

  ngAfterViewInit() {
    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      const messages = this.messagesContent.nativeElement.children;       //wszystkie elementy app-message
      var scrollHeight = this.messagesContent.nativeElement.scrollHeight; //rozmiar scrolla calego messageContentu (roznica jest wysokosc buttona do scrollowania w dol)
      var heightAllMessages = 0;                                          //wysokosc wszystkich elementow app-message

      for(let i = 0; i < messages.length; i++) {
        heightAllMessages += messages[i].clientHeight;
      }

      //jak scroll jest na samym dole, to przy nowych wiadomosciach, niech nadal pozostaje na samym dole
      if(heightAllMessages <= scrollHeight) {
        this.messagesContent.nativeElement.scrollTop = scrollHeight;
      }

      //po zaladaowaniu nowych wiadomosci, ustawia scroll w miejscu ostatniej wiadomosci przed wczytaniem
      if(this.stopScroll) {
        var heightNewMessages = 0;

        //elementy, ktore sa wiadomosciami (app-message)
        mutations.filter((mutation: MutationRecord) => {
          if((mutation.addedNodes[0] as Element).localName === 'app-message') {
            return true;
          }
  
          return false;
        }).forEach((mutation: MutationRecord) => {        
          heightNewMessages += (mutation.addedNodes[0] as Element).clientHeight; //sumowanie wysokosci wszystkich nowych wiadomosci
        })

        this.messagesContent.nativeElement.scrollTop = heightNewMessages; //ustawienia scrolla
        this.stopScroll = false; //moment, w ktorym scroll jest na samej gorze
      }
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
    var message: Message = new Message(this.msgText, this.userNickname, this.id, new Date());
    this.messageProvider.sendMessage(message);
    this.msgText = '';

    this.ref.detectChanges();
  }

  ngOnDestroy() {
    this.messageProvider.clearMessages();
    this.roomProvider.onRoomExit(this.id);
    this.roomSub$.unsubscribe();
    this.observer.disconnect();
    this.messages$.unsubscribe();
    this.scroll$.unsubscribe();
  }
}