
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import {DnDMap} from './domain/dn-dmap';
import {Square} from './domain/square';
import {Player} from './domain/player';

@Injectable({
  providedIn: 'root'
})
export class DnDMapService {

  constructor(private http: HttpClient) { }

  saveMap(dndMap : DnDMap){
      console.log("sending map");

      return this.http.post('http://localhost:8080/dndmap', dndMap);
 /* .catch((error: any) => Observable.throw(error.json().error || 'Server error'))*/;
}

  saveSquares(squares : Square[]){
      console.log("sending squares");
      return this.http.post('http://localhost:8080/squares', squares);
}

  savePlayers(players : Player[]){
      console.log("sending players");
      return this.http.post('http://localhost:8080/players', players);
}


findAllMaps(): Observable<DnDMap[]>  {
    console.log("getting all maps");
    return <Observable<DnDMap[]>>this.http.get('http://localhost:8080/dndmap');
}


getMapSquares(mapId:number): Observable<Square[]>  {
    console.log("getting all squares from map " + mapId);
    return <Observable<Square[]>>this.http.get('http://localhost:8080/square/'+mapId);
}

findPlayerByRealSquareId(sqId:number): Observable<Player>  {
    console.log("getting a player");
    return <Observable<Player>>this.http.get('http://localhost:8080/player/'+sqId);
}
//
//
// saveMap(dndMap : DnDMap){
//     console.log("sending map");
//
//     return this.http.post('https://grumpy-maps.herokuapp.com/dndmap', dndMap);
// /* .catch((error: any) => Observable.throw(error.json().error || 'Server error'))*/;
// }
//
// saveSquare(square : Square){
//     console.log("sending square");
//     return this.http.post('https://grumpy-maps.herokuapp.com/square', square);
// }
// savePlayer(player : Player){
//     console.log("sending player");
//     return this.http.post('https://grumpy-maps.herokuapp.com/player', player);
// }
//
//
// findAllMaps(): Observable<DnDMap[]>  {
//   console.log("getting all maps");
//   return <Observable<DnDMap[]>>this.http.get('https://grumpy-maps.herokuapp.com/dndmap');
// }
//
//
// getMapSquares(mapId:number): Observable<Square[]>  {
//   console.log("getting all squares from map " + mapId);
//   return <Observable<Square[]>>this.http.get('https://grumpy-maps.herokuapp.com/square/'+mapId);
// }
//
// findPlayerByRealSquareId(sqId:number): Observable<Player>  {
//   console.log("getting a player");
//   return <Observable<Player>>this.http.get('https://grumpy-maps.herokuapp.com/player/'+sqId);
// }

}
