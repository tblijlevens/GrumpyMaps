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
      this.mapShareService.zonesUpdated.subscribe(booleanValue => {
         this.setAllPlayerZones();
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

}
