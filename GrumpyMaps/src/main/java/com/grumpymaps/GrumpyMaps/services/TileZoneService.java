package com.grumpymaps.GrumpyMaps.services;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.grumpymaps.GrumpyMaps.model.TileZone;


@Repository
public interface TileZoneService extends CrudRepository<TileZone, Long>{

    public List<TileZone> findByMapId(Integer mapId);
    public void deleteByMapId(int mapId);

}
