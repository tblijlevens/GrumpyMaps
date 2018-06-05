import { Component, OnInit, Input } from '@angular/core';
import { Square } from '../domain/square';
import { DnDMap } from '../domain/dn-dmap';
import { MapDetailComponent } from '../map-detail/map-detail.component';
import { SquareDetailComponent } from '../square-detail/square-detail.component';
import {SquareDetailShareService} from '../square-detail-share.service';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {

    @Input()
    squareScale:string;

    @Input()
    square:Square;

    squareStyles = {};

  constructor(private squareDetailShareService: SquareDetailShareService) { }

  ngOnInit() {
      this.squareStyles = {
          'width': this.squareScale,
          'height': this.squareScale,
      }
  }

  selectSquare(){
      console.log(this.square.id);
      this.squareDetailShareService.setSquare(this.square);
/*      this.squareStyles = {
          'background-color': 'green',
          'width': this.squareScale,
          'height': this.squareScale
      }*/
  }

}
