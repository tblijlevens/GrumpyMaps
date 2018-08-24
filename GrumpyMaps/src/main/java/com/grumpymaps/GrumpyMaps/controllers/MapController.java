package com.grumpymaps.GrumpyMaps.controllers;

import java.util.List;
import java.util.ArrayList;

import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.transaction.annotation.Transactional;

import com.grumpymaps.GrumpyMaps.model.DndMap;
import com.grumpymaps.GrumpyMaps.model.Square;
import com.grumpymaps.GrumpyMaps.model.SquareIds;
import com.grumpymaps.GrumpyMaps.model.ZoneIds;
import com.grumpymaps.GrumpyMaps.model.TileZone;
import com.grumpymaps.GrumpyMaps.model.CharZone;
import com.grumpymaps.GrumpyMaps.model.PlayerIds;
import com.grumpymaps.GrumpyMaps.model.Player;
import com.grumpymaps.GrumpyMaps.services.MapService;
import com.grumpymaps.GrumpyMaps.services.SquareService;
import com.grumpymaps.GrumpyMaps.services.TileZoneService;
import com.grumpymaps.GrumpyMaps.services.CharZoneService;
import com.grumpymaps.GrumpyMaps.services.PlayerService;

@CrossOrigin(origins = "http://localhost:4200")
//@CrossOrigin(origins = "http://www.umanise.nl")
@Controller
public class MapController {

	@Autowired
	private MapService mapService;
	@Autowired
	private SquareService squareService;
	@Autowired
	private TileZoneService tilezoneService;
	@Autowired
	private CharZoneService charzoneService;
	@Autowired
	private PlayerService playerService;


	  @ResponseBody
	  @RequestMapping(value = "/test", method = RequestMethod.GET)
	  public  String  test() {
	    return "hoi";
	  }

	  @Transactional
	  @ResponseBody
	  @RequestMapping(value = "/dndmap", method = RequestMethod.POST)
	  public  Long  createMap(@RequestBody DndMap dndMap) {

		System.out.println("Saving map " + dndMap.getId());

		int mapId = (int)dndMap.getId();

		if (mapService.existsById(dndMap.getId())){
			charzoneService.deleteByMapId(mapId);
			tilezoneService.deleteByMapId(mapId);
			playerService.deleteByMapId(mapId);
			squareService.deleteByMapId(mapId);
			mapService.deleteById(dndMap.getId());
		}

	    return mapService.save(dndMap).getId();
	  }


	  @ResponseBody
	  @RequestMapping(value = "/squares", method = RequestMethod.POST)
	  public  ArrayList<SquareIds> createSquare(@RequestBody ArrayList<Square> squares) {
		  ArrayList<SquareIds> squareIds = new ArrayList<>();
		  System.out.println("Saving " + squares.size() + " squares");
		  for (Square s : squares){
			  Square retour = squareService.save(s);
			  squareIds.add(new SquareIds(retour.getId(), retour.getMapSquareId()));
		  }
	     return squareIds;
	  }

	  @ResponseBody
	  @RequestMapping(value = "/squareZones", method = RequestMethod.POST)
	  public  ArrayList<ZoneIds> createTileZone(@RequestBody ArrayList<TileZone> zones) {
		  ArrayList<ZoneIds> zoneIds = new ArrayList<>();
		  System.out.println("Saving " + zones.size() + " tile zones");
		  for (TileZone z : zones){
			  TileZone retour = tilezoneService.save(z);
			  zoneIds.add(new ZoneIds(retour.getId(), retour.getRealSquareId()));
		  }
		 return zoneIds;
	  }

	  @ResponseBody
	  @RequestMapping(value = "/player", method = RequestMethod.POST)
	  public  PlayerIds  createPlayer(@RequestBody Player player) {
		  Player retour = playerService.save(player);
  	  return new PlayerIds(retour.getId(), retour.getPlayerSquareId() );
	  }

	  @ResponseBody
	  @RequestMapping(value = "/players", method = RequestMethod.POST)
	  public  ArrayList<PlayerIds>  createPlayer(@RequestBody ArrayList<Player> players) {
		  ArrayList<PlayerIds> playerIds = new ArrayList<>();
		  System.out.println("Saving " + players.size() + " characters:");
		 for (Player p : players){
			 System.out.println("- Character " + p.getName());
			 Player retour = playerService.save(p);
			 playerIds.add(new PlayerIds(retour.getId(), retour.getPlayerSquareId()));
		 }
		return playerIds;
	  }

	  @ResponseBody
	  @RequestMapping(value = "/charZones", method = RequestMethod.POST)
	  public  ArrayList<ZoneIds> createCharZone(@RequestBody ArrayList<CharZone> zones) {
		  ArrayList<ZoneIds> zoneIds = new ArrayList<>();
		  System.out.println("Saving " + zones.size() + " character zones");
		  for (CharZone z : zones){
			  CharZone retour = charzoneService.save(z);
			  zoneIds.add(new ZoneIds(retour.getId(), retour.getRealCharId()));
		  }
		  return zoneIds;
	  }

	  @ResponseBody
	  @RequestMapping(value = "/dndmap", method = RequestMethod.GET)
	  public List<DndMap> findAll() {
		  System.out.println("Loading all maps");
	    return (List<DndMap>)mapService.findAll();
	  }

	  @ResponseBody
	  @RequestMapping(value = "/square/{mapId}", method = RequestMethod.GET)
	  public List<Square> findMapSquares(@PathVariable("mapId") Integer mapId) {
		  List<Square> mapSquares = (List<Square>)squareService.findByMapId(mapId);
		  System.out.println("Loading " + mapSquares.size() + " squares for map " + mapId);
	    return mapSquares;
	  }

	  @ResponseBody
	  @RequestMapping(value = "/squareZones/{mapId}", method = RequestMethod.GET)
	  public List<TileZone> findMapZones(@PathVariable("mapId") Integer mapId) {
		  List<TileZone> mapZones = (List<TileZone>)tilezoneService.findByMapId(mapId);
		  System.out.println("Loading " + mapZones.size() + " tile zones for map " + mapId);
	    return mapZones;
	  }

	  @ResponseBody
	  @RequestMapping(value = "/players/{mapId}", method = RequestMethod.GET)
	  public List<Player> findMapPlayers(@PathVariable("mapId") Integer mapId) {
		  List<Player> mapPlayers = (List<Player>)playerService.findByMapId(mapId);
		  System.out.println("Loading " + mapPlayers.size() + " characters for map " + mapId);
		  for (Player p : mapPlayers){
			  System.out.println("- Character " + p.getName());
		  }
	    return mapPlayers;
	  }
	  @ResponseBody
	  @RequestMapping(value = "/players", method = RequestMethod.GET)
	  public List<Player> findAllCharacters() {
		  System.out.println("Loading all characters");
		return (List<Player>)playerService.findAll();
	  }


	  @ResponseBody
	  @RequestMapping(value = "/charZones/{mapId}", method = RequestMethod.GET)
	  public List<CharZone> findCharZones(@PathVariable("mapId") Integer mapId) {
		  List<CharZone> charZones = (List<CharZone>)charzoneService.findByMapId(mapId);
		  System.out.println("Loading " + charZones.size() + " character zones for map " + mapId);
		  return charZones;
	  }

	  @ResponseBody
	  @RequestMapping(value = "/charZones2/{charId}", method = RequestMethod.GET)
	  public List<CharZone> findCharZonesById(@PathVariable("charId") Integer charId) {
		  List<CharZone> charZones = (List<CharZone>)charzoneService.findByRealCharId(charId);
		  System.out.println("Loading " + charZones.size() + " character zones for char " + charId);
		  return charZones;
	  }

	  @ResponseBody
	  @RequestMapping(value = "/player/{sqId}", method = RequestMethod.GET)
	  public Player findPlayerByRealSquareId(@PathVariable("sqId") Integer sqId) {
		  Player player = (Player)playerService.findByRealSquareId(sqId);
		  System.out.println("Loading " + player.getName());

	    return player;
	  }
}
