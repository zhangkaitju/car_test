package com.action;

import java.io.IOException;
import java.io.PrintWriter;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.struts2.interceptor.RequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;

import com.dao.GpsdataDao;
import com.dao.impl.GpsdataDaoImpl;
import com.domain.Gps;
import com.domain.HotPoint;
import com.opensymphony.xwork2.ActionSupport;

/**
 * 	用来处理百度api相关操作&热力图的生成
 * @author zhangkai
 */
public class BaiduLBSAction extends ActionSupport implements RequestAware,ServletResponseAware{

	private static final long serialVersionUID = 1L;
	private GpsdataDao gpsdataDao = new GpsdataDaoImpl();
	
	@SuppressWarnings("unused")
	private Map<String, Object> request;
	public void setRequest(Map<String, Object> request) {
		this.request = request;
	}
	
	private HttpServletResponse response;
	public void setServletResponse(HttpServletResponse response) {
		this.response = response;
	}
	//将文件上传到百度云lbs
//	public String execute() throws Exception {
//		File file = new File("d://gps.csv");
//		System.out.println("start...");
//		System.out.println("---------------------");
//		//System.out.println(carInfoVo.getCarId()+"    "+carInfoVo.getStartTime()+"      "+carInfoVo.getEndTime());// debug
//		BaiduLBSDao bld = new BaiduLBSDaoImpl();
//		bld.uploadGps(file);
//		System.out.println("上传结束...");
//		return null;
//	}
	
	public String process() throws IOException{
		List<Gps> gpsdataList = gpsdataDao.find();
		
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
//		BigDecimal   b1   =   new   BigDecimal(base_x); 
//		double   f1   =   b1.setScale(5,   BigDecimal.ROUND_HALF_UP).doubleValue();
//		BigDecimal   b2   =   new   BigDecimal(base_y); 
//		double   f2   =   b2.setScale(5,   BigDecimal.ROUND_HALF_UP).doubleValue();  
		
		int hotpoints[][] = new int[10000][10000];
		//处理每个gps数据
		System.out.println("start..");
		for(Gps gps : gpsdataList){
			double x = Double.parseDouble(gps.getLocationX());//将从数据库中得到的string类型转换为double类型
			double y = Double.parseDouble(gps.getLocationY());
			//对double类型进行四舍五入保留整数操作，setScale(0,   BigDecimal.ROUND_HALF_UP)其中0表示保留的小数位
			BigDecimal   b1   =   new   BigDecimal((x - leftBottom_x)/base_x); 
			double   f1   =   b1.setScale(0,   BigDecimal.ROUND_HALF_UP).doubleValue();
			BigDecimal   b2   =   new   BigDecimal((y - leftBottom_y)/base_y); 
			double   f2   =   b2.setScale(0,   BigDecimal.ROUND_HALF_UP).doubleValue();
			//判断gps点是否在所选地图范围内
			if(f1>0&&f1<10000&&f2>0&&f2<10000){
				//System.out.println((int) f1);
				//System.out.println((int) f2);
				hotpoints[(int) f1][(int) f2] ++;//热力值计算
			}
		}
		List<HotPoint> hotpointList = new ArrayList<HotPoint>();
		HotPoint hp = null;
		for(int i=0;i<10000;i++){
			for(int j=0;j<10000;j++){
				if(hotpoints[i][j]!=0){
					hp = new HotPoint();
					//计算每个方格中的gps点数，热力值
					hp.setLat(i*base_x + leftBottom_x);
					hp.setLng(j*base_y + leftBottom_y);
					hp.setCount(hotpoints[i][j]);
					hotpointList.add(hp);
				}
			}
		}
		System.out.println("end..");
		JSONArray jsonarray = new JSONArray();
		JSONObject jsonObject = null;
		//将hotpointList List类型转换为热力图使用的JSONArray类型
		for(HotPoint hotpoint : hotpointList){
			jsonObject = new JSONObject();
			jsonObject.put("lng", hotpoint.getLat());
			jsonObject.put("lat", hotpoint.getLng());
			jsonObject.put("count", hotpoint.getCount());
			jsonarray.add(jsonObject);
		}
		//System.out.println(jsonGps.toString());
		System.out.println("共"+hotpointList.size()+"个点");
		PrintWriter out = response.getWriter();
		//System.out.println(jsonarray.toString());
		out.print(jsonarray.toString());
		out.flush();
		return null;
	}
}