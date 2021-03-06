package com.action;

import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.apache.struts2.interceptor.RequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;

import com.dao.GpsdataDao;
import com.dao.impl.GpsdataDaoImpl;
import com.domain.Gps;
import com.opensymphony.xwork2.ActionSupport;
import com.vo.CarInfoVo;

/**
 * 查询并在百度地图显示3w gps点
 * @author zhangkai
 *
 */
public class SearchAction extends ActionSupport implements RequestAware,ServletResponseAware{
	private static final long serialVersionUID = 1L;
	private CarInfoVo carInfoVo;
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
	
	public String execute() throws Exception {
		//查询3w点数据
		List<Gps> gpsdataList = gpsdataDao.find();
		System.out.println("start...");
		//System.out.println(carInfoVo.getCarId()+"    "+carInfoVo.getStartTime()+"      "+carInfoVo.getEndTime());// debug
		
		JSONArray jsonGps = JSONArray.fromObject(gpsdataList); 
		//System.out.println(jsonGps.toString());
		System.out.println("共加载"+gpsdataList.size()+"个点");
		PrintWriter out = response.getWriter();
		out.print(jsonGps.toString());
		out.flush();
		System.out.println("end..");
		System.out.println("---------------------");
		//out.close();
		return null;
	}
	public CarInfoVo getCarInfoVo() {
		return carInfoVo;
	}

	public void setCarInfoVo(CarInfoVo carInfoVo) {
		this.carInfoVo = carInfoVo;
	}
}