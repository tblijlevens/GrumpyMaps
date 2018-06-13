package com.grumpymaps.GrumpyMaps.model;

public class PlayerIds {

    private long id;
    private int playerSquareId;


	/**
	* Default SquareId constructor
	*/
	public PlayerIds(long id, int playerSquareId) {
		super();
		this.id = id;
		this.playerSquareId = playerSquareId;
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
	* Returns value of playerSquareId
	* @return
	*/
	public int getPlayerSquareId() {
		return playerSquareId;
	}

	/**
	* Sets new value of playerSquareId
	* @param
	*/
	public void setPlayerSquareId(int playerSquareId) {
		this.playerSquareId = playerSquareId;
	}
}
