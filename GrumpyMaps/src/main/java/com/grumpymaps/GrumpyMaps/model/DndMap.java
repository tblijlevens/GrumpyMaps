package com.grumpymaps.GrumpyMaps.model;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class DndMap {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private int heightWidth;
    private int numberOfSquares;
    
    @OneToMany(mappedBy="dndMap", cascade=CascadeType.ALL)
    private List<Square> squares;
    private String imageUrl;

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
	* Returns value of heightWidth
	* @return
	*/
	public int getHeightWidth() {
		return heightWidth;
	}

	/**
	* Sets new value of heightWidth
	* @param
	*/
	public void setHeightWidth(int heightWidth) {
		this.heightWidth = heightWidth;
	}

	/**
	* Returns value of numberOfSquares
	* @return
	*/
	public int getNumberOfSquares() {
		return numberOfSquares;
	}

	/**
	* Sets new value of numberOfSquares
	* @param
	*/
	public void setNumberOfSquares(int numberOfSquares) {
		this.numberOfSquares = numberOfSquares;
	}

	/**
	* Returns value of squares
	* @return
	*/
	public List<Square> getSquares() {
		return squares;
	}

	/**
	* Sets new value of squares
	* @param
	*/
	public void setSquares(List<Square> squares) {
		this.squares = squares;
	}

	/**
	* Returns value of imageUrl
	* @return
	*/
	public String getImageUrl() {
		return imageUrl;
	}

	/**
	* Sets new value of imageUrl
	* @param
	*/
	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
	}
}
