package com.grumpymaps.GrumpyMaps.model;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
public class Player implements Physical{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private String name;
    private int actionPoints;
    private int movementAmount;
    private int attacksPerRound;
    private int spellsPerRound;
    private String type;
    private String color;
    private int squareId;
    private int mapHeightWidth;
    private List<int> moveRange;
    private boolean isSelected;

    @ManyToOne(fetch=FetchType.LAZY)
    @JoinColumn(name="square_id")
    private Square square;



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
	* Returns value of square
	* @return
	*/
	public Square getSquare() {
		return square;
	}

	/**
	* Sets new value of square
	* @param
	*/
	public void setSquare(Square square) {
		this.square = square;
	}
}
