package com.lbs;

import java.util.HashMap;
import java.util.Map;

import org.junit.Test;

/**
 * 百度云存储操作
 * @author zhangkai
 *
 */
public class BaiduLBSUtilTest {

	private static String ak = "";
	private static String geotable_id = "";
	
	private static BaiduLBSUtil baiduLBSUtil = new BaiduLBSUtil();
	public static String getAk() {
		return ak;
	}
	public static void setAk(String ak) {
		BaiduLBSUtilTest.ak = ak;
	}
	public static String getGeotable_id() {
		return geotable_id;
	}
	public static void setGeotable_id(String geotableId) {
		geotable_id = geotableId;
	}
	
	@SuppressWarnings("unchecked")
	@Test
	public void createGeotable(){
		Map params = new HashMap();
		params.put("name", "around");
		params.put("geotype", "1");
		params.put("is_published", "1");
		params.put("ak", ak);
		System.out.println(baiduLBSUtil.createGeotable(params));
	}
	
	@SuppressWarnings("unchecked")
	@Test
	public void listGeotable(){
		Map params = new HashMap();
		params.put("ak", ak);
		params.put("name", "around");
		System.out.println(baiduLBSUtil.listGeotable(params));
	}
	@SuppressWarnings("unchecked")
	@Test
	public void detailGeotable(){
		Map params = new HashMap();
		params.put("ak", ak);
		params.put("id", geotable_id);
		System.out.println(baiduLBSUtil.detailGeotable(params));
	}
	@SuppressWarnings("unchecked")
	@Test
	public void updateGeotable(){
		Map params = new HashMap();
		params.put("ak", ak);
		params.put("id", "87276");
		System.out.println(baiduLBSUtil.updateGeotable(params));
	}
	@SuppressWarnings("unchecked")
	@Test
	public void deleteGeotable(){
		Map params = new HashMap();
		params.put("ak", ak);
		params.put("id", "");
		System.out.println(baiduLBSUtil.deleteGeotable(params));
	}
	@SuppressWarnings("unchecked")
	@Test
	public void createColumn1(){
		Map params = new HashMap();
		params.put("ak", ak);
		params.put("geotable_id",geotable_id);
		params.put("name", "城市");
		params.put("key", "city");
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
	@SuppressWarnings("unchecked")
	@Test
	public void createColumn2(){
		Map params = new HashMap();
		params.put("ak", ak);
		params.put("geotable_id",geotable_id);
		params.put("name", "地区");
		params.put("key", "district");
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
	@SuppressWarnings("unchecked")
	@Test
	public void createColumn3(){
		Map params = new HashMap();
		params.put("ak", ak);
		params.put("geotable_id",geotable_id);
		params.put("name", "公司ID");
		params.put("key", "company_id");
		params.put("type", "1");
		params.put("max_length", "512");
		//是否排序字段
		params.put("is_sortfilter_field", "1");
		//是否查询字段
		params.put("is_search_field", "0");
		//是否索引字段
		params.put("is_index_field", "1");
		params.put("is_unique_field ", "0");
		System.out.println(baiduLBSUtil.createColumn(params));
	}
	@SuppressWarnings("unchecked")
	@Test
	public void listColumn(){
		Map params = new HashMap();
		params.put("ak", ak);
		params.put("geotable_id",geotable_id);
		System.out.println(baiduLBSUtil.listColumn(params));
	}
	@SuppressWarnings("unchecked")
	@Test
	public void detailColumn() {
		Map params = new HashMap();
		params.put("ak", ak);
		params.put("geotable_id",geotable_id);
		params.put("id", "");
		System.out.println(baiduLBSUtil.detailColumn(params));
	}
	/*
	 * 创建位置信息
	 */
	@SuppressWarnings("unchecked")
	@Test
	public void createPOI(){
		Map params = new HashMap();
		params.put("ak", ak);
		params.put("geotable_id",geotable_id);
		params.put("title", "领袖慧谷");
		params.put("address", "北京市昌平区回龙观镇");
		//纬度
		params.put("latitude", "40.106311");
		//经度
		params.put("longitude", "116.310648");
		params.put("tags", "小区");
		params.put("coord_type", "3");
		//自定义列
		params.put("city", "北京市");
		params.put("district", "昌平区");
		params.put("company_id", "1");
		
		System.out.println(baiduLBSUtil.createPOI(params));
	}
	
	@SuppressWarnings("unchecked")
	@Test
	public void listPOI(){
		Map params = new HashMap();
		params.put("ak", ak);
		params.put("geotable_id",geotable_id);
		System.out.println(baiduLBSUtil.listPOI(params));
	}
	@Test
	public void deletePOI(){
		Map<String ,String > params = new HashMap<String, String>();
		params.put("ak", ak);
		params.put("geotable_id", geotable_id);
		System.out.println(baiduLBSUtil.deletePOI(params));
	}
	public static void main(String[] args) {
		BaiduLBSUtilTest blt = new BaiduLBSUtilTest();
		//我的ak
		setAk("XSHyInWf22eub3zzNG6SK8zv");
		//blt.deleteGeotable();
		blt.createGeotable();
		blt.listGeotable();
	}
}
