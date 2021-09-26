import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit, OnChanges {
  @Input() currentPage: number;
  @Input() pageCount: number;
  @Input() dataCount: number;
  @Output() firstPageFunc: EventEmitter<any> = new EventEmitter<any>();
  @Output() previousPageFunc: EventEmitter<any> = new EventEmitter<any>();
  @Output() nextPageFunc: EventEmitter<any> = new EventEmitter<any>();
  @Output() lastPageFunc: EventEmitter<any> = new EventEmitter<any>();

  isPreviousPageButtonDisabled: boolean = true;
  isNextPageButtonDisabled: boolean = false;

  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    this.currentPage = changes["currentPage"] ? changes["currentPage"].currentValue : this.currentPage;
    this.pageCount = changes["pageCount"] ? changes["pageCount"].currentValue : this.pageCount;
    this.dataCount = changes["dataCount"] ? changes["dataCount"].currentValue : this.dataCount;

    if (this.currentPage === this.pageCount) {
      this.isNextPageButtonDisabled = true;
    } else {
      this.isNextPageButtonDisabled = false;
    }

    if (this.currentPage === 1) {
      this.isPreviousPageButtonDisabled = true;
    } else {
      this.isPreviousPageButtonDisabled = false;
    }
  }

  ngOnInit(): void { }

  firstPage(): void {
    this.firstPageFunc.emit();
  }

  previousPage(): void {
    this.previousPageFunc.emit();
  }

  nextPage(): void {
    this.nextPageFunc.emit();
  }

  lastPage(): void {
    this.lastPageFunc.emit();
  }
}
