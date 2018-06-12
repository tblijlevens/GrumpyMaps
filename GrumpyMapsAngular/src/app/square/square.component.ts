import { Component, OnInit, Input } from '@angular/core';
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

  obstructionMode: boolean = false;
  rangeSquares: Square[];
  movementMode: boolean;
  squareStyles = {};
  playerToMove: Player;
  inRangeSquares: Square[] = new Array();
  constructor(private mapShareService: MapShareService) { }

  ngOnInit() {
    this.mapShareService.squareBorderStyleUpdated.subscribe(squareBorderStyle => this.squareStyles['border'] = squareBorderStyle);
    this.mapShareService.obstructionModeUpdated.subscribe(obstructionMode => this.obstructionMode = obstructionMode);
    this.mapShareService.rangeSquaresUpdated.subscribe(rangeSquares => { this.setRangeSquareStyles(); this.inRangeSquares = rangeSquares });
    this.mapShareService.playerToMoveUpdated.subscribe(playerToMove => this.playerToMove = playerToMove);
    this.mapShareService.movementModeUpdated.subscribe(movementMode => this.movementMode = movementMode);

    this.squareStyles = {
      'width': this.squareScale,
      'height': this.squareScale
    }
  }

  selectSquare() {
    this.mapShareService.setSquare(this.square); //update active square in squareDetail via mapShareService
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
    if (this.movementMode) {
      var squareIdInRange = false;
      console.log(this.movementMode + "movement is actief" + this.square.mapSquareId);
      for (var i = 0; i < this.inRangeSquares.length; i++) {
        console.log("rangeid " + this.inRangeSquares[i].mapSquareId + "| thissquare " + this.square.mapSquareId);
        if (this.inRangeSquares[i].mapSquareId == this.square.mapSquareId) {
          squareIdInRange = true;
        }
      }
      if (squareIdInRange) {
        this.square.addPhysical(this.playerToMove);
      }
      else {
        var movingPlayerSquareID = this.playerToMove.squareId;
        for (var j = 0; j < this.inRangeSquares.length; j++) {
          console.log("for");
          if (movingPlayerSquareID == this.inRangeSquares[j].mapSquareId) {
            console.log("if");
            this.inRangeSquares[j].addPhysical(this.playerToMove);
          }
        }
      }
      this.mapShareService.setMovementMode(false);

    }
    else {
      console.log(this.movementMode + "movement is niet actief");
    }
    this.mapShareService.setAllRangeSquares([0]); //set all styles of inrange squares back.
  }

  private setRangeSquareStyles() {
    if (!this.square.obstructed) {
      if (this.square.inRange) {
        this.squareStyles['background-color'] = 'rgba(8, 161, 0, 0.35)';
      }
      else {
        this.squareStyles['background-color'] = 'rgba(8, 161, 0, 0)';
      }
    }
  }
}
