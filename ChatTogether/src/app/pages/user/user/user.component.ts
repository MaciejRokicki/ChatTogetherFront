import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TopbarTitleService } from 'src/app/services/topbarTitle.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  nickname: string;

  constructor(
    private route: ActivatedRoute,
    private topbarTitleService: TopbarTitleService
    ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.nickname = params['nickname'];
    })

    this.topbarTitleService.setTitle(this.nickname);
  }

}
