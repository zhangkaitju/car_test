package com.lbs;

import java.util.Map;

public class BaiduLBSUtil {
	
	/**
	 * 返回数据的编码格式
	 * @author zhangkai
	 */
	private static String recEncoding = "UTF-8";
	public static String getRecEncoding() {
		return recEncoding;
	}
	public static void setRecEncoding(String recEncoding) {
		BaiduLBSUtil.recEncoding = recEncoding;
	}
	
	public String createGeotable(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/geotable/create";
		return HttpRequestProxy.doPost(url, params, getRecEncoding());
	}
	public String listGeotable(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/geotable/list";
		return HttpRequestProxy.doGet(url, params , getRecEncoding());
	}
	public String detailGeotable(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/geotable/detail";
		return HttpRequestProxy.doGet(url,params,getRecEncoding());
	}
	public String updateGeotable(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/geotable/update";
		return HttpRequestProxy.doPost(url,params,getRecEncoding());
	}
	public String deleteGeotable(Map params){
		//注：当geotable里面没有有效数据时，才能删除geotable
		String url = "http://api.map.baidu.com/geodata/v3/geotable/delete";
		return HttpRequestProxy.doPost(url,params,getRecEncoding());
	}
	public String createColumn(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/column/create";
		return HttpRequestProxy.doPost(url,params,getRecEncoding());
	}
	public String listColumn(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/column/list";
		return HttpRequestProxy.doGet(url,params,getRecEncoding());
	}
	public String detailColumn(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/column/detail";
		return HttpRequestProxy.doGet(url,params,getRecEncoding());
	}
	public String updateColumn(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/column/update";
		return HttpRequestProxy.doPost(url,params,getRecEncoding());
	}
	public String deleteColumn(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/column/delete";
		return HttpRequestProxy.doPost(url,params,getRecEncoding());
	}
	public String createPOI(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/poi/create";
		return HttpRequestProxy.doPost(url,params,getRecEncoding());
	}
	public String listPOI(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/poi/list";
		return HttpRequestProxy.doGet(url,params,getRecEncoding());
	}
	public String detailPOI(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/poi/detail";
		return HttpRequestProxy.doGet(url,params,getRecEncoding());
	}
	public String updatePOI(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/poi/update";
		return HttpRequestProxy.doGet(url,params,getRecEncoding());
	}
	public String deletePOI(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/poi/delete";
		return HttpRequestProxy.doPost(url,params,getRecEncoding());
	}
	public String postPOIsCSVFile(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/poi/upload";
		return HttpRequestProxy.doPost(url,params,getRecEncoding());
	}
	public String listImportStatus(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/job/listimportdata";
		return HttpRequestProxy.doGet(url,params,getRecEncoding());
	}
	public String listJob(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/job/list";
		return HttpRequestProxy.doGet(url,params,getRecEncoding());
	}
	public String detailJob(Map params){
		String url = "http://api.map.baidu.com/geodata/v3/job/detail";
		return HttpRequestProxy.doPost(url,params,getRecEncoding());
	}
}
