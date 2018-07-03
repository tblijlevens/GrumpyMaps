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
  selectedFile:File;
  theFileContents;
  imgString:string;

  createPlayerForm = new FormGroup({
    playerName: new FormControl(),
    playerColor: new FormControl(),
    playerMovement: new FormControl()
  });

  createItemForm = new FormGroup({
    itemName: new FormControl(),
    itemColor: new FormControl(),
    itemAmount: new FormControl()
  });

  getObjectForm = new FormGroup({
      playerMovement: new FormControl(),
      objectAmount: new FormControl()
  });

  constructor(private mapShareService: MapShareService) { }

  ngOnInit() {
      this.mapShareService.squareUpdated.subscribe(square => this.square =square);
      this.createPlayerForm.get('playerMovement').setValue(1);
      this.createPlayerForm.get('playerColor').setValue("#000");
  }

  onFileChanged(event) {
      // This grabs the file contents when the file changes
      this.selectedFile = event.target.files[0];

      // Instantiate FileReader
      var reader = new FileReader();
      reader.onload = ()=> {
          var iconUrl = reader.result;
          // Update the output to include the <img> tag with the data URL as the source
          $("#showPic").html("<img width='100' src='"+iconUrl+"' />");
      };
      // Produce a data URL (base64 encoded string of the data in the file)
      // We are retrieving the first file from the FileList object
      reader.readAsDataURL(this.selectedFile);
  }


  setPlayerIconUrl(player:Player){
      var reader = new FileReader();
      reader.onload = ()=>{
          player.playerIconUrl = reader.result;
      };
      reader.readAsDataURL(player.playerIcon);
  }

  addPlayer(){
      const name = this.createPlayerForm.get('playerName').value;
      const color = this.createPlayerForm.get('playerColor').value;
      const movement = +this.createPlayerForm.get('playerMovement').value;

      var player:Player = new Player(this.playerIdGenerator--, this.playerIdCreator++, name, 100, movement, 3, 2, "physical", color, this.square.mapSquareId, this.square.mapHeightWidth, this.square.mapCoordinate, this.selectedFile);
      this.setPlayerIconUrl(player);
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
