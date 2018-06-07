
import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import {DnDMap} from './domain/dn-dmap';

@Injectable({
  providedIn: 'root'
})
export class DnDMapService {

  constructor(private http: HttpClient) { }

  saveMap(dndMap : DnDMap){
      console.log("sending...");

      return this.http.post('http://localhost:8080/dndmap', dndMap);
 /* .catch((error: any) => Observable.throw(error.json().error || 'Server error'))*/;
}

  findAll(): Observable<DnDMap[]>  {
    return <Observable<DnDMap[]>>this.http.get('http://localhost:8080/dndmap');
  }

}
