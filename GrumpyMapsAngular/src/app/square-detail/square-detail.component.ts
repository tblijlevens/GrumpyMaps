import { Component, OnInit, Input } from '@angular/core';
import {SquareDetailShareService} from '../square-detail-share.service';
import { Square } from '../domain/square';


@Component({
  selector: 'app-square-detail',
  templateUrl: './square-detail.component.html',
  styleUrls: ['./square-detail.component.css']
})
export class SquareDetailComponent implements OnInit {

    square:Square;
  constructor(private squareDetailShareService: SquareDetailShareService) { }

  ngOnInit() {
      this.squareDetailShareService.squareUpdated.subscribe(square => this.square =square);
//      this.squareId = this.squareDetailShareService.squareId;
  }

}
