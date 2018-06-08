package com.grumpymaps.GrumpyMaps.model;

import java.io.Serializable;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

@Entity
public class Square implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private int mapSquareId;
    private String squareScale;
    private int squareSize;
    private boolean obstructed;

    @OneToMany(mappedBy="square", cascade=CascadeType.ALL)
    private List<Player> players;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="map_id")
    private DndMap dndMap;


	/**
	* Returns value of id
	* @return
	*/
	public int getId() {
		return id;
	}

	/**
	* Sets new value of id
	* @param
	*/
	public void setId(int id) {
		this.id = id;
	}

	/**
	* Returns value of id
	* @return
	*/
	public int getMapSquareId() {
		return mapSquareId;
	}

	/**
	* Sets new value of id
	* @param
	*/
	public void setMapSquareId(int mapSquareId) {
		this.mapSquareId = mapSquareId;
	}

	/**
	* Returns value of squareScale
	* @return
	*/
	public String getSquareScale() {
		return squareScale;
	}

	/**
	* Sets new value of squareScale
	* @param
	*/
	public void setSquareScale(String squareScale) {
		this.squareScale = squareScale;
	}

	/**
	* Returns value of squareSize
	* @return
	*/
	public int getSquareSize() {
		return squareSize;
	}

	/**
	* Sets new value of squareSize
	* @param
	*/
	public void setSquareSize(int squareSize) {
		this.squareSize = squareSize;
	}

	/**
	* Returns value of obstructed
	* @return
	*/
	public boolean getObstructed() {
		return obstructed;
	}

	/**
	* Sets new value of obstructed
	* @param
	*/
	public void setObstructed(boolean obstructed) {
		this.obstructed = obstructed;
	}

	/**
	* Returns value of players
	* @return
	*/
	public List<Player> getPlayers() {
		return players;
	}

	/**
	* Sets new value of players
	* @param
	*/
	public void setPlayers(List<Player> players) {
		this.players = players;
	}

	/**
	* Returns value of dndMap
	* @return
	*/
	public DndMap getDndMap() {
		return dndMap;
	}

	/**
	* Sets new value of dndMap
	* @param
	*/
	public void setDndMap(DndMap dndMap) {
		this.dndMap = dndMap;
	}
}
