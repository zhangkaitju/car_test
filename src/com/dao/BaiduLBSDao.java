package com.dao;

import java.io.File;
import java.util.List;

import com.domain.Gps;

/**
 * 百度api相关操作接口类
 * @author zhangkai
 *
 */
public interface BaiduLBSDao {
	//查询3w俩车gps数据
	public List<Gps> find();
	//上传数据到百度LBS云
	public void uploadGps(File file);
}
