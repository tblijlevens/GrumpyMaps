
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

//   saveMap(dndMap : DnDMap){
//       console.log("sending map");
//
//       return this.http.post('http://localhost:8080/dndmap', dndMap);
//  /* .catch((error: any) => Observable.throw(error.json().error || 'Server error'))*/;
// }
//
//   saveSquares(squares : Square[]){
//       console.log("sending squares");
//       return this.http.post('http://localhost:8080/squares', squares);
// }
//
//   saveTileZones(zones : any[]){
//       console.log("sending tile zones");
//       return this.http.post('http://localhost:8080/squareZones', zones);
// }
//
//   savePlayers(players : Player[]){
//       console.log("sending players");
//       return this.http.post('http://localhost:8080/players', players);
// }
//
// saveCharZones(zones : any[]){
//     console.log("sending character zones");
//     return this.http.post('http://localhost:8080/charZones', zones);
// }
//
//
// findAllMaps(): Observable<DnDMap[]>  {
//     console.log("getting all maps");
//     return <Observable<DnDMap[]>>this.http.get('http://localhost:8080/dndmap');
// }
//
// deleteMapById(mapId:number) {
//     console.log("deleting map: " + mapId);
//     return <Observable<string>>this.http.delete('http://localhost:8080/dndmap/'+mapId);
// }
//
//
//
// getMapSquares(mapId:number): Observable<Square[]>  {
//     console.log("getting all squares from map " + mapId);
//     return <Observable<Square[]>>this.http.get('http://localhost:8080/square/'+mapId);
// }
//
// getAllSquareZones(mapId:number): Observable<any[]>  {
//     console.log("getting all tilezones from map " + mapId);
//     return <Observable<any[]>>this.http.get('http://localhost:8080/squareZones/'+mapId);
// }
//
// getAllPlayers(mapId:number): Observable<Player[]>  {
//     console.log("getting all players from map " + mapId);
//     return <Observable<Player[]>>this.http.get('http://localhost:8080/players/'+mapId);
// }
// findAllPlayers(): Observable<Player[]>  {
//     console.log("getting all characters");
//     return <Observable<Player[]>>this.http.get('http://localhost:8080/players');
// }
//
// getAllCharZones(mapId:number): Observable<any[]>  {
//     console.log("getting all charzones from map " + mapId);
//     return <Observable<any[]>>this.http.get('http://localhost:8080/charZones/'+mapId);
// }
// getAllCharZonesById(charId:number): Observable<any[]>  {
//     console.log("getting all charzones for char " + charId);
//     return <Observable<any[]>>this.http.get('http://localhost:8080/charZones2/'+charId);
// }
//
// findPlayerByRealSquareId(sqId:number): Observable<Player>  {
//     console.log("getting a player");
//     return <Observable<Player>>this.http.get('http://localhost:8080/player/'+sqId);
// }

////////////////////
//////////////////// PRODUCTION REQUEST HERE //////////////
////////////////////



  saveMap(dndMap : DnDMap){
      console.log("sending map");

      return this.http.post('https://grumpy-maps.herokuapp.com/dndmap', dndMap);
 /* .catch((error: any) => Observable.throw(error.json().error || 'Server error'))*/;
}

  saveSquares(squares : Square[]){
      console.log("sending squares");
      return this.http.post('https://grumpy-maps.herokuapp.com/squares', squares);
}

  saveTileZones(zones : any[]){
      console.log("sending tile zones");
      return this.http.post('https://grumpy-maps.herokuapp.com/squareZones', zones);
}

  savePlayers(players : Player[]){
      console.log("sending players");
      return this.http.post('https://grumpy-maps.herokuapp.com/players', players);
}

saveCharZones(zones : any[]){
    console.log("sending character zones");
    return this.http.post('https://grumpy-maps.herokuapp.com/charZones', zones);
}


findAllMaps(): Observable<DnDMap[]>  {
    console.log("getting all maps");
    return <Observable<DnDMap[]>>this.http.get('https://grumpy-maps.herokuapp.com/dndmap');
}

deleteMapById(mapId:number) {
    console.log("deleting map: " + mapId);
    return <Observable<string>>this.http.delete('https://grumpy-maps.herokuapp.com/dndmap/'+mapId);
}



getMapSquares(mapId:number): Observable<Square[]>  {
    console.log("getting all squares from map " + mapId);
    return <Observable<Square[]>>this.http.get('https://grumpy-maps.herokuapp.com/square/'+mapId);
}

getAllSquareZones(mapId:number): Observable<any[]>  {
    console.log("getting all tilezones from map " + mapId);
    return <Observable<any[]>>this.http.get('https://grumpy-maps.herokuapp.com/squareZones/'+mapId);
}

getAllPlayers(mapId:number): Observable<Player[]>  {
    console.log("getting all players from map " + mapId);
    return <Observable<Player[]>>this.http.get('https://grumpy-maps.herokuapp.com/players/'+mapId);
}
findAllPlayers(): Observable<Player[]>  {
    console.log("getting all characters");
    return <Observable<Player[]>>this.http.get('https://grumpy-maps.herokuapp.com/players');
}

getAllCharZones(mapId:number): Observable<any[]>  {
    console.log("getting all charzones from map " + mapId);
    return <Observable<any[]>>this.http.get('https://grumpy-maps.herokuapp.com/charZones/'+mapId);
}
getAllCharZonesById(charId:number): Observable<any[]>  {
    console.log("getting all charzones for char " + charId);
    return <Observable<any[]>>this.http.get('https://grumpy-maps.herokuapp.com/charZones2/'+charId);
}

findPlayerByRealSquareId(sqId:number): Observable<Player>  {
    console.log("getting a player");
    return <Observable<Player>>this.http.get('https://grumpy-maps.herokuapp.com/player/'+sqId);
}

}
