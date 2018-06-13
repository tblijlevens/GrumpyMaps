import { Player } from './player';

export class Square {
    id:number;
  mapSquareId: number;
  squareScale: string;
  squareSize: number;
  mapHeightWidth: number;
  obstructed: boolean = false;
  inRange: boolean = false;
  mapId:number;
  players: Player[] = new Array();

  constructor(id:number, mapSquareId: number, squareSize: number, squareScale: string, heightWidth: number) {
    this.id = id;
    this.mapSquareId = mapSquareId;
    this.squareScale = squareScale;
    this.squareSize = squareSize;
    this.mapHeightWidth = heightWidth;
  }

  setMapId(mapId:number){
      this.mapId = mapId;
  }

  addPhysical(player: Player) {
    player.setMapSquareId(this.mapSquareId);
    this.players.push(player);
  }

  removePhysical(id) {
    for (var i = 0; i < this.players.length; i++) {
      if (this.players[i].id == id) {
        this.players.splice(i, 1);
      }
    }
  }
}
