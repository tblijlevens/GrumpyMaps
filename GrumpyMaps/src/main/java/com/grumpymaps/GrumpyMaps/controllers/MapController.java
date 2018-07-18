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

import com.grumpymaps.GrumpyMaps.model.DndMap;
import com.grumpymaps.GrumpyMaps.model.Square;
import com.grumpymaps.GrumpyMaps.model.SquareIds;
import com.grumpymaps.GrumpyMaps.model.PlayerIds;
import com.grumpymaps.GrumpyMaps.model.Player;
import com.grumpymaps.GrumpyMaps.services.MapService;
import com.grumpymaps.GrumpyMaps.services.SquareService;
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
	private PlayerService playerService;

	  @ResponseBody
	  @RequestMapping(value = "/test", method = RequestMethod.GET)
	  public  String  test() {
	    return "hoi";
	  }

	  @ResponseBody
	  @RequestMapping(value = "/dndmap", method = RequestMethod.POST)
	  public  Long  createMap(@RequestBody DndMap dndMap) {
		System.out.println("Saving map " + dndMap.getId());
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
			 System.out.println("Character " + p.getName());
			 Player retour = playerService.save(p);
			 playerIds.add(new PlayerIds(retour.getId(), retour.getPlayerSquareId()));
		 }
		return playerIds;
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
	  @RequestMapping(value = "/players/{mapId}", method = RequestMethod.GET)
	  public List<Player> findMapPlayers(@PathVariable("mapId") Integer mapId) {
		  List<Player> mapPlayers = (List<Player>)playerService.findByMapId(mapId);
		  System.out.println("Loading " + mapPlayers.size() + " characters for map " + mapId);
	    return mapPlayers;
	  }

	  @ResponseBody
	  @RequestMapping(value = "/player/{sqId}", method = RequestMethod.GET)
	  public Player findPlayerByRealSquareId(@PathVariable("sqId") Integer sqId) {
		  Player player = (Player)playerService.findByRealSquareId(sqId);
		  System.out.println("Loading " + player.getName());

	    return player;
	  }
}
