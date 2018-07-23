import { Player } from './player';

export class Square {
    id:number;
  mapSquareId: number;
  mapCoordinate:string;
  squareHeightWidth: string;
  squareSize: number;
  currentDistance:number = 9999;
  mapHeightWidth: number;
  obstructed: boolean = false;
  inRange: boolean = false;
  mapId:number;
  players: Player[] = new Array();
  numberofPlayers:number;

  constructor(id:number, mapSquareId: number, squareSize: number, squareHeightWidth: string, heightWidth: number) {
    this.id = id;
    this.mapSquareId = mapSquareId;
    this.squareHeightWidth = squareHeightWidth;
    this.squareSize = squareSize;
    this.mapHeightWidth = heightWidth;
    //this.addTestPlayer();
  }

  setMapId(mapId:number){
      this.mapId = mapId;
  }

  addPhysical(player: Player) {
    player.setMapSquareId(this.mapSquareId);
    player.squareMapCoordinate = this.mapCoordinate;
    this.players.push(player);
    this.numberofPlayers=this.players.length;
  }

  addTestPlayer(){
      if (this.mapSquareId%2==0){
          var player:Player = new Player(1, 1, "name", 100, 10, 3, 2, "physical", "green", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player= new Player(1, 1, "haha", 100, 10, 3, 2, "physical", "purple", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player = new Player(1, 1, "name", 100, 10, 3, 2, "physical", "green", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player= new Player(1, 1, "haha", 100, 10, 3, 2, "physical", "purple", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player = new Player(1, 1, "name", 100, 10, 3, 2, "physical", "green", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player= new Player(1, 1, "haha", 100, 10, 3, 2, "physical", "purple", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player = new Player(1, 1, "name", 100, 10, 3, 2, "physical", "green", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player= new Player(1, 1, "haha", 100, 10, 3, 2, "physical", "purple", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player = new Player(1, 1, "name", 100, 10, 3, 2, "physical", "green", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player= new Player(1, 1, "haha", 100, 10, 3, 2, "physical", "purple", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
      }
      else if (this.mapSquareId%3==0){
          player = new Player(1, 1, "name", 100, 10, 3, 2, "physical", "green", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player= new Player(1, 1, "haha", 100, 10, 3, 2, "physical", "purple", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player = new Player(1, 1, "name", 100, 10, 3, 2, "physical", "green", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player= new Player(1, 1, "haha", 100, 10, 3, 2, "physical", "purple", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player = new Player(1, 1, "name", 100, 10, 3, 2, "physical", "green", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player= new Player(1, 1, "haha", 100, 10, 3, 2, "physical", "purple", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player = new Player(1, 1, "name", 100, 10, 3, 2, "physical", "green", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player= new Player(1, 1, "haha", 100, 10, 3, 2, "physical", "purple", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
      }

      else {
          player = new Player(1, 1, "name", 100, 10, 3, 2, "physical", "green", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);
          player= new Player(1, 1, "haha", 100, 10, 3, 2, "physical", "purple", this.mapSquareId, this.mapHeightWidth, this.mapCoordinate, "", this.mapId);
          this.addPhysical(player);

      }
  }

  removePhysical(id) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].id == id) {
        this.players.splice(i, 1);
        this.numberofPlayers=this.players.length;
      }
    }
  }

}
