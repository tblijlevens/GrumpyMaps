package com.grumpymaps.GrumpyMaps.services;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.grumpymaps.GrumpyMaps.model.DndMap;


@Repository
public interface MapService extends CrudRepository<DndMap, Long>{

}
