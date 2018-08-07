
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
  @Input()  squareSize: number;
  @Input() allSquares:Square[] = new Array();
  @Input() squareIndex:number;
  @Input() rowIndexAsLetter:string;
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
  @Output() setSelectedPlayerEvent = new EventEmitter<Player>();

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
  distance:number=9999;

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
    this.resetAllDistances()

    // after moving the rangeSquares is always set to nothing so it stops showing range
    this.setRangeSquaresEvent.emit(new Array());

    if (this.selectedPlayer!=null){
        this.selectedPlayer.isSelected = false;
        this.selectedPlayer.setActiveColor();
        this.setSelectedPlayerEvent.emit(null);
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

          //remove object from old square
          var oldSquare = this.getPlayerSquare();
          oldSquare.removePhysical(this.selectedPlayer.id);

          // add object to this square:
          this.square.addPhysical(this.selectedPlayer);

          //show message it moved.
          this.showMessage(this.selectedPlayer.name + " moves " + this.square.currentDistance + " yards!", "black", 500 );

      }
      else { // show message it can't move there
         this.showMessage(this.selectedPlayer.name + " can't move there.", "red", 500 );
      }
      this.mapShareService.setPlayerZones(); // makes the playerZones move with the character
      this.moveModeEvent.emit(false);
  }
  getPlayerSquare(){
      var playerSquare:Square=null;
      for (var i = 0 ; i < this.allSquares.length ; i++){
          if (this.allSquares[i].mapSquareId == this.selectedPlayer.mapSquareId){
              playerSquare = this.allSquares[i];
          }
      }
      return playerSquare;
  }
  getDifference(num1, num2){
      return (num1 > num2)? num1-num2 : num2-num1
  }

  getTileDistance(){
      if (this.selectedPlayer!=null){
          //get row and column of players current position coordinates:
          var rowNumber = this.selectedPlayer.squareMapCoordinate.split(":")[0].charCodeAt(0);
          var column = +this.selectedPlayer.squareMapCoordinate.split(":")[1];

          var targetRowNumber = this.square.mapCoordinate.split(":")[0].charCodeAt(0);
          var targetColumn = +this.square.mapCoordinate.split(":")[1];

          var rowDif = this.getDifference(rowNumber, targetRowNumber);
          var colDif = this.getDifference(column, targetColumn);
          var distance = 0;
          if (rowDif == 0){
              distance = colDif*this.squareSize
          }
          if (colDif == 0 && rowDif!=0){
              distance = rowDif*this.squareSize
          }

          // when diagonal movement calc distance based on a^2+b^2=c^2
          // just a diagonal line:
          if (colDif == rowDif && colDif !=0){
              var squaredTileSize = Math.pow(this.squareSize,2);
              distance = colDif * Math.sqrt(squaredTileSize+squaredTileSize);
          }

          // combination of diagonal and vertical/horizontal line
          if (colDif!=rowDif && colDif>0 && rowDif>0){
              var minimum = Math.min(colDif,rowDif);
              var maximum = Math.max(colDif,rowDif);
              var squaredTileSize = Math.pow(this.squareSize,2);
              var diagonal = minimum * Math.sqrt(squaredTileSize+squaredTileSize);
              var straight = (maximum-minimum)*this.squareSize;
              distance=diagonal+straight;
          }
          this.distance=+distance.toFixed(1);
      }
  }

  showMessage(message:string, color:string, duration:number){
      $('#infoBox').css({"color":color})
      $('#infoBox').html(message);
      $('#infoBox').fadeIn(500).delay(duration).fadeOut(500);
  }
  resetAllDistances(){
      for (var i=0 ; i<this.allSquares.length ; i++){
          this.allSquares[i].currentDistance=9999;
      }
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
      this.square.inRange = false;

      if (this._inRangeSquares.length!=0){
          for(var i=0;i<this._inRangeSquares.length;i++){
              if (this._inRangeSquares[i].mapSquareId == this.square.mapSquareId){
                  this.square.inRange = true;

              }
          }
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
      this.setSelectedPlayerEvent.emit(null);

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
      this.getTileDistance();

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
      this.distance=9999;

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

}
