package com.grumpymaps.GrumpyMaps.services;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.grumpymaps.GrumpyMaps.model.Player;


@Repository
public interface PlayerService extends CrudRepository<Player, Long>{

    public Player findByRealSquareId(Integer sqId);
    public List<Player> findByMapId(Integer mapId);
    public void deleteByMapId(int mapId);

}
