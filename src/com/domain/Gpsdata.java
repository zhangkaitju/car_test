package com.domain;

import java.util.Date;

/**
 * gps对象
 * @author zhangkai
 *
 */
public class Gpsdata {
	private String carID;
	private Date locationDate;
	private String locationX;
	private String locationY;

	public String getCarID() {
		return carID;
	}

	public void setCarID(String carID) {
		this.carID = carID;
	}

	public Date getLocationDate() {
		return locationDate;
	}

	public void setLocationDate(Date locationDate) {
		this.locationDate = locationDate;
	}

	public String getLocationX() {
		return locationX;
	}

	public void setLocationX(String locationX) {
		this.locationX = locationX;
	}

	public String getLocationY() {
		return locationY;
	}

	public void setLocationY(String locationY) {
		this.locationY = locationY;
	}

}
