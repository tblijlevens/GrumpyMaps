package com.grumpymaps.GrumpyMaps.services;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.grumpymaps.GrumpyMaps.model.CharZone;


@Repository
public interface CharZoneService extends CrudRepository<CharZone, Long>{

    public List<CharZone> findByMapId(Integer mapId);
    public List<CharZone> findByRealCharId(Integer charId);
    public void deleteByMapId(int mapId);


}
