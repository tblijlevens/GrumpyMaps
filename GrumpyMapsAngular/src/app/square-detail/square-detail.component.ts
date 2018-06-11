import { Component, OnInit, Input } from '@angular/core';
import {MapShareService} from '../map-share.service';
import { Square } from '../domain/square';
import { Player } from '../domain/player';


@Component({
  selector: 'app-square-detail',
  templateUrl: './square-detail.component.html',
  styleUrls: ['./square-detail.component.css']
})
export class SquareDetailComponent implements OnInit {

    square:Square;
  constructor(private mapShareService: MapShareService) { }

  ngOnInit() {
      this.mapShareService.squareUpdated.subscribe(square => this.square =square);
//      this.squareId = this.mapShareService.squareId;
  }

  addObject(){
      console.log(this.square.players);
      var playerJan:Player = new Player(1, "Jan de Man", 100, 2, 3, 2, "physical", "yellow", this.square.mapSquareId, this.square.mapHeightWidth);
      var playerBert:Player = new Player(2, "Bertje Buffelmelk", 100, 3, 3, 2, "physical", "blue", this.square.mapSquareId, this.square.mapHeightWidth);
      this.square.addPhysical(playerJan);
      this.square.addPhysical(playerBert);
  }
  showRange(player:Player){
      var allRangeSquares = player.moveRange;
      console.log(player.id + " has range: " + player.moveRange);
      this.mapShareService.setAllRangeSquares(allRangeSquares);
  }

}
