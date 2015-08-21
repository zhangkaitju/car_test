package com.dao.impl;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.dao.GpsdataDao;
import com.domain.Gps;
import com.jdbc.JDBCUtilSingle;

public class GpsdataDaoImpl implements GpsdataDao {

	public List<Gps> find(String carID, Date startTime, Date endTime) {
		Connection conn = JDBCUtilSingle.getInitJDBCUtil().getConnection();
		String sql = "SELECT location_x, location_y FROM gpsdata WHERE car_id=? AND location_date>=? AND location_date<=?";
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		List<Gps> gpsList = new ArrayList<Gps>();
		
		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, carID);
			pstmt.setTimestamp(2, new Timestamp(startTime.getTime()));
			pstmt.setTimestamp(3, new Timestamp(endTime.getTime()));
			rs = pstmt.executeQuery();
			
			while(rs.next()){
				Gps gps = new Gps();
				gps.setLocationX(rs.getString("location_x"));
				gps.setLocationY(rs.getString("location_y"));
				
				gpsList.add(gps);
			}
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			JDBCUtilSingle.getInitJDBCUtil().closeConnection(rs, pstmt, conn);
		}
		return gpsList;
	}

	public List<Gps> find(String carID) {
		Connection conn = JDBCUtilSingle.getInitJDBCUtil().getConnection();
		String sql = "SELECT location_x, location_y FROM gpsdata WHERE car_id=?";
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		List<Gps> gpsList = new ArrayList<Gps>();

		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, carID);
			rs = pstmt.executeQuery();
			
			while(rs.next()){
				Gps gps = new Gps();
				gps.setLocationX(rs.getString("location_x"));
				gps.setLocationY(rs.getString("location_y"));
				gpsList.add(gps);
			}
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			JDBCUtilSingle.getInitJDBCUtil().closeConnection(rs, pstmt, conn);
		}
		return gpsList;
	}

	public List<Gps> find(String carID, Date startTime) {
		Connection conn = JDBCUtilSingle.getInitJDBCUtil().getConnection();
		String sql = "SELECT location_x, location_y FROM gpsdata WHERE car_id= ? and location_date < ? order by location_date desc limit 1";
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		List<Gps> gpsList = new ArrayList<Gps>();

		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setString(1, carID);
			pstmt.setDate(2, new java.sql.Date(startTime.getTime()));
			rs = pstmt.executeQuery();
			
			while(rs.next()){
				Gps gps = new Gps();
				gps.setLocationX(rs.getString("location_x"));
				gps.setLocationY(rs.getString("location_y"));
				gpsList.add(gps);
			}
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			JDBCUtilSingle.getInitJDBCUtil().closeConnection(rs, pstmt, conn);
		}
		return gpsList;
	}

	public List<Gps> find(Date startTime) {
		Connection conn = JDBCUtilSingle.getInitJDBCUtil().getConnection();
		String sql = "SELECT location_x, location_y FROM gpsdata in WHERE location_date <= ? group by car_id order by location_date desc limit 10000";
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		List<Gps> gpsList = new ArrayList<Gps>();
		try {
			pstmt = conn.prepareStatement(sql);
			pstmt.setDate(1, new java.sql.Date(startTime.getTime()));
			rs = pstmt.executeQuery();
			
			while(rs.next()){
				Gps gps = new Gps();
				gps.setLocationX(rs.getString("location_x"));
				gps.setLocationY(rs.getString("location_y"));
				gpsList.add(gps);
			}
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			JDBCUtilSingle.getInitJDBCUtil().closeConnection(rs, pstmt, conn);
		}
		return gpsList;
	}

	public List<Gps> find() {
		Connection conn = JDBCUtilSingle.getInitJDBCUtil().getConnection();
		String sql = "SELECT actual_board_lon, actual_board_lat, actual_off_lon, actual_off_lat FROM order_gps_actual limit 30000";
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		List<Gps> gpsList = new ArrayList<Gps>();
		//List<Gps> offGpsList = new ArrayList<Gps>();
		try {
			pstmt = conn.prepareStatement(sql);
			rs = pstmt.executeQuery();
			Gps gps1 = null;
			Gps gps2 = null;
			while(rs.next()){
				gps1 = new Gps();
				gps1.setLocationX(rs.getBigDecimal("actual_board_lon")+"");
				gps1.setLocationY(rs.getBigDecimal("actual_board_lat")+"");
				gpsList.add(gps1);
				
				gps2 = new Gps();
				gps2.setLocationX(rs.getBigDecimal("actual_off_lon")+"");
				gps2.setLocationY(rs.getBigDecimal("actual_off_lat")+"");
				gpsList.add(gps2);
			}
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			JDBCUtilSingle.getInitJDBCUtil().closeConnection(rs, pstmt, conn);
		}
		return gpsList;
	}
}
