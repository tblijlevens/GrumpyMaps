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
      this.setAllActiveColors();
  }
  playerNameColor = {};
  playerIdGenerator:number=0;
  selectedFile:File = null;
  iconUrl;
  fileName;
  fileType;
  fileValue;

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

  imageForm:FormGroup;

  constructor(private mapShareService: MapShareService, private fb: FormBuilder) {
    this.createImageForm();
  }

  ngOnInit() {
      this.mapShareService.squareUpdated.subscribe(square => {this.square =square});
      this.createPlayerForm.get('playerColor').setValue("#ff0000");
      this.createPlayerForm.get('playerMovement').setValue(1);
  }
  createImageForm() {
      this.imageForm = this.fb.group({
        image: null
      });
    }

// TODO try sending it as FormData: https://nehalist.io/uploading-files-in-angular2/
  onFileChanged(event) {
      // This grabs the file contents when the file changes
      this.selectedFile = event.target.files[0];

      // Instantiate FileReader
      var reader = new FileReader();
      reader.onload = ()=> {
          this.iconUrl = reader.result;
          // Update the output to include the <img> tag with the data URL as the source
          $("#showPic").html("<img width='100' src='"+this.iconUrl+"' />");
          this.fileName = this.selectedFile.name;
          this.fileType = this.selectedFile.type;
          this.fileValue = reader.result.split(',')[1];
          console.log(this.fileName);
          console.log(this.fileType);
          //console.log(this.fileValue);
      };
      // Produce a data URL (base64 encoded string of the data in the file)
      // We are retrieving the first file from the FileList object
      reader.readAsDataURL(this.selectedFile);

      //might only need the following:
      if(event.target.files.length > 0) {
     let file = event.target.files[0];
     this.imageForm.get('image').setValue(file);
   }
  }

  private prepareSave(): any {
      let input = new FormData();
      input.append('image', this.imageForm.get('image').value);
      return input;
    }

  setPlayerIconUrl(player:Player){
    //   var reader = new FileReader();
    //   reader.onload = ()=>{
    //       player.playerIconUrl = reader.result;
    //   };
    //   reader.readAsDataURL(player.playerIcon);

    player.playerIconUrl = this.iconUrl;
    //console.log("players iconUrl set to: " + player.playerIconUrl);
  }

  private setSquareStyles(){
      if (this.setStyles){
          this.setStylesEvent.emit(false);
      }
      else{
          this.setStylesEvent.emit(true);
      }
  }
  obstructSelection(){
      for (var i = 0 ; i < this.selectedSquares.length ; i++){
          if (this.selectedSquares[i].obstructed ==false){
              this.selectedSquares[i].obstructed = true;
          }
          else{
              this.selectedSquares[i].obstructed = false;
          }
      }
      this.selectedSquares = new Array();

      // make all squares set their styles:
      this.setSquareStyles();
  }

  addPlayer(){
      const name = this.createPlayerForm.get('playerName').value;
      const color = this.createPlayerForm.get('playerColor').value;
      const movement = +this.createPlayerForm.get('playerMovement').value;
      const imageFormModel = this.prepareSave();
      console.log("imageFormModel: " + imageFormModel);
      if (this.selectedSquares.length>1){
          for (var i = 0 ; i < this.selectedSquares.length ; i++){
              var player:Player = new Player(this.playerIdGenerator--, this.playerIdCreator++, name+" "+i, 100, movement, 3, 2, "physical", color, this.square.mapSquareId, this.square.mapHeightWidth, this.square.mapCoordinate, this.selectedFile, this.square.mapId);
              if (player.playerIcon!=null){
                  this.setPlayerIconUrl(player);
              }
              this.selectedSquares[i].addPhysical(player);
              this.playerAddedEvent.emit(player);
          }
          this.selectedSquares = new Array();
          this.setSquareStyles();
      }
      else{
          var player:Player = new Player(this.playerIdGenerator--, this.playerIdCreator++, name, 100, movement, 3, 2, "physical", color, this.square.mapSquareId, this.square.mapHeightWidth, this.square.mapCoordinate, this.selectedFile, this.square.mapId);
          if (player.playerIcon!=null){
              this.setPlayerIconUrl(player);
          }
          this.square.addPhysical(player);
          this.playerAddedEvent.emit(player);
      }

      this.clearAllFields();
  }

  clearAllFields(){
      this.createPlayerForm.get('playerName').setValue("");
      this.createPlayerForm.get('playerMovement').setValue(1);
      this.createItemForm.get('itemName').setValue("");
      this.createItemForm.get('itemAmount').setValue(1);
  }

  clickPlayer(player: Player) {
      this.deselectAllCharacters();
      this.setAllActiveColors();
      player.isSelected = true;
      player.setActiveColor();
      this.selectedPlayer = player;
      this.setPlayerToMoveEvent.emit(player);

      this.showRange(player);
  }

  deselectAllCharacters(){
      for (var i=0 ; i<this.allCharacters.length;i++){
          this.allCharacters[i].isSelected=false;
      }
  }
  setAllActiveColors(){
      for (var i=0 ; i<this.allCharacters.length;i++){
          this.allCharacters[i].setActiveColor();
      }
  }
  showRange(player:Player){
      var allRangeSquares = player.getMoveRange();
      this.setRangeSquaresEvent.emit(allRangeSquares);
  }


  moveObject() {
          if(this.selectedPlayer.isSelected) {
              this.movementMode = true;
              this.moveModeEvent.emit(this.movementMode);
              this.setPlayerToMoveEvent.emit(this.selectedPlayer);
              this.square.removePhysical(this.selectedPlayer.id);
          }
  }
}
