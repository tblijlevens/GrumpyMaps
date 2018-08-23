package com.grumpymaps.GrumpyMaps.model;

import java.io.Serializable;
import java.util.ArrayList;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

@Entity
public class Zone implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    private int realSquareId;
    private int mapId;

    private String label;
    private String color;
    private double radius;
    private int duration;

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
	/**
	* Returns value of realSquareId
	* @return
	*/
	public int getRealSquareId() {
		return realSquareId;
	}

	/**
	* Sets new value of realSquareId
	* @param
	*/
	public void setRealSquareId(int realSquareId) {
		this.realSquareId = realSquareId;
	}

	/**
	* Returns value of label
	* @return
	*/
	public String getLabel() {
		return label;
	}

	/**
	* Sets new value of label
	* @param
	*/
	public void setLabel(String label) {
		this.label = label;
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
	* Returns value of radius
	* @return
	*/
	public double getRadius() {
		return radius;
	}

	/**
	* Sets new value of radius
	* @param
	*/
	public void setRadius(double radius) {
		this.radius = radius;
	}

	/**
	* Returns value of duration
	* @return
	*/
	public int getDuration() {
		return duration;
	}

	/**
	* Sets new value of duration
	* @param
	*/
	public void setDuration(int duration) {
		this.duration = duration;
	}
}
