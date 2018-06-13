package com.grumpymaps.GrumpyMaps.services;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.grumpymaps.GrumpyMaps.model.Player;


@Repository
public interface PlayerService extends CrudRepository<Player, Long>{

}
