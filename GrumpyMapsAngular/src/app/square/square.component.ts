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

    obstructionMode:boolean = false;

    squareStyles = {};
    playerDotStyle = {};

  constructor(private mapShareService: MapShareService) { }

  ngOnInit() {
    this.mapShareService.squareBorderStyleUpdated.subscribe(squareBorderStyle => this.squareStyles['border'] = squareBorderStyle);
    this.mapShareService.obstructionModeUpdated.subscribe(obstructionMode => this.obstructionMode = obstructionMode);
    this.mapShareService.rangeSquaresUpdated.subscribe(rangeSquares => this.setRangeSquareStyles());
    this.squareStyles = {
        'width': this.squareScale,
        'height': this.squareScale,
    }
  }

  selectSquare(){
      this.mapShareService.setSquare(this.square);
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

  private setRangeSquareStyles(){
      if (!this.square.obstructed){
          if (this.square.inRange){
              this.squareStyles['background-color'] = 'rgba(8, 161, 0, 0.35)';
          }
          else{
              this.squareStyles['background-color'] = 'rgba(8, 161, 0, 0)';
          }
      }
  }
}
