import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MapShareService } from '../map-share.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Square } from '../domain/square';
import { Player } from '../domain/player';
import * as $ from 'jquery';


@Component({
  selector: 'app-square-detail',
  templateUrl: './square-detail.component.html',
  styleUrls: ['./square-detail.component.css']
})
export class SquareDetailComponent implements OnInit {

  square: Square;
  @Input() allSquares:Square[] = new Array();
  @Input() squareSize:number;
  private selectedSquares:Square[];
  @Input() set _selectedSquares(selectedSquares: Square[]) {
      this.square = selectedSquares[0];
      this.selectedSquares = selectedSquares;
  }
  @Output() setPlayerToMoveEvent = new EventEmitter<Player>();

  @Input() selectedPlayer:Player;

  allCharacters: Player[] = new Array();
  @Input() set _allCharacters(allCharacters: Player[]) {
      this.allCharacters = allCharacters;
  }
  @Input() cutOffMechanic:boolean=false;

  zoneToEdit:any;
  editPlayerZoneForm = new FormGroup({
      zoneRadius: new FormControl(),
      zoneDuration: new FormControl(),
      zoneLabel: new FormControl()
  });
  editTileZoneForm = new FormGroup({
      zoneRadius: new FormControl(),
      zoneDuration: new FormControl(),
      zoneLabel: new FormControl()
  });

  constructor(private mapShareService: MapShareService) {
  }

  ngOnInit() {
      this.mapShareService.squareUpdated.subscribe(square => {
          if (this.selectedSquares.length==0){
              this.selectedSquares = new Array();
              this.selectedSquares.push(square);
          }
          this.square =square;
      });
      this.mapShareService.playerZonesUpdated.subscribe(booleanValue => {
         this.setAllPlayerZones();
      });
      this.mapShareService.tileZonesUpdated.subscribe(booleanValue => {
         this.setAllTileZones();
      });
  }

  setPlayerZoneSize(player:Player){
      var squareSize = +$("#squarecontainer").css("height").split("px")[0];
      var playerDotSize = +$("#playerDot"+player.id).css("height").split("px")[0];
      for (var i = 0 ; i < player.zones.length ; i++){
          var label = player.zones[i].label;
          var radius = player.zones[i].radius;
          var zoneHeightWidth = +(radius / this.squareSize).toFixed(1);

          var zoneHeightWidth = (zoneHeightWidth*squareSize);
          var zoneHeightWidthScale = zoneHeightWidth+"px";
          $("#playerZone"+player.id+i).css({
              "width":zoneHeightWidthScale,
              "height":zoneHeightWidthScale,
              "top":-(zoneHeightWidth/2)+(playerDotSize/2),
              "left":-(zoneHeightWidth/2)+(playerDotSize/2)
          });
      }
  }

  setAllPlayerZones(){
      for (var i = 0 ; i < this.allCharacters.length ; i++){
          if (!this.getPlayerSquare(this.allCharacters[i]).hidden){
              this.setPlayerZoneSize(this.allCharacters[i]);
          }
      }
  }

  clickPlayerZone(zone:any, player:Player){
      this.setAllPlayerZones();
      this.setAllTileZones();
      var index = player.zones.indexOf(zone);
      var zoneHeight = +$("#playerZone"+player.id+index).css("height").split("px")[0];
      zoneHeight = zoneHeight/2;

      $("#playerZone"+player.id+index).animate({
          borderWidth: zoneHeight
      }, 400).animate({
          borderWidth: 1
      }, 400).animate({
          borderWidth: zoneHeight
      }, 400).animate({
          borderWidth: 1
      }, 400);

  }
  removePlayerZone(zone:any, player:Player){
      player.removeZone(zone);
  }

  setTileZoneSize(square:Square){
      var squareSize = +$("#squarecontainer").css("height").split("px")[0];
      for (var i = 0 ; i < square.zones.length ; i++){

          var label = square.zones[i].label;
          var radius = square.zones[i].radius;
          var zoneHeightWidth = +(radius / this.squareSize).toFixed(1);
          var zoneHeightWidth = (zoneHeightWidth*squareSize);
          var zoneHeightWidthScale = zoneHeightWidth+"px";
          $("#tileZone"+square.mapSquareId+i).css({
              "width":zoneHeightWidthScale,
              "height":zoneHeightWidthScale,
              "top":-(zoneHeightWidth/2)+(squareSize/2),
              "left":-(zoneHeightWidth/2)+(squareSize/2)
          });
      }
  }

  setAllTileZones(){
      for (var i = 0 ; i < this.allSquares.length ; i++){
          this.setTileZoneSize(this.allSquares[i]);
      }
  }
  clickTileZone(zone:any, square:Square){
      this.setAllPlayerZones();
      this.setAllTileZones();
      var index = square.zones.indexOf(zone);
      var zoneHeight = +$("#tileZone"+square.mapSquareId+index).css("height").split("px")[0];
      zoneHeight = zoneHeight/2;

      $("#tileZone"+square.mapSquareId+index).animate({
          borderWidth: zoneHeight
      }, 400).animate({
          borderWidth: 1
      }, 400).animate({
          borderWidth: zoneHeight
      }, 400).animate({
          borderWidth: 1
      }, 400);
  }

  removeTileZone(zone:any, square:Square){
      square.removeZone(zone);
  }
  setZoneValues(zone:any){
      this.zoneToEdit=zone;
      this.editTileZoneForm.get('zoneLabel').setValue(zone.label);
      this.editTileZoneForm.get('zoneRadius').setValue(zone.radius);
      this.editTileZoneForm.get('zoneDuration').setValue(zone.duration);
      this.editPlayerZoneForm.get('zoneLabel').setValue(zone.label);
      this.editPlayerZoneForm.get('zoneRadius').setValue(zone.radius);
      this.editPlayerZoneForm.get('zoneDuration').setValue(zone.duration);
  }
  editTileZone(){
      this.zoneToEdit.label = this.editTileZoneForm.get('zoneLabel').value;
      this.zoneToEdit.radius = this.editTileZoneForm.get('zoneRadius').value;
      this.zoneToEdit.duration = this.editTileZoneForm.get('zoneDuration').value;
      if (this.zoneToEdit.duration == 0){
          this.zoneToEdit.duration = -1;
      }
      this.setAllPlayerZones();
      this.setAllTileZones();
  }
  editPlayerZone(){
      this.zoneToEdit.label = this.editPlayerZoneForm.get('zoneLabel').value;
      this.zoneToEdit.radius = this.editPlayerZoneForm.get('zoneRadius').value;
      this.zoneToEdit.duration = this.editPlayerZoneForm.get('zoneDuration').value;
      if (this.zoneToEdit.duration == 0){
          this.zoneToEdit.duration = -1;
      }
      this.setAllPlayerZones();
      this.setAllTileZones();
  }
  getPlayerSquare(player:Player){
      var playerSquare:Square=null;
      for (var i = 0 ; i < this.allSquares.length ; i++){
          if (this.allSquares[i].mapSquareId == player.mapSquareId){
              playerSquare = this.allSquares[i];
          }
      }
      return playerSquare;
  }


}
