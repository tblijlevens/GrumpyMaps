package com.grumpymaps.GrumpyMaps.model;

import java.util.ArrayList;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Square {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    private int squareScale;
    private int squareSize;
    private ArrayList<Physical> physicals;


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
	* Returns value of squareScale
	* @return
	*/
	public int getSquareScale() {
		return squareScale;
	}

	/**
	* Sets new value of squareScale
	* @param
	*/
	public void setSquareScale(int squareScale) {
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
	* Returns value of physicals
	* @return
	*/
	public ArrayList<Physical> getPhysicals() {
		return physicals;
	}

	/**
	* Sets new value of physicals
	* @param
	*/
	public void setPhysicals(ArrayList<Physical> physicals) {
		this.physicals = physicals;
	}
}
