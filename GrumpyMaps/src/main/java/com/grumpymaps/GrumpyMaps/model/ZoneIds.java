package com.grumpymaps.GrumpyMaps.model;

public class ZoneIds {

    private long id;
    private int zoneSquareId;


	/**
	* Default SquareId constructor
	*/
	public ZoneIds(long id, int zoneSquareId) {
		super();
		this.id = id;
		this.zoneSquareId = zoneSquareId;
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
	* Returns value of zoneSquareId
	* @return
	*/
	public int getZoneSquareId() {
		return zoneSquareId;
	}

	/**
	* Sets new value of zoneSquareId
	* @param
	*/
	public void setZoneSquareId(int zoneSquareId) {
		this.zoneSquareId = zoneSquareId;
	}
}
