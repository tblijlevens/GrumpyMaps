import { Component, OnInit, Input } from '@angular/core';
import {MapShareService} from '../map-share.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Square } from '../domain/square';
import { Player } from '../domain/player';


@Component({
  selector: 'app-square-detail',
  templateUrl: './square-detail.component.html',
  styleUrls: ['./square-detail.component.css']
})
export class SquareDetailComponent implements OnInit {

    square:Square;
    movementMode:boolean = false;
    selectedPlayer:Player;

    createObjectForm = new FormGroup({
      playerName: new FormControl(),
      playerColor: new FormControl(),
      playerMovement: new FormControl()
    });

  constructor(private mapShareService: MapShareService) { }

  ngOnInit() {
      this.mapShareService.squareUpdated.subscribe(square => this.square =square);

//      this.squareId = this.mapShareService.squareId;
  }

  addObject(){
      var playerJan:Player = new Player(1, "Jan de Man", 100, 2, 3, 2, "physical", "yellow", this.square.mapSquareId, this.square.mapHeightWidth);
      var playerBert:Player = new Player(2, "Bertje Buffelmelk", 100, 3, 3, 2, "physical", "blue", this.square.mapSquareId, this.square.mapHeightWidth);
      var playerKarel:Player = new Player(3, "Karel de Kerel", 100, 4, 3, 2, "physical", "green", this.square.mapSquareId, this.square.mapHeightWidth);
      this.square.addPhysical(playerJan);
      this.square.addPhysical(playerBert);
      this.square.addPhysical(playerKarel);
  }
  showRange(player:Player){
      var allRangeSquares = player.moveRange;
      player.isSelected = true;
      console.log(player.name + " has range: " + player.moveRange);
      this.mapShareService.setAllRangeSquares(allRangeSquares);
  }

  moveObject() {
    var selectedPlayer;
    for(var i = 0; i < this.square.players.length; i++) {
      if(this.square.players[i].isSelected) {
        selectedPlayer = this.square.players[i];
        this.movementMode = true;
        this.mapShareService.setMovementMode(true);
        this.mapShareService.setPlayerToMove(selectedPlayer);
        this.square.removePhysical(selectedPlayer.id);
      }
    }
    console.log(this.movementMode + "Move mentMode uit");
  }
}
