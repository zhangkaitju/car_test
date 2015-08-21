package com.jdbc;

import java.io.File;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.List;

public class ImportToMysql {

	public static void main(String[] args) {
		//sString path = "D:\\data\\trajectory";
		String path = "D:\\data\\GPSSample\\20121110";
		File file = new File(path);
		FileUtile fu = new FileUtile(file);
		fu.getAllFiles(file);
		List<File> files = fu.getFileList();
		
		//��txt�ļ�����mysql��ݿ���
		String sql = "load data infile ? ignore into table gps201211 character set utf8 fields terminated by ',' lines terminated by '\r\n' (carid,event,carstate,time,longitude,latitude,speed,direction,gpsstate);";
		Connection conn = JDBCUtilSingle.getInitJDBCUtil().getConnection();
		PreparedStatement  pst = null;
		try {
			for(File c : files){
				String filename = c.getAbsolutePath();
				pst = conn.prepareStatement(sql);
				pst.setString(1, filename);
				pst.executeUpdate();
				System.out.println(filename);
			}
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally{
			JDBCUtilSingle.getInitJDBCUtil().closeConnection(null, pst, conn);
		}
	}

}
