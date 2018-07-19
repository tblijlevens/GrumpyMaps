package com.grumpymaps.GrumpyMaps.model;

import com.fasterxml.jackson.annotation.JsonProperty;


public class Image{

    @JsonProperty("image")
    private byte[] image;



	/**
	* Returns value of e
	* @return
	*/
	public byte[] getImage() {
		return image;
	}

	/**
	* Sets new value of e
	* @param
	*/
	public void setE(byte[] image) {
		this.image = image;
	}
}
