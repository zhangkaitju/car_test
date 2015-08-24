package com.dao.impl;

import java.io.File;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.dao.BaiduLBSDao;
import com.domain.Gps;
import com.lbs.BaiduLBSUtil;

/**
 * 百度云api相关操作接口实现类
 * @author zhangkai
 *
 */
public class BaiduLBSDaoImpl implements BaiduLBSDao {
	//定义个人ak
	private static String ak = "XSHyInWf22eub3zzNG6SK8zv";
	private static BaiduLBSUtil baiduLBSUtil = new BaiduLBSUtil();
	
	private static BaiduLBSDao baiduLbsSingle = null;

	public static BaiduLBSDaoImpl getBaiduLbsSingle() {
		if (baiduLbsSingle == null) {
			synchronized (BaiduLBSDaoImpl.class) {
				if (baiduLbsSingle == null) {
					baiduLbsSingle = new BaiduLBSDaoImpl();
				}
			}
		}
		return (BaiduLBSDaoImpl) baiduLbsSingle;
	}
	public List<Gps> find() {
		// TODO Auto-generated method stub
		return null;
	}

	public void uploadGps(File file) {
		BaiduLBSDaoImpl.getBaiduLbsSingle().createGeotable("car_data");
		BaiduLBSDaoImpl.getBaiduLbsSingle().createColumn1();
		BaiduLBSDaoImpl.getBaiduLbsSingle().createColumn2();
		BaiduLBSDaoImpl.getBaiduLbsSingle().createColumn3();
		BaiduLBSDaoImpl.getBaiduLbsSingle().update(file);
	}
	public void update(File file){
		Map params = new HashMap();
		params.put("poi_list", file);
		params.put("geotable_id","118177");
		params.put("ak", ak);
		System.out.println(baiduLBSUtil.postPOIsCSVFile(params));
	}
	//列出所有云上的表
	public void listGeotable(){
		Map params = new HashMap();
		params.put("ak", ak);
		params.put("name", "car_data");
		System.out.println(baiduLBSUtil.listGeotable(params));
	}
	//在云上创建表
	public void createGeotable(String name){
		Map params = new HashMap();
		params.put("name", name);
		params.put("geotype", "1");
		params.put("is_published", "1");
		params.put("ak", ak);
		System.out.println(baiduLBSUtil.createGeotable(params));
	}
	//创建列1
	public void createColumn1(){
		Map params = new HashMap();
		params.put("ak", ak);
		params.put("geotable_id","118177");
		params.put("name", "标注");
		params.put("key", "label");
		params.put("type", "3");
		params.put("max_length", "512");
		//是否排序字段
		params.put("is_sortfilter_field", "0");
		//是否查询字段
		params.put("is_search_field", "1");
		//是否索引字段
		params.put("is_index_field", "1");
		params.put("is_unique_field ", "0");
		System.out.println(baiduLBSUtil.createColumn(params));
	}
	//创建列2
	public void createColumn2(){
		Map params = new HashMap();
		params.put("ak", ak);
		params.put("geotable_id","118177");
		params.put("name", "x坐标");
		params.put("key", "x");
		params.put("type", "2");
		params.put("max_length", "20");
		//是否排序字段
		params.put("is_sortfilter_field", "0");
		//是否查询字段
		params.put("is_search_field", "0");
		//是否索引字段
		params.put("is_index_field", "0");
		params.put("is_unique_field ", "0");
		System.out.println(baiduLBSUtil.createColumn(params));
	}
	//创建列3
	public void createColumn3(){
		Map params = new HashMap();
		params.put("ak", ak);
		params.put("geotable_id","118177");
		params.put("name", "y坐标");
		params.put("key", "y");
		params.put("type", "2");
		params.put("max_length", "20");
		//是否排序字段
		params.put("is_sortfilter_field", "0");
		//是否查询字段
		params.put("is_search_field", "0");
		//是否索引字段
		params.put("is_index_field", "0");
		params.put("is_unique_field ", "0");
		System.out.println(baiduLBSUtil.createColumn(params));
	}
	public void listImportData(){
		Map params = new HashMap();
		//params
	}
	public static void main(String[] args) {
		File file = new File("d://gps.csv");
		BaiduLBSDaoImpl.getBaiduLbsSingle().update(file);
	}
}
