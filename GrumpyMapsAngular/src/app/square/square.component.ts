
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
  @Input() freeMove: boolean;
  @Output() freeMoveEvent = new EventEmitter<boolean>();
  @Input() disengageMode: boolean;
  @Output() disengageModeEvent = new EventEmitter<boolean>();
  @Input() chargeMode: boolean;
  @Output() chargeModeEvent = new EventEmitter<boolean>();
  @Output() setRangeSquaresEvent = new EventEmitter<number[]>();
  _inRangeSquares: Square[] = new Array();
  @Input() set inRangeSquares(squares: Square[]) {
      this._inRangeSquares = squares;
      this.setRangeSquareStyles();
  }
 rangeCutOffSquares:Square[] = new Array();
 @Input() set _rangeCutOffSquares(squares: Square[]) {
     this.rangeCutOffSquares = squares;
     this.setRangeSquareStyles();
 }
  squareStyles = {};
  @Input() set _squareBorderStyles(squareBorderStyle: string) {
      this.squareStyles['border'] = squareBorderStyle;
  }
  @Input() selectedPlayer: Player = null;
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
          this.setTileStyle();
          this.setRangeSquareStyles();
    //   }
  }
  @Output() selectedSquaresEvent = new EventEmitter<Square[]>();
  private selectedSquares:Square[] = new Array();
  @Input() set _selectedSquares(selectedSquares:Square[]) {
      this.selectedSquares = selectedSquares;
      if (!this.multiSelect){
          this.setTileStyle();
      }
     // if (this.selectedSquares.length!=0){
          this.setRangeSquareStyles();
     // }
  }
  @Input() set setStyles(setstyles:boolean){
      this.deselectAll(); // ExpressionChangedAfterItHasBeenCheckedError is not thrown in production

      this.setTileStyle();
      this.setRangeSquareStyles();
  }
  distance:number=9999;
  @Input() cutOffMechanic:boolean=false;
  @Input() cutOffNumber:number;


  constructor(private mapShareService: MapShareService) { }

  ngOnInit() {

    this.squareStyles = {
      'width': this._squareHeightWidth
    }
    this.setTileStyle();

  }

  selectSquare() {
    this.mapShareService.setSquare(this.square); //update active square in squareDetail via mapShareService

    // move an object from a square to a square if movementMode is on
    if (this.movementMode) {
        this.moveObject();
    }
    this.resetAllDistances();

    // after moving the rangeSquares is always set to nothing so it stops showing range
    this.setRangeSquaresEvent.emit(new Array());
    this.resetPlayer();

  }

  resetPlayer(){
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
          //move player for that distance if freeMove is not on:
          if (!this.freeMove){

              // use the right move mechanic
              if (this.cutOffMechanic){
                  if (this.disengageMode){
                      this.selectedPlayer.movePlayerCutOff(this.selectedPlayer.movementAmount/2, this.cutOffNumber);
                  }
                  else {
                      this.selectedPlayer.movePlayerCutOff(this.square.currentDistance, this.cutOffNumber);
                  }

              }
              else{ // not cutOff mechanic
                  if (this.disengageMode){
                      this.selectedPlayer.movePlayer(this.selectedPlayer.movementAmount/2);
                  }
                  else {
                      this.selectedPlayer.movePlayer(this.square.currentDistance);
                  }
              }
          }

          //remove object from old square
          var oldSquare = this.getPlayerSquare();
          oldSquare.removePhysical(this.selectedPlayer.id);

          // add object to this square:
          this.square.addPhysical(this.selectedPlayer);

          //show message it moved.
          if (this.chargeMode){
              this.selectedPlayer.movementLeft=0;
              this.selectedPlayer.attacksLeft=0;
              this.selectedPlayer.spellsLeft=0;
              this.selectedPlayer.actionPoints=0;
              var advantageStasis={
                  label:"adv on att & +1ND",
                  radius:0,
                  duration:2
              }
              this.selectedPlayer.zones.push(advantageStasis);
              this.showMessage(this.selectedPlayer.name + " charges " + this.square.currentDistance + " yards! " + this.selectedPlayer.name + " is done for this turn, but gains advantage next turn.", "black", 3000 );
          }
          else{
              if (this.disengageMode){
                  this.showMessage(this.selectedPlayer.name + " disengages " + this.square.currentDistance + " yards but uses up " + this.selectedPlayer.movementAmount/2 + " yards of movement.", "black", 800 );
              }
              else {
                  this.showMessage(this.selectedPlayer.name + " moves " + this.square.currentDistance + " yards!", "black", 500 );
              }
          }

      }
      else { // show message it can't move there
         this.showMessage(this.selectedPlayer.name + " can't move there.", "red", 500 );
      }
      this.mapShareService.setPlayerZones(); // makes the playerZones move with the character
      this.moveModeEvent.emit(false);
      this.freeMoveEvent.emit(false);
      this.disengageModeEvent.emit(false);
      this.chargeModeEvent.emit(false);
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

      var mapHeightPX = $(".mapcontainer").css('height');
      var mapHeight = +mapHeightPX.split("px")[0];
      var mapOffset = $(".mapcontainer").offset();
      var mapPos = $(".mapcontainer").position();

      $('#infoBox').html(message);
      var infoBoxHeight = +$("#infoBox").css('height').split("px")[0];
      var infoBoxWidth = +$("#infoBox").css('width').split("px")[0];
      $("#infoBox").css({
          "top":mapOffset.top+((mapHeight/2)-(infoBoxHeight/2)),
          "left":mapOffset.left+((mapHeight/2)-(infoBoxWidth/2)),
          "color":color
      });
      $("#hiddenClose").css({
          "top":mapOffset.top+((mapHeight/2)-(infoBoxHeight/2)),
          "left":mapOffset.left+((mapHeight/2)+(infoBoxWidth/2))-20
      });

      $('#infoBox').fadeIn(500).delay(duration).fadeOut(500);
      $('#hiddenClose').fadeIn(500).delay(duration).fadeOut(500);
  }

  resetAllDistances(){
      for (var i=0 ; i<this.allSquares.length ; i++){
          this.allSquares[i].currentDistance=9999;
      }
  }

  private setTileStyle(){
      if (this.square.obstructed && !this.square.fogged){
          this.squareStyles['background'] = 'repeating-linear-gradient(          135deg, rgba(161, 0, 0, 0.6), rgba(161, 0, 0, 0.6) 8px, rgba(0, 0, 0, 0.0) 8px, rgba(0, 0, 0, 0.0) 16px)';
      }
      else {
          this.squareStyles['background'] = 'none';
      }

      if (this.square.fogged){
          this.squareStyles['background-color'] = "rgba(153, 153, 153, 1)";
          this.squareStyles['box-shadow'] = "0 0px 5px 5px #999999";
      }
      else {
          this.squareStyles['background-color'] = "rgba(0, 0, 0, 0.0)";
          this.squareStyles['box-shadow'] = "none";

      }

    //   // Assuming a six character colour:
      //
    //   var c = c.substring(1);      // strip #
    //   var rgb = parseInt(c, 16);   // convert rrggbb to decimal
    //   var r = (rgb >> 16) & 0xff;  // extract red
    //   var g = (rgb >>  8) & 0xff;  // extract green
    //   var b = (rgb >>  0) & 0xff;  // extract blue
    //
    //   var luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709
    //
    //   if (luma < 40) {
    //       // make text white
    //   }

        //   this.squareStyles['background'] = 'repeating-linear-gradient(          135deg, rgba(161, 0, 0, 0.6), rgba(161, 0, 0, 0.6) 8px, rgba(0, 0, 0, 0.0) 8px, rgba(0, 0, 0, 0.0) 16px)'
          //this.squareStyles['background'] = 'repeating-radial-gradient(circle, rgba(235, 199, 9, 0.6), rgba(235, 199, 9, 0.6) 5px, rgba(235, 199, 9, 0) 5px,  rgba(235, 199, 9, 0) 10px)'
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
          if (this.rangeCutOffSquares.includes(this.square)) {
              if (!this.square.fogged){
                  this.squareStyles['background-color'] = 'rgba(0, 161, 161, 0.5)';
              }
              else {
                  this.squareStyles['background-color'] = 'rgba(0, 35, 35, 1)';
              }
          }
          else
          {
              if (!this.square.fogged){
                  this.squareStyles['background-color'] = 'rgba(8, 161, 0, 0.5)';
              }
              else {
                  this.squareStyles['background-color'] = 'rgba(8, 35, 0, 1)';
              }
          }

      }
      else {
          if (!this.square.fogged){
              this.squareStyles['background-color'] = "rgba(0, 0, 0, 0.0)";
          }

      }
     // this.selectionStyles();
    }

  }
  selectionStyles(){
      for (var i = 0 ; i < this.selectedSquares.length ; i++){
          if (this.square.mapSquareId == this.selectedSquares[i].mapSquareId){
              if (!this.square.fogged){
                  this.squareStyles['background-color'] = 'rgba(0, 112, 161, 0.6)';
              }
              else {
                  this.squareStyles['background-color'] = 'rgba(0, 112, 161, 1)';
              }
          }
      }
  }

  deselectAll(){
      this.selectedSquaresEvent.emit(new Array());
      this.resetPlayer();
      this.setSelectedPlayerEvent.emit(null);
      this.moveModeEvent.emit(false);
      this.freeMoveEvent.emit(false);
      this.chargeModeEvent.emit(false);
      this.setRangeSquaresEvent.emit(new Array());
      this.resetAllDistances();

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
      if (!this.square.fogged){
          this.squareStyles['background-color'] = 'rgba(0, 112, 161, 0.5)';
      }
      else {
          this.squareStyles['background-color'] = 'rgba(0, 112, 161, 1)';
      }
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

          if (this.square.obstructed || this.square.fogged){
              this.setTileStyle();
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
