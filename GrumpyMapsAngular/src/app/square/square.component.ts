
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Square } from '../domain/square';
import { DnDMap } from '../domain/dn-dmap';
import { Player } from '../domain/player';
import { MapSettings } from '../domain/map-settings'

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

    @Input()  mapSettings:MapSettings;
    @Input()  square: Square;
    @Input() squareIndex:number;
    @Input() rowIndexAsLetter:string;
    @Output() setPrevRangeStylesEvent = new EventEmitter<boolean>();

    private _squareHeightWidth: string;
    @Input() set squareHeightWidth(squareHeightWidth: string) {
        this._squareHeightWidth = squareHeightWidth;
        this.squareStyles['width'] = squareHeightWidth;
        this.setSquareMapCoordinates();
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

    originalSquareColor:string = 'rgba(8, 161, 0, 0)';

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
    if (this.mapSettings.movementMode) {
        this.moveObject();
    }
    this.resetAllDistances();

    // after moving the rangeSquares is always set to nothing so it stops showing range
    this.mapSettings.setRange(new Array());
    this.resetPlayer();

  }

  resetPlayer(){
      if (this.mapSettings.selectedPlayer!=null){
          this.mapSettings.selectedPlayer.isSelected = false;
          this.mapSettings.selectedPlayer.setActiveColor();
          this.mapSettings.selectedPlayer = null;
      }
  }
  private moveObject(){
      var squareIdInRange = false;
      for (var i = 0; i < this.mapSettings.rangeSquares.length; i++) {
          if (this.mapSettings.rangeSquares[i].mapSquareId == this.square.mapSquareId) {
              squareIdInRange = true;
          }
      }
      if (squareIdInRange) {
          //move player for that distance if freeMove is not on:
          if (!this.mapSettings.freeMove){

              // use the right move mechanic
              if (this.mapSettings.cutOffMechanic){
                  if (this.mapSettings.disengageMode){
                      this.mapSettings.selectedPlayer.movePlayerCutOff(this.mapSettings.selectedPlayer.movementAmount/2, this.mapSettings.cutOffNumber);
                  }
                  else {
                      this.mapSettings.selectedPlayer.movePlayerCutOff(this.square.currentDistance, this.mapSettings.cutOffNumber);
                  }

              }
              else{ // not cutOff mechanic
                  if (this.mapSettings.disengageMode){
                      this.mapSettings.selectedPlayer.movePlayer(this.mapSettings.selectedPlayer.movementAmount/2);
                  }
                  else {
                      this.mapSettings.selectedPlayer.movePlayer(this.square.currentDistance);
                  }
              }
          }

          //remove object from old square
          var oldSquare = this.getPlayerSquare();
          oldSquare.removePhysical(this.mapSettings.selectedPlayer.id);

          // add object to this square:
          this.square.addPhysical(this.mapSettings.selectedPlayer);

          //show message it moved.
          if (this.mapSettings.chargeMode){
              this.mapSettings.selectedPlayer.movementLeft=0;
              this.mapSettings.selectedPlayer.attacksLeft=0;
              this.mapSettings.selectedPlayer.spellsLeft=0;
              this.mapSettings.selectedPlayer.actionPoints=0;
              var advantageStasis={
                  label:"adv on att & +1ND",
                  radius:0,
                  duration:2
              }
              this.mapSettings.selectedPlayer.zones.push(advantageStasis);
              this.showMessage(this.mapSettings.selectedPlayer.name + " charges " + this.square.currentDistance + " yards! " + this.mapSettings.selectedPlayer.name + " is done for this turn, but gains advantage next turn.", "black", 3000 );
          }
          else{
              if (this.mapSettings.disengageMode){
                  this.showMessage(this.mapSettings.selectedPlayer.name + " disengages " + this.square.currentDistance + " yards but uses up " + this.mapSettings.selectedPlayer.movementAmount/2 + " yards of movement.", "black", 800 );
              }
              else {
                  this.showMessage(this.mapSettings.selectedPlayer.name + " moves " + this.square.currentDistance + " yards!", "black", 500 );
              }
          }

      }
      else { // show message it can't move there
         this.showMessage(this.mapSettings.selectedPlayer.name + " can't move there.", "red", 500 );
      }
      this.mapShareService.setPlayerZones(); // makes the playerZones move with the character
      this.mapSettings.movementMode =false;
      this.mapSettings.setRange(new Array());

      this.mapSettings.freeMove = false;
      this.mapSettings.disengageMode = false;
      this.mapSettings.chargeMode = false;
  }
  getPlayerSquare(){
      var playerSquare:Square=null;
      for (var i = 0 ; i < this.mapSettings.allSquares.length ; i++){
          if (this.mapSettings.allSquares[i].mapSquareId == this.mapSettings.selectedPlayer.mapSquareId){
              playerSquare = this.mapSettings.allSquares[i];
          }
      }
      return playerSquare;
  }
  getDifference(num1, num2){
      return (num1 > num2)? num1-num2 : num2-num1
  }

  getTileDistance(){
      if (this.mapSettings.selectedPlayer!=null){
          //get row and column of players current position coordinates:
          var rowNumber = this.mapSettings.selectedPlayer.squareMapCoordinate.split(":")[0].charCodeAt(0);
          var column = +this.mapSettings.selectedPlayer.squareMapCoordinate.split(":")[1];

          var targetRowNumber = this.square.mapCoordinate.split(":")[0].charCodeAt(0);
          var targetColumn = +this.square.mapCoordinate.split(":")[1];

          var rowDif = this.getDifference(rowNumber, targetRowNumber);
          var colDif = this.getDifference(column, targetColumn);
          var distance = 0;
          if (rowDif == 0){
              distance = colDif*this.mapSettings.squareSize
          }
          if (colDif == 0 && rowDif!=0){
              distance = rowDif*this.mapSettings.squareSize
          }

          // when diagonal movement calc distance based on a^2+b^2=c^2
          // just a diagonal line:
          if (colDif == rowDif && colDif !=0){
              var squaredTileSize = Math.pow(this.mapSettings.squareSize,2);
              distance = colDif * Math.sqrt(squaredTileSize+squaredTileSize);
          }

          // combination of diagonal and vertical/horizontal line
          if (colDif!=rowDif && colDif>0 && rowDif>0){
              var minimum = Math.min(colDif,rowDif);
              var maximum = Math.max(colDif,rowDif);
              var squaredTileSize = Math.pow(this.mapSettings.squareSize,2);
              var diagonal = minimum * Math.sqrt(squaredTileSize+squaredTileSize);
              var straight = (maximum-minimum)*this.mapSettings.squareSize;
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
      for (var i=0 ; i<this.mapSettings.allSquares.length ; i++){
          this.mapSettings.allSquares[i].currentDistance=9999;
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
      else if (!this.selectedSquares.includes(this.square)){
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

      if (this.mapSettings.rangeSquares.length!=0){
          for(var i=0;i<this.mapSettings.rangeSquares.length;i++){
              if (this.mapSettings.rangeSquares[i].mapSquareId == this.square.mapSquareId){
                  this.square.inRange = true;

              }
          }
      }

    if (!this.square.obstructed && !this.selectedSquares.includes(this.square)) {
      if (this.square.inRange) {
          if (this.rangeCutOffSquares.includes(this.square)) {
              if (!this.square.fogged){
                this.squareStyles['background-color'] = 'rgba(0, 161, 161, 0.5)';
                // $("#squarecontainer"+this.square.mapCoordinate).css({"backgroundColor":"#b96611"});
              }
              else {
                this.squareStyles['background-color'] = 'rgba(0, 35, 35, 1)';
                // $("#squarecontainer"+this.square.mapCoordinate).css({"backgroundColor":"rgba(0, 35, 35, 1)"});
              }
          }
          else {
              if (!this.square.fogged){
                this.squareStyles['background-color'] = 'rgba(8, 161, 0, 0.5)';
                // $("#squarecontainer"+this.square.mapCoordinate).css({"backgroundColor":"rgba(8, 161, 0, 0.5)"});
              }
              else {
                this.squareStyles['background-color'] = 'rgba(8, 35, 0, 1)';
                // $("#squarecontainer"+this.square.mapCoordinate).css({"backgroundColor":"rgba(8, 35, 0, 1)"});
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
      if (this.selectedSquares.includes(this.square)){
          if (!this.square.fogged){
              this.squareStyles['background-color'] = 'rgba(0, 112, 161, 0.6)';
          }
          else {
              this.squareStyles['background-color'] = 'rgba(0, 112, 161, 1)';
          }
      }

  }

  deselectAll(){
      this.selectedSquaresEvent.emit(new Array());
      this.resetPlayer();
      this.mapSettings.movementMode = false;
      this.mapSettings.freeMove = false;
      this.mapSettings.chargeMode = false;
      this.mapSettings.disengageMode = false;
      this.mapSettings.setRange(new Array());
      this.setPrevRangeStylesEvent.emit(true);
      this.resetAllDistances();
  }

  // all the mouseevents below make multiSelecting possible
  mouseDownSquare($event){
      if (this.multiSelect){
          this.mapSettings.selecting = true;
      }
      if (this.selectedSquares.includes(this.square)){
          this.mapSettings.deselecting = true;
      }
      else {
          this.mapSettings.deselecting = false;
      }
      if (!this.multiSelect){
          this.selectedSquares = new Array();
          this.selectedSquares.push(this.square);
          this.selectedSquaresEvent.emit(this.selectedSquares);
      }
      this.addToSelection();
      this.selectionStyles();
  }
  mouseOverSquare(){
      if(this.mapSettings.selecting && this.multiSelect){
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
      this.mapSettings.selecting=false;
      this.selectedSquaresEvent.emit(this.selectedSquares);

  }
  mouseOutSquare(){

      if (!this.mapSettings.selecting){
        //   this.setRangeSquareStyles();
          this.mapSettings.setRangeSquareStyles(this.square)

          if (this.square.obstructed || this.square.fogged){
              this.setTileStyle();
          }
          this.selectionStyles();
      }
      this.distance=9999;

  }
  addToSelection(){
      if(this.mapSettings.deselecting && this.selectedSquares.includes(this.square)){
          var index = this.selectedSquares.indexOf(this.square);
          if (index > -1) {
              this.selectedSquares.splice(index, 1);
          }
      }
      else if (!this.mapSettings.deselecting){
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
