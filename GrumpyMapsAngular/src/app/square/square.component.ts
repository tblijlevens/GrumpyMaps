
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Square } from '../domain/square';
import { DnDMap } from '../domain/dn-dmap';
import { Player } from '../domain/player';
import { MapDetailComponent } from '../map-detail/map-detail.component';
import { SquareDetailComponent } from '../square-detail/square-detail.component';
import { MapShareService } from '../map-share.service';
import * as $ from 'jquery';


@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.css']
})
export class SquareComponent implements OnInit {

  @Input()  square: Square;
  @Input() squareIndex:number;
  private rowIndex:number;
  @Input() set _rowIndex(rowIndex: number) {
      this.rowIndex=rowIndex;
      this.setRowIndexLetter();
  }
  rowIndexAsLetter:string;
  private _squareHeightWidth: string;
  @Input() set squareHeightWidth(squareHeightWidth: string) {
      this._squareHeightWidth = squareHeightWidth;
      this.squareStyles['width'] = squareHeightWidth;
      this.setSquareMapCoordinates();
  }
  @Input() obstructionMode: boolean = false;
  @Input() movementMode: boolean;
  @Output() moveModeEvent = new EventEmitter<boolean>();
  @Output() setRangeSquaresEvent = new EventEmitter<number[]>();
  _inRangeSquares: Square[] = new Array();
  @Input() set inRangeSquares(squares: Square[]) {
      this._inRangeSquares = squares;
      this.setRangeSquareStyles();
  }

  squareStyles = {};
  @Input() set _squareBorderStyles(squareBorderStyle: string) {
      this.squareStyles['border'] = squareBorderStyle;
  }
  @Input() selectedPlayer: Player;

  originalSquareColor:string = 'rgba(8, 161, 0, 0)';
  @Output() selectingEvent = new EventEmitter<boolean>();
  @Input() selecting:boolean;
  @Output() deselectingEvent = new EventEmitter<boolean>();
  @Input() deselecting:boolean;
  private multiSelect:boolean;
  @Input() set _multiSelect(multiSelect:boolean) {
      this.multiSelect = multiSelect;
    //   if (!multiSelect){
          this.selectedSquares = new Array();
          this.setObstructionStyle();
          this.setRangeSquareStyles();
    //   }
  }
  @Output() selectedSquaresEvent = new EventEmitter<Square[]>();
  private selectedSquares:Square[] = new Array();
  @Input() set _selectedSquares(selectedSquares:Square[]) {
      this.selectedSquares = selectedSquares;
      if (!this.multiSelect){
          this.setObstructionStyle();
      }
     // if (this.selectedSquares.length!=0){
          this.setRangeSquareStyles();
     // }
  }
  @Input() set setStyles(setstyles:boolean){
      this.deselectAll(); // ExpressionChangedAfterItHasBeenCheckedError is not thrown in production
      this.setObstructionStyle();
      this.setRangeSquareStyles();
  }



  constructor(private mapShareService: MapShareService) { }

  ngOnInit() {

    this.squareStyles = {
      'width': this._squareHeightWidth
    }
    this.setObstructionStyle();

  }

  selectSquare() {
    this.mapShareService.setSquare(this.square); //update active square in squareDetail via mapShareService

    // move an object from a square to a square if movementMode is on
    if (this.movementMode) {
        this.moveObject();
    }

    // after moving the rangeSquares is always set to nothing so it stops showing range
    this.setRangeSquaresEvent.emit([0]);
    if (this.selectedPlayer!=null){
        this.selectedPlayer.isSelected = false;
        this.selectedPlayer.setActiveColor();
    }

  }


  private moveObject(){
      var squareIdInRange = false;
      for (var i = 0; i < this._inRangeSquares.length; i++) {
          if (this._inRangeSquares[i].mapSquareId == this.square.mapSquareId) {
              squareIdInRange = true;
          }
      }
      if (squareIdInRange) {

          //move player for that distance:
          this.selectedPlayer.movePlayer(this.square.currentDistance);

          // add player to this square:
          this.square.addPhysical(this.selectedPlayer);
      }
      else {
          var movingPlayerSquareID = this.selectedPlayer.mapSquareId;
          for (var j = 0; j < this._inRangeSquares.length; j++) {
              if (movingPlayerSquareID == this._inRangeSquares[j].mapSquareId) {
                  this._inRangeSquares[j].addPhysical(this.selectedPlayer);
              }
          }
      }
      this.moveModeEvent.emit(false);
  }

  getDifference(num1, num2){
  return (num1 > num2)? num1-num2 : num2-num1
}

  private setObstruction(){
      var isObstructed = this.square.obstructed;
      if (!isObstructed) {
          this.square.obstructed = true;
      }
      else {
          this.square.obstructed = false;
      }
      this.setObstructionStyle();
  }

  private setObstructionStyle(){
      // style squares if obstruct mode is on
      var isObstructed = this.square.obstructed;
        if (isObstructed) {
            this.squareStyles['background-color'] = 'rgba(8, 161, 0, 0)';
            this.originalSquareColor = 'rgba(161, 0, 0, 0.35)';
          //this.squareStyles['background-color'] = this.originalSquareColor;
          this.squareStyles['background'] = 'repeating-linear-gradient(          135deg, rgba(161, 0, 0, 0.6), rgba(161, 0, 0, 0.6) 8px, rgba(0, 0, 0, 0.0) 8px, rgba(0, 0, 0, 0.0) 16px)'
          //this.squareStyles['background'] = 'repeating-radial-gradient(circle, rgba(235, 199, 9, 0.6), rgba(235, 199, 9, 0.6) 5px, rgba(235, 199, 9, 0) 5px,  rgba(235, 199, 9, 0) 10px)'

        }
        else {
            this.originalSquareColor = 'rgba(161, 0, 0, 0)';
          this.squareStyles['background'] = "none";
        }
    }


  public setRangeSquareStyles() {
      if (this._inRangeSquares.length!=0){
          for(var i=0;i<this._inRangeSquares.length;i++){
              if (this._inRangeSquares[i].mapSquareId == this.square.mapSquareId){
                  this.square.inRange = true;
              }
          }
      }
      else {
          this.square.inRange = false;
      }

    if (!this.square.obstructed && !this.selectedSquares.includes(this.square)) {
      if (this.square.inRange) {
          this.originalSquareColor = 'rgba(8, 161, 0, 0.5)';
        this.squareStyles['background-color'] = this.originalSquareColor;
      }
      else {
          this.originalSquareColor = 'rgba(8, 161, 0, 0)';
        this.squareStyles['background-color'] = this.originalSquareColor;
      }
     // this.selectionStyles();
    }

  }
  selectionStyles(){
      for (var i = 0 ; i < this.selectedSquares.length ; i++){
          if (this.square.mapSquareId == this.selectedSquares[i].mapSquareId){
              this.squareStyles['background-color'] = 'rgba(0, 112, 161, 0.6)';
          }
      }
  }

  deselectAll(){
      this.selectedSquaresEvent.emit(new Array());
  }

  // all the mouseevents below make multiSelecting possible
  mouseDownSquare($event){
      if (this.multiSelect){
          this.selecting=true;
          this.selectingEvent.emit(true);
      }
      if (!this.multiSelect){
          this.selectedSquares = new Array();
          this.selectedSquares.push(this.square);
          this.selectedSquaresEvent.emit(this.selectedSquares);
      }
      if (this.selectedSquares.includes(this.square)){
          this.deselecting = true;
      }
      else {
          this.deselecting = false;
      }
      this.deselectingEvent.emit(this.deselecting);
      this.addToSelection();
      this.selectionStyles();
  }
  mouseOverSquare(){
      if(this.selecting && this.multiSelect){
          this.addToSelection();
      }
      this.squareStyles['background-color'] = 'rgba(0, 112, 161, 0.3)';
      this.selectionStyles();

  }
  mouseUpSquare(){
      this.selecting=false;
      this.selectingEvent.emit(false);
      this.selectedSquaresEvent.emit(this.selectedSquares);

  }
  mouseOutSquare(){
      if (!this.selecting){
          this.setRangeSquareStyles();

          if (this.square.obstructed){
              this.setObstructionStyle();
          }
          this.selectionStyles();
      }
  }
  addToSelection(){
      if(this.deselecting && this.selectedSquares.includes(this.square)){
          var index = this.selectedSquares.indexOf(this.square);
          if (index > -1) {
              this.selectedSquares.splice(index, 1);
          }
      }
      else if (!this.deselecting){
          var allSquares = "";
          this.selectedSquares.push(this.square);
          for (var i = 0 ; i < this.selectedSquares.length ; i++){
              allSquares+= this.selectedSquares[i].mapCoordinate + " ";
          }

      }
  }


  private setSquareMapCoordinates(){
      this.square.mapCoordinate = this.rowIndexAsLetter+":"+ (this.squareIndex+1);
  }

  private setRowIndexLetter(){
      switch(this.rowIndex) {
          case 1: {
              this.rowIndexAsLetter="A";
              break;
          }
          case 2: {
              this.rowIndexAsLetter="B";
              break;
          }
          case 3: {
              this.rowIndexAsLetter="C";
              break;
          }
          case 4: {
              this.rowIndexAsLetter="D";
              break;
          }
          case 5: {
              this.rowIndexAsLetter="E";
              break;
          }
          case 6: {
              this.rowIndexAsLetter="F";
              break;
          }
          case 7: {
              this.rowIndexAsLetter="G";
              break;
          }
          case 8: {
              this.rowIndexAsLetter="H";
              break;
          }
          case 9: {
              this.rowIndexAsLetter="I";
              break;
          }
          case 10: {
              this.rowIndexAsLetter="J";
              break;
          }
          case 11: {
              this.rowIndexAsLetter="K";
              break;
          }
          case 12: {
              this.rowIndexAsLetter="L";
              break;
          }
          case 13: {
              this.rowIndexAsLetter="M";
              break;
          }
          case 14: {
              this.rowIndexAsLetter="N";
              break;
          }
          case 15: {
              this.rowIndexAsLetter="O";
              break;
          }
          case 16: {
              this.rowIndexAsLetter="P";
              break;
          }
          case 17: {
              this.rowIndexAsLetter="Q";
              break;
          }
          case 18: {
              this.rowIndexAsLetter="R";
              break;
          }
          case 19: {
              this.rowIndexAsLetter="S";
              break;
          }
          case 20: {
              this.rowIndexAsLetter="T";
              break;
          }
          case 21: {
              this.rowIndexAsLetter="U";
              break;
          }
          case 22: {
              this.rowIndexAsLetter="V";
              break;
          }
          case 23: {
              this.rowIndexAsLetter="W";
              break;
          }
          case 24: {
              this.rowIndexAsLetter="X";
              break;
          }
          case 25: {
              this.rowIndexAsLetter="Y";
              break;
          }
      }
  }
}
