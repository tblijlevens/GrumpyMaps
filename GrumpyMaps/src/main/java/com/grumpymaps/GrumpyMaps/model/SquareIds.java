package com.grumpymaps.GrumpyMaps.model;

public class SquareIds {

    private long id;
    private int mapSquareId;


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
	* Returns value of mapSquareId
	* @return
	*/
	public int getMapSquareId() {
		return mapSquareId;
	}

	/**
	* Sets new value of mapSquareId
	* @param
	*/
	public void setMapSquareId(int mapSquareId) {
		this.mapSquareId = mapSquareId;
	}

	/**
	* Default SquareId constructor
	*/
	public SquareIds(long id, int mapSquareId) {
		super();
		this.id = id;
		this.mapSquareId = mapSquareId;
	}
}
