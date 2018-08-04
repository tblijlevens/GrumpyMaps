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
  playerIdCreator: number = 1;
  movementMode: boolean = false;
  @Output() moveModeEvent = new EventEmitter<boolean>();
  @Output() setRangeSquaresEvent = new EventEmitter<number[]>();
  @Output() setPlayerToMoveEvent = new EventEmitter<Player>();
  @Output() playerAddedEvent = new EventEmitter<Player>();
  @Output() setStylesEvent = new EventEmitter<boolean>();
  @Input() setStyles:boolean;
  @Input() selectedPlayer:Player;

  allCharacters: Player[] = new Array();
  @Input() set _allCharacters(allCharacters: Player[]) {
      this.allCharacters = allCharacters;
  }

  zoneToEdit:any;
  editZoneForm = new FormGroup({
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
          this.setPlayerZoneSize(this.allCharacters[i]);
      }
  }

  clickPlayerZone(zone:any, player:Player){
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
  removeZone(zone:any, player:Player){
      player.removeZone(zone);
  }
  setZoneValues(zone:any){
      this.zoneToEdit=zone;
      this.editZoneForm.get('zoneLabel').setValue(zone.label);
      this.editZoneForm.get('zoneRadius').setValue(zone.radius);
      this.editZoneForm.get('zoneDuration').setValue(zone.duration);
  }
  editZone(){
      this.zoneToEdit.label = this.editZoneForm.get('zoneLabel').value;
      this.zoneToEdit.radius = this.editZoneForm.get('zoneRadius').value;
      this.zoneToEdit.duration = this.editZoneForm.get('zoneDuration').value;
      if (this.zoneToEdit.duration == 0){
          this.zoneToEdit.duration = -1;
      }
      this.mapShareService.setPlayerZones();
      this.mapShareService.setTileZones();
  }

  setTileZoneSize(square:Square){
      var squareSize = +$("#squarecontainer").css("height").split("px")[0];
      for (var i = 0 ; i < square.zones.length ; i++){
          var label = square.zones[i].label;
          var radius = square.zones[i].radius;
          var zoneHeightWidth = +(radius / this.squareSize).toFixed(1);
          var zoneHeightWidth = (zoneHeightWidth*squareSize);
          var zoneHeightWidthScale = zoneHeightWidth+"px";
          console.log("radius " + radius + ". top: " + -(squareSize/2));
          $("#tileZone"+square.id+i).css({
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
}
