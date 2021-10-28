import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { fromEvent, of, Subscription } from 'rxjs';
import { debounceTime, map, mergeMap, skip, subscribeOn, take, takeLast, tap } from 'rxjs/operators';

import { Message } from 'src/app/entities/Message/message';
import { MessageProvider } from 'src/app/providers/message.provider';
import { RoomProvider } from 'src/app/providers/room.provider';
import { TopbarTitleService } from 'src/app/services/topbarTitle.service';
import { Room } from 'src/app/entities/Room/room';
import { SecurityProvider } from 'src/app/providers/security.provider';
import { User } from 'src/app/entities/user';
import { FormControl, FormGroup } from '@angular/forms';
import { MessageFileToUpload } from 'src/app/entities/Message/messageFileToUpload';
import { MessageFile } from 'src/app/entities/Message/messageFile';
import { Result, ResultStage } from 'src/app/entities/result';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit, OnDestroy {
  @ViewChild('scroll') messagesContent!: ElementRef;
  messageForm = new FormGroup({
    message: new FormControl('', [])
  });

  id: number = 0;

  userNickname: string;
  user$: Subscription = new Subscription();

  room: Room;
  roomSub$: Subscription = new Subscription();

  observer: MutationObserver = new MutationObserver(()=>{});

  message: Message;
  messages: Message[] = []
  messages$: Subscription = new Subscription()
  resultMessages$: Subscription = new Subscription();

  scroll$: Subscription = new Subscription();
  showScrollDownButton: boolean = false;
  loadNextMessages: boolean = true;
  stopScroll: boolean;

  height: number;

  outOfMessages: boolean;
  noMessages: boolean;

  showOnDragOverMessageContainerInfo: boolean = false;
  filesToUpload: MessageFileToUpload[] = [];
  formData: FormData = new FormData();
  messageFiles: MessageFile[] = [];
  messageFiles$: Subscription = new Subscription();
  resultMessageFiles$: Subscription = new Subscription();

  firstInitPage: boolean = true;

  showSpinner: boolean = false;

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
        if (user) {
          this.userNickname = user.nickname
        }
      })
    ).subscribe();

    this.roomProvider.onRoomEnter(this.id);
    this.messageProvider.setListeningOnNewMessages();

    const height = (document.querySelector('.messages-content') as Element).clientHeight;
    const messagesCount = Math.ceil(height / 71 * 2);

    this.messageProvider.getMessages(this.id, messagesCount);
    this.messages$ = this.messageProvider.messages.pipe(
      skip(1),
      map((data: Message[]) => {
        if(data.length !== 0 && data.length === this.messages.length) {
          this.stopScroll = false;
          this.outOfMessages = true;
        } 
        if (data.length === 0) {
          this.noMessages = true;
        } else {
          this.noMessages = false;
        }
        
        this.messages = data;
      })
    ).subscribe();

    this.scroll$ = fromEvent(document.querySelector('.messages-content') as Element, 'scroll').pipe(
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

    //na chromium dragleave wywolywalo sie na dragover, a na firefoxie odwrotnie
    let browserDragFixCounter = 0;

    document.addEventListener("dragenter", () => {
      browserDragFixCounter++;
    });

    document.addEventListener("dragover", (event) => {
      event.preventDefault();
      
      if(!event.target["classList"]?.contains("dropzone")) {
        event.dataTransfer.effectAllowed = "none";
        event.dataTransfer.dropEffect = "none";
      }

      browserDragFixCounter = 1;

      this.showOnDragOverMessageContainerInfo = true;
    });

    document.addEventListener("dragleave", (event) => {
      event.preventDefault();
      browserDragFixCounter--;

      if(browserDragFixCounter === 0) {
        this.showOnDragOverMessageContainerInfo = false;
      }
    });

    this.messageFiles$ = this.messageProvider.messageFiles.pipe(
      tap((messageFiles: MessageFile[]) => {
        this.messageFiles = messageFiles;
      })
    ).subscribe();

    this.messageProvider.resultMessageFiles.pipe(
      tap((result: Result) => {
        switch (result.Stage) {
          case ResultStage.WAITING:
            
            break;

          case ResultStage.SUCCESS:
            if (this.message) {
              this.message.files = this.messageFiles;
              
              this.afterSubmit();
            }
            break;

          case ResultStage.ERROR:

            break;
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
    
    observer.observe(document.querySelector('.messages-content') as Element, {
      attributes: true,
      childList: true,
      characterData: true
    });
  }

  scrollDown() {
    this.messagesContent.nativeElement.scrollTop = this.messagesContent.nativeElement.scrollHeight;
  }

  onSubmit() {
    this.message = new Message(
      this.messageForm.get('message').value, 
      this.userNickname, 
      this.id, 
      new Date()
    );

    if (this.filesToUpload.length > 0) {
      this.messageProvider.uploadMessageFiles(this.formData);
    } else {
      this.afterSubmit();
    }
  }

  afterSubmit(): void {
    this.messageProvider.sendMessage(this.message);
        
    this.messageForm.setValue({
      'message': ''
    })
    this.filesToUpload = [];
    this.formData = new FormData();

    this.ref.detectChanges();
  }

  onDropMessageContainer(event) {
    event.preventDefault();
    
    this.showOnDragOverMessageContainerInfo = false;

    for(let file of event.dataTransfer.files) {
      if (this.checkElementType(file)) {
        this.addFile(file);
      }
    }
  }

  private checkElementType(item: DataTransferItem): boolean {
    if(item.type.includes("image/") || item.type.includes("video/") || item.type.includes("text/plain")) {
      return true;
    }

    return false;
  }

  openFileBrowser(): void {
    document.getElementById("input-file").click();
  }

  onFileAddFromFileBrowser(event): void {
    for (let file of event.target.files) {
      this.addFile(file);
    }
  }

  private addFile(file: File) {
    let fr = new FileReader();
    fr.readAsDataURL(file);

    fr.onload = () => {
      this.filesToUpload.push(new MessageFileToUpload(
        file["name"],
        file["type"],
        fr.result.toString()
      ));
    }

    this.formData.append(file.name, file);
  }

  public removeFile(file: MessageFileToUpload) {
    this.filesToUpload = this.filesToUpload.filter(item => item !== file);
  }

  validMessageForm(): boolean {
    return this.messageForm.valid || this.filesToUpload.length > 0;
  }

  ngOnDestroy() {
    this.messageProvider.clearMessages();
    this.roomProvider.onRoomExit(this.id);
    this.roomSub$.unsubscribe();
    this.observer.disconnect();
    this.messages$.unsubscribe();
    this.resultMessages$.unsubscribe();
    this.scroll$.unsubscribe();
    this.user$.unsubscribe();
    this.messageFiles$.unsubscribe();
    this.resultMessageFiles$.unsubscribe();
  }
}