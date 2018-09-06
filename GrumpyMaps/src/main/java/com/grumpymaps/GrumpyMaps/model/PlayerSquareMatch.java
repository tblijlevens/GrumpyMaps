package com.grumpymaps.GrumpyMaps.model;

import java.io.Serializable;
import java.util.ArrayList;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

@Entity
public class PlayerSquareMatch{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private long playerId;
    private long squareId;
    private String squareMapCoordinate;
    private long mapId;

    /**
	* Default PlayerSquareMatch constructor
	*/
	public PlayerSquareMatch(long id, long playerId, long squareId, String squareMapCoordinate, long mapId) {
		super();
		this.id = id;
		this.playerId = playerId;
		this.squareId = squareId;
		this.squareMapCoordinate = squareMapCoordinate;
		this.mapId = mapId;
	}


	/**
	* Returns value of id
	* @return
	*/
	public long getId() {
		return id;
	}

	/**
	* Sets new value of id
	* @param
	*/
	public void setId(long id) {
		this.id = id;
	}

	/**
	* Returns value of playerId
	* @return
	*/
	public long getPlayerId() {
		return playerId;
	}

	/**
	* Sets new value of playerId
	* @param
	*/
	public void setPlayerId(long playerId) {
		this.playerId = playerId;
	}

	/**
	* Returns value of squareId
	* @return
	*/
	public long getSquareId() {
		return squareId;
	}

	/**
	* Sets new value of squareId
	* @param
	*/
	public void setSquareId(long squareId) {
		this.squareId = squareId;
	}

	/**
	* Returns value of squareMapCoordinate
	* @return
	*/
	public String getSquareMapCoordinate() {
		return squareMapCoordinate;
	}

	/**
	* Sets new value of squareMapCoordinate
	* @param
	*/
	public void setSquareMapCoordinate(String squareMapCoordinate) {
		this.squareMapCoordinate = squareMapCoordinate;
	}

	/**
	* Returns value of mapId
	* @return
	*/
	public long getMapId() {
		return mapId;
	}

	/**
	* Sets new value of mapId
	* @param
	*/
	public void setMapId(long mapId) {
		this.mapId = mapId;
	}

	/**
	* Default empty PlayerSquareMatch constructor
	*/
	public PlayerSquareMatch() {
		super();
	}


}
