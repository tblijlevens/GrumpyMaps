package com.grumpymaps.GrumpyMaps.model;

public class ZoneIds {

    private long id;
    private int realSquareCharId;


	/**
	* Default SquareId constructor
	*/
	public ZoneIds(long id, int realSquareCharId) {
		super();
		this.id = id;
		this.realSquareCharId = realSquareCharId;
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
	* Returns value of realSquareCharId
	* @return
	*/
	public int getrealSquareCharId() {
		return realSquareCharId;
	}

	/**
	* Sets new value of realSquareCharId
	* @param
	*/
	public void setrealSquareCharId(int realSquareCharId) {
		this.realSquareCharId = realSquareCharId;
	}
}
