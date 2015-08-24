package com.lbs;

import java.math.BigDecimal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import com.domain.Gps;
import com.domain.HotPoint;
import com.jdbc.JDBCUtilSingle;

public class Test {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
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
			
			//地图左下角的坐标
			double leftBottom_x = 115.910278;
			double leftBottom_y = 39.491114;
			//地图右上角的坐标
			double rightTop_x = 117.156727;
			double rightTop_y = 40.458435;
			//定义北京市坐标范围
			double base_x = (rightTop_x - leftBottom_x)/10000;
			double base_y = (rightTop_y - leftBottom_y)/10000;
			//保留小数点后五位小数
//			BigDecimal   b1   =   new   BigDecimal(base_x); 
//			double   f1   =   b1.setScale(5,   BigDecimal.ROUND_HALF_UP).doubleValue();
//			BigDecimal   b2   =   new   BigDecimal(base_y); 
//			double   f2   =   b2.setScale(5,   BigDecimal.ROUND_HALF_UP).doubleValue();  
			


			int hotpoints[][] = new int[10000][10000];
			//处理每个gps数据
			for(Gps gps : gpsList){
				double x = Double.parseDouble(gps.getLocationX());
				double y = Double.parseDouble(gps.getLocationY());
				
				double center_x = (x + leftBottom_x)/2;
				double center_y = (y + leftBottom_y)/2;
				
				BigDecimal   b1   =   new   BigDecimal((x - leftBottom_x)/base_x); 
				double   f1   =   b1.setScale(0,   BigDecimal.ROUND_HALF_UP).doubleValue();
				BigDecimal   b2   =   new   BigDecimal((y - leftBottom_y)/base_y); 
				double   f2   =   b2.setScale(0,   BigDecimal.ROUND_HALF_UP).doubleValue();
//				System.out.println((x - leftBottom_x)/base_x);
//				System.out.println((y - leftBottom_y)/base_y);
				if(f1>0&&f1<10000&&f2>0&&f2<10000){
					System.out.println((int) f1);
					System.out.println((int) f2);
					hotpoints[(int) f1][(int) f2] ++;
				}
			}
			List<HotPoint> hotpointList = new ArrayList<HotPoint>();
			HotPoint hp = null;
			for(int i=0;i<10000;i++){
				for(int j=0;j<10000;j++){
					if(hotpoints[i][j]!=0){
						hp = new HotPoint();
						hp.setLat(i*base_x + leftBottom_x);
						hp.setLng(j*base_y + leftBottom_y);
						hp.setCount(hotpoints[i][j]);
						hotpointList.add(hp);
					}
				}
			}
		} catch (SQLException e) {
			throw new RuntimeException(e);
		} finally {
			JDBCUtilSingle.getInitJDBCUtil().closeConnection(rs, pstmt, conn);
		}
	}
}
