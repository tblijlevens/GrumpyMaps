package com.grumpymaps.GrumpyMaps.services;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.grumpymaps.GrumpyMaps.model.Square;


@Repository
public interface SquareService extends CrudRepository<Square, Long>{

    public List<Square> findByMapId(Integer mapId);
    public void deleteByMapId(int mapId);
}
