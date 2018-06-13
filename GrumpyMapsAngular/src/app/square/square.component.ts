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
      for (var i = 0; i < this.inRangeSquares.length; i++) {
        if (this.inRangeSquares[i].mapSquareId == this.square.mapSquareId) {
          squareIdInRange = true;
        }
      }
      if (squareIdInRange) {
        this.square.addPhysical(this.playerToMove);
      }
      else {
        var movingPlayerSquareID = this.playerToMove.mapSquareId;
        for (var j = 0; j < this.inRangeSquares.length; j++) {
          if (movingPlayerSquareID == this.inRangeSquares[j].id) {
            this.inRangeSquares[j].addPhysical(this.playerToMove);
          }
        }
      }
      this.mapShareService.setMovementMode(false);

    }

    this.mapShareService.setAllRangeSquares([0]); //set all styles of inrange squares back.
  }

  private setRangeSquareStyles() {
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
