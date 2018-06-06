package com.grumpymaps.GrumpyMaps.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.grumpymaps.GrumpyMaps.model.DndMap;
import com.grumpymaps.GrumpyMaps.services.MapService;

@CrossOrigin(origins = "http://localhost:4200")
@Controller
public class MapController {

	@Autowired  
	private MapService mapService;
	
	  @ResponseBody
	  @RequestMapping(value = "/dndmap", method = RequestMethod.POST)
	  public  Long  create(@RequestBody DndMap dndMap) {
		  System.out.println(dndMap.getId() + " with " + dndMap.getNumberOfSquares() + "squares");
	    return mapService.save(dndMap).getId();
	  }
	  
	  //curl  http://localhost:8080/todo
	  @ResponseBody
	  @RequestMapping(value = "/dndmap", method = RequestMethod.GET)
	  public List<DndMap> findAll() {
	    return (List<DndMap>)mapService.findAll();
	  }
}
