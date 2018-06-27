import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Square } from '../domain/square';
import { DnDMap } from '../domain/dn-dmap';
import { Player } from '../domain/player';
import { MapDetailComponent } from '../map-detail/map-detail.component';
import { SquareDetailComponent } from '../square-detail/square-detail.component';
import { MapShareService } from '../map-share.service';

@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {

  @Input()
  squareScale: string;

  @Input()
  square: Square;

  @Input()
  squareIndex: number;
  squareIndexAsLetter:string;

  @Input() obstructionMode: boolean = false;
  @Input() movementMode: boolean;
  @Output() moveModeEvent = new EventEmitter<boolean>();
  @Output() setRangeSquaresEvent = new EventEmitter<number[]>();

  squareStyles = {};
  @Input() set _squareStyles(squareBorderStyle: string) {
      this.squareStyles['border'] = squareBorderStyle;
  }
  playerNameStyles = {};
  @Input() playerToMove: Player;
  private _inRangeSquares: Square[] = new Array();
  @Input() set inRangeSquares(squares: Square[]) {
      this._inRangeSquares = squares;
      this.setRangeSquareStyles();
  }

  squarerangetruecounter=0;
  constructor(private mapShareService: MapShareService) { }

  ngOnInit() {

    this.squareStyles = {
      'width': this.squareScale,
      'height': this.squareScale
    }
    this.setObstruction();
    if (this.squareIndex === 1){
        this.squareIndexAsLetter = 'A';
    }
    if (this.squareIndex === 2){
        this.squareIndexAsLetter = 'B';
    }
  }

  selectSquare() {
    console.log("inrange: " + this.square.inRange);
    this.mapShareService.setSquare(this.square); //update active square in squareDetail via mapShareService
    // style squares if obstruct mode is on
    var isObstructed = this.square.obstructed;
    if (this.obstructionMode) {
      if (isObstructed == false) {
        this.square.obstructed = true;
        this.squareStyles['background-color'] = 'rgba(161, 0, 0, 0.35)';
      }
      else {
        this.square.obstructed = false;
        this.squareStyles['background-color'] = 'rgba(161, 0, 0, 0)';
      }
    }

    // move an object from a square to a square if movementMode is on
    if (this.movementMode) {
      var squareIdInRange = false;
      for (var i = 0; i < this._inRangeSquares.length; i++) {
        if (this._inRangeSquares[i].mapSquareId == this.square.mapSquareId) {
          squareIdInRange = true;
        }
      }
      if (squareIdInRange) {
        this.square.addPhysical(this.playerToMove);
      }
      else {
        var movingPlayerSquareID = this.playerToMove.mapSquareId;
        for (var j = 0; j < this._inRangeSquares.length; j++) {
          if (movingPlayerSquareID == this._inRangeSquares[j].mapSquareId) {
            this._inRangeSquares[j].addPhysical(this.playerToMove);
          }
        }
      }
      this.playerToMove.isSelected = false;
      this.moveModeEvent.emit(false);

    }
    this.setRangeSquaresEvent.emit([0]);


  }

  setObstruction(){
      // style squares if obstruct mode is on
      var isObstructed = this.square.obstructed;

        if (isObstructed) {
          this.squareStyles['background-color'] = 'rgba(161, 0, 0, 0.35)';
        }

  }

  public setRangeSquareStyles() {
      if (this.square.inRange){
          this.squarerangetruecounter++;
          console.log("square inrange: " + this.square.inRange);
      }
    if (!this.square.obstructed) {
      if (this.square.inRange) {
        this.squareStyles['background-color'] = 'rgba(8, 161, 0, 0.5)';
      }
      else {
        this.squareStyles['background-color'] = 'rgba(8, 161, 0, 0)';
      }
    }
  }
}
