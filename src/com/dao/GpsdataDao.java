package com.dao;

import java.util.Date;
import java.util.List;

import com.domain.Gps;

public interface GpsdataDao {
	
	/**
	 * 根据参数查找一段时间内车辆信息
	 * @author zhangkai
	 * @param carID
	 * @return
	 */
	//根据车辆id 开始时间 结束时间查询车辆gps
	public List<Gps> find(String carID, Date startTime, Date endTime);
	//根据车辆id 查询数据库中所有信息
	public List<Gps> find(String carID);
	//根据车辆id 起始时间查询车辆gps
	public List<Gps> find(String carID, Date startTime);
	//查询某一时刻的所有车辆gps
	public List<Gps> find(Date startTime);
	//查询3w俩车gps数据
	public List<Gps> find();
}
