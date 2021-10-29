import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { BehaviorSubject, fromEvent, of, Subscription } from 'rxjs';
import { debounceTime, map, mergeMap, skip, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment.prod'

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
import { FilesToUpload } from 'src/app/entities/Room/filesToUpload';
import { SnackbarService } from 'src/app/services/snackbar.service';
import { SnackbarVariant } from 'src/app/components/snackbar/snackbar.data';

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

  scroll$: Subscription = new Subscription();
  showScrollDownButton: boolean = false;
  loadNextMessages: boolean = true;
  stopScroll: boolean;

  height: number;

  outOfMessages: boolean;
  noMessages: boolean;

  showOnDragOverMessageContainerInfo: boolean = false;
  filesToUpload: FilesToUpload = new FilesToUpload();

  formData: FormData = new FormData();
  messageFiles: MessageFile[] = [];
  messageFiles$: Subscription = new Subscription();
  resultMessageFiles$: Subscription = new Subscription();

  constructor(
    private route: ActivatedRoute,
    private securityProvider: SecurityProvider,
    private roomProvider: RoomProvider,
    private messageProvider: MessageProvider,
    private ref: ChangeDetectorRef,
    private topbarTitleService: TopbarTitleService,
    private snackBarService: SnackbarService
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
    let firstInit: boolean = false;

    const observer = new MutationObserver((mutations: MutationRecord[]) => {
      const messages = this.messagesContent.nativeElement.children;       //wszystkie elementy app-message
      var scrollHeight = this.messagesContent.nativeElement.scrollHeight; //rozmiar scrolla calego messageContentu (roznica jest wysokosc buttona do scrollowania w dol)
      var heightAllMessages = 0;                                          //wysokosc wszystkich elementow app-message

      if (!firstInit) {
        this.checkLoadedData();
        firstInit = true;
      }

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

  onLoadedData(): void {
    this.scrollDown();
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

    if (this.filesToUpload.files.length > 0) {
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
    this.filesToUpload.clear();
    this.formData = new FormData();

    this.ref.detectChanges();
  }

  onDropMessageContainer(event) {
    event.preventDefault();
    
    this.showOnDragOverMessageContainerInfo = false;

    for(let file of event.dataTransfer.files) {
      if (this.checkElementType(file)) {
        this.addFile(file);
      } else {
        this.snackBarService.open("Nieobsługiwany format pliku/plików.", 5000, SnackbarVariant.INFO);
      }
    }
  }

  checkElementType(item: DataTransferItem): boolean {
    if(environment.allowedFiles.includes(item.type)) {
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

  addFile(file: File) {
    if(this.filesToUpload.totalSize + file.size > environment.maxFilesSize) {
      this.snackBarService.open("W jednej wiadomości możesz przesłać pliki, których łączny rozmiar wynosi maksymalnie 20MB.", 5000, SnackbarVariant.INFO);
      return;
    }

    let fr = new FileReader();
    fr.readAsDataURL(file);

    fr.onload = () => {
      this.filesToUpload.files.push(new MessageFileToUpload(
        file.name,
        file.type,
        file.size,
        fr.result.toString()
      ));

      this.filesToUpload.totalSize += file.size;
    }

    this.formData.append(file.name, file);
  }

  removeFile(file: MessageFileToUpload) {
    this.filesToUpload.files = this.filesToUpload.files.filter(item => {
      if(item !== file) {
        return true;
      }

      this.filesToUpload.totalSize -= file.size;
      this.formData.delete(file.name);
      return false;
    });
  }

  validMessageForm(): boolean {
    return this.messageForm.valid || this.filesToUpload.files.length > 0;
  }

  checkLoadedData(): void {
    let isLoadedCounter: BehaviorSubject<number> = new BehaviorSubject<number>(0);

    const img = document.querySelectorAll("img");
    let imgCounter = 0;

    const video = document.querySelectorAll("video");
    let videoCounter = 0;

    for (let i = 0; i < img.length; i++) {
      img[i].addEventListener("load", function imgLoad() {
        if (++imgCounter === img.length) {
          isLoadedCounter.next(isLoadedCounter.value + 1);
        }

        img[i].removeEventListener("load", imgLoad);
      });
    }

    for (let i = 0; i < video.length; i++) {
      video[i].addEventListener("loadeddata", function videoLoaded() {
        if (++videoCounter === video.length) {
          isLoadedCounter.next(isLoadedCounter.value + 1);
        }

        video[i].removeEventListener("loadeddata", videoLoaded);
      });
    }

    isLoadedCounter.pipe(
      tap((value: number) => {
        if (value === 2) {
          this.onLoadedData();
          isLoadedCounter.unsubscribe();
        }
      })
    ).subscribe();
  }

  ngOnDestroy() {
    this.messageProvider.clearMessages();
    this.roomProvider.onRoomExit(this.id);
    this.roomSub$.unsubscribe();
    this.observer.disconnect();
    this.messages$.unsubscribe();
    this.scroll$.unsubscribe();
    this.user$.unsubscribe();
    this.messageFiles$.unsubscribe();
    this.resultMessageFiles$.unsubscribe();
  }
}