package com.grumpymaps.GrumpyMaps.services;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.grumpymaps.GrumpyMaps.model.PlayerSquareMatch;


@Repository
public interface PlayerSquareMatchService extends CrudRepository<PlayerSquareMatch, Long>{

    public List<PlayerSquareMatch> findByMapId(long mapId);
    public PlayerSquareMatch findByPlayerIdAndMapId(long playerId, long mapId);
    public boolean existsByPlayerIdAndMapId(long playerId, long mapId);
    public void deleteByMapId(long mapId);
    public void deleteByPlayerId(long playerId);

}
