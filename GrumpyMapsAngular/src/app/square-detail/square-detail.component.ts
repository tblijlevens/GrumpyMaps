import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { MapShareService } from '../map-share.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Square } from '../domain/square';
import { Player } from '../domain/player';


@Component({
  selector: 'app-square-detail',
  templateUrl: './square-detail.component.html',
  styleUrls: ['./square-detail.component.css']
})
export class SquareDetailComponent implements OnInit {

  square: Square;
  playerIdCreator: number = 1;
  movementMode: boolean = false;
  @Output() moveModeEvent = new EventEmitter<boolean>();
  @Output() setRangeSquaresEvent = new EventEmitter<number[]>();
  @Output() setPlayerToMoveEvent = new EventEmitter<Player>();
  @Output() playerAddedEvent = new EventEmitter<Player>();
  playerToMove:Player;
  previousPlayer: Player;
  movable: boolean = false;
  playerNameColor = {};
  previousPlayerColor: string;
  playerIdGenerator:number=0;

  createObjectForm = new FormGroup({
    playerName: new FormControl(),
    playerColor: new FormControl(),
    playerMovement: new FormControl()
  });

  constructor(private mapShareService: MapShareService) { }

  ngOnInit() {
      this.mapShareService.squareUpdated.subscribe(square => this.square =square);
      this.createObjectForm.get('playerMovement').setValue(1);
      this.createObjectForm.get('playerColor').setValue("#000");
  }

  addObject(){
      const name = this.createObjectForm.get('playerName').value;
      const color = this.createObjectForm.get('playerColor').value;
      const movement = +this.createObjectForm.get('playerMovement').value;

      var player:Player = new Player(this.playerIdGenerator--, this.playerIdCreator++, name, 100, movement, 3, 2, "physical", color, this.square.mapSquareId, this.square.mapHeightWidth);

      this.square.addPhysical(player);
  }

  clickPlayer(player: Player) {
      if (this.previousPlayer !=null){
        this.previousPlayer.isSelected = false;
        this.previousPlayer.setActiveColor();
      }
      player.isSelected = true;
      player.setActiveColor();
      this.playerToMove = player;
      this.setPlayerToMoveEvent.emit(player);

      this.showRange(player);
      this.previousPlayer = player;
        }

  showRange(player:Player){
      var allRangeSquares = player.getMoveRange();
      this.setRangeSquaresEvent.emit(allRangeSquares);
      this.movable = true;
  }


  moveObject() {
      if (this.movable){
          if(this.playerToMove.isSelected) {
              this.movementMode = true;
              this.moveModeEvent.emit(this.movementMode);
              this.setPlayerToMoveEvent.emit(this.playerToMove);
              this.square.removePhysical(this.playerToMove.id);
          }
          this.movable = false;
      }
  }
}
