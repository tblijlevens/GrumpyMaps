import { Component, OnInit, Input } from '@angular/core';
import { Square } from '../domain/square';
import { DnDMap } from '../domain/dn-dmap';
import { MapDetailComponent } from '../map-detail/map-detail.component';
import { SquareDetailComponent } from '../square-detail/square-detail.component';
import {MapShareService} from '../map-share.service';

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

    @Input()
    obstructionMode:boolean = false;

    squareStyles = {};

  constructor(private squareDetailShareService: MapShareService) { }

  ngOnInit() {
    this.squareDetailShareService.squareBorderStyleUpdated.subscribe(squareBorderStyle => this.squareStyles['border'] = squareBorderStyle);
    this.squareDetailShareService.obstructionModeUpdated.subscribe(obstructionMode => this.obstructionMode = obstructionMode);
      this.squareStyles = {
          'width': this.squareScale,
          'height': this.squareScale,
      }
  }

  selectSquare(){
      this.squareDetailShareService.setSquare(this.square);
      var isObstructed = this.square.obstructed;
      if (this.obstructionMode){
          if (isObstructed == false){
              this.square.obstructed = true;
              this.squareStyles['background-color'] = 'rgba(161, 0, 0, 0.35)';
          }
          else{
              this.square.obstructed = false;
              this.squareStyles['background-color'] = 'rgba(161, 0, 0, 0)';
          }
      }
  }

}
