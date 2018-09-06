package com.grumpymaps.GrumpyMaps.model;

import java.util.ArrayList;
import javax.persistence.Transient;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.io.File;
import javax.swing.ImageIcon;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.grumpymaps.GrumpyMaps.model.Image;

@Entity
public class Player implements Physical{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private int playerSquareId;
    private String name;
    private byte[] playerIcon;
    //private String playerIconUrl;

    private int initiative;
    private int actionPoints;
    private int movementAmount;
    private int movementLeft;
    private int attacksPerRound;
    private int attacksLeft;
    private int spellsPerRound;
    private int spellsLeft;
    private String type;
    private String color;
    private String activeColor;
    private Integer mapSquareId;
    private int mapHeightWidth;
    private boolean isSelected;
    private Integer realSquareId;
    private String squareMapCoordinate;
    private int mapId;
    @Transient
    private ArrayList<CharZone> zones;

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

	/**
	* Returns value of name
	* @return
	*/
	public String getName() {
		return name;
	}

	/**
	* Sets new value of name
	* @param
	*/
	public void setName(String name) {
		this.name = name;
	}

	/**
	* Returns value of playerIcon
	* @return
	*/
	public byte[] getPlayerIcon() {
		return playerIcon;
	}

	/**
	* Sets new value of playerIcon
	* @param
	*/
    @JsonProperty("image")
	public void setPlayerIcon(Image playerIcon) {
		this.playerIcon = playerIcon.getImage();
	}

    // /**
    // * Returns value of playerIconUrl
    // * @return
    // */
    // public String getPlayerIconUrl() {
    //     return playerIconUrl;
    // }
    //
    // /**
    // * Sets new value of playerIconUrl
    // * @param
    // */
    // public void setPlayerIconUrl(String playerIconUrl) {
    //     this.playerIconUrl = playerIconUrl;
    // }

	/**
	* Returns value of initiative
	* @return
	*/
	public int getInitiative() {
		return initiative;
	}

	/**
	* Sets new value of initiative
	* @param
	*/
	public void setInitiative(int initiative) {
		this.initiative = initiative;
	}

	/**
	* Returns value of actionPoints
	* @return
	*/
	public int getActionPoints() {
		return actionPoints;
	}

	/**
	* Sets new value of actionPoints
	* @param
	*/
	public void setActionPoints(int actionPoints) {
		this.actionPoints = actionPoints;
	}

	/**
	* Returns value of movementAmount
	* @return
	*/
	public int getMovementAmount() {
		return movementAmount;
	}

	/**
	* Sets new value of movementAmount
	* @param
	*/
	public void setMovementAmount(int movementAmount) {
		this.movementAmount = movementAmount;
	}

	/**
	* Returns value of movementLeft
	* @return
	*/
	public int getMovementLeft() {
		return movementLeft;
	}

	/**
	* Sets new value of movementLeft
	* @param
	*/
	public void setMovementLeft(int movementLeft) {
		this.movementLeft = movementLeft;
	}

	/**
	* Returns value of attacksPerRound
	* @return
	*/
	public int getAttacksPerRound() {
		return attacksPerRound;
	}

	/**
	* Sets new value of attacksPerRound
	* @param
	*/
	public void setAttacksPerRound(int attacksPerRound) {
		this.attacksPerRound = attacksPerRound;
	}

	/**
	* Returns value of attacksLeft
	* @return
	*/
	public int getAttacksLeft() {
		return attacksLeft;
	}

	/**
	* Sets new value of attacksLeft
	* @param
	*/
	public void setAttacksLeft(int attacksLeft) {
		this.attacksLeft = attacksLeft;
	}

	/**
	* Returns value of spellsPerRound
	* @return
	*/
	public int getSpellsPerRound() {
		return spellsPerRound;
	}

	/**
	* Sets new value of spellsPerRound
	* @param
	*/
	public void setSpellsPerRound(int spellsPerRound) {
		this.spellsPerRound = spellsPerRound;
	}

	/**
	* Returns value of spellsLeft
	* @return
	*/
	public int getSpellsLeft() {
		return spellsLeft;
	}

	/**
	* Sets new value of spellsLeft
	* @param
	*/
	public void setSpellsLeft(int spellsLeft) {
		this.spellsLeft = spellsLeft;
	}

	/**
	* Returns value of type
	* @return
	*/
	public String getType() {
		return type;
	}

	/**
	* Sets new value of type
	* @param
	*/
	public void setType(String type) {
		this.type = type;
	}

	/**
	* Returns value of color
	* @return
	*/
	public String getColor() {
		return color;
	}

	/**
	* Sets new value of color
	* @param
	*/
	public void setColor(String color) {
		this.color = color;
	}

	/**
	* Returns value of activeColor
	* @return
	*/
	public String getActiveColor() {
		return activeColor;
	}

	/**
	* Sets new value of activeColor
	* @param
	*/
	public void setActiveColor(String activeColor) {
		this.activeColor = activeColor;
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
	* Returns value of mapHeightWidth
	* @return
	*/
	public int getMapHeightWidth() {
		return mapHeightWidth;
	}

	/**
	* Sets new value of mapHeightWidth
	* @param
	*/
	public void setMapHeightWidth(int mapHeightWidth) {
		this.mapHeightWidth = mapHeightWidth;
	}



	/**
	* Returns value of isSelected
	* @return
	*/
	public boolean isIsSelected() {
		return isSelected;
	}

	/**
	* Sets new value of isSelected
	* @param
	*/
	public void setIsSelected(boolean isSelected) {
		this.isSelected = isSelected;
	}

    /**
	* Returns value of realSquareId
	* @return
	*/
	public Integer getRealSquareId() {
		return realSquareId;
	}

	/**
	* Sets new value of realSquareId
	* @param
	*/
	public void setRealSquareId(Integer realSquareId) {
		this.realSquareId = realSquareId;
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
    	public int getMapId() {
    		return mapId;
    	}

    	/**
    	* Sets new value of mapId
    	* @param
    	*/
    	public void setMapId(int mapId) {
    		this.mapId = mapId;
    	}

}
