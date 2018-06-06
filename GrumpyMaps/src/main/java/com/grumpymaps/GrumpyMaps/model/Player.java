package com.grumpymaps.GrumpyMaps.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

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
}
