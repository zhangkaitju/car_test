package com.action;

import java.io.PrintWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
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

public class UserAction extends ActionSupport implements RequestAware,ServletResponseAware{
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
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd kk:mm:ss");
		Date startTime = null;
		Date endTime = null;
		List<Gps> gpsdataList = null;
		try {
			System.out.println("begin...");
			if(carInfoVo.getCarId()!=null&&carInfoVo.getStartTime()!=null&&carInfoVo.getEndTime()!=null&&
					!carInfoVo.getStartTime().equals("")&&!carInfoVo.getEndTime().equals("")&&!carInfoVo.getCarId().equals("")){
				startTime = sdf.parse(carInfoVo.getStartTime());// 将接受到的string类型时间转成java.util.Date
				endTime = sdf.parse(carInfoVo.getEndTime());
				gpsdataList = gpsdataDao.find(carInfoVo.getCarId(), startTime, endTime);
			}else if(carInfoVo.getCarId()!=null&&!carInfoVo.getCarId().equals("")&&carInfoVo.getStartTime()!=null&&!carInfoVo.getStartTime().equals("")){
				startTime = sdf.parse(carInfoVo.getStartTime());// 将接受到的string类型时间转成java.util.Date
				gpsdataList = gpsdataDao.find(carInfoVo.getCarId(), startTime);
			}else if((carInfoVo.getCarId()==null||carInfoVo.getCarId().equals(""))&&(carInfoVo.getStartTime()!=null&&!carInfoVo.getStartTime().equals(""))&&
					(carInfoVo.getEndTime()==null||carInfoVo.getEndTime().equals(""))){
				startTime = sdf.parse(carInfoVo.getStartTime());// 将接受到的string类型时间转成java.util.Date
				gpsdataList = gpsdataDao.find(startTime);
			}else{
				gpsdataList = gpsdataDao.find(carInfoVo.getCarId());
			}
		} catch (ParseException e) {
			e.printStackTrace();
		}
		System.out.println("searching car "+carInfoVo.getCarId()+"...");
		System.out.println("end...");
		System.out.println("---------------------");
		//System.out.println(carInfoVo.getCarId()+"    "+carInfoVo.getStartTime()+"      "+carInfoVo.getEndTime());// debug
		
		JSONArray jsonGps = JSONArray.fromObject(gpsdataList); 
		//System.out.println(jsonGps.toString());
		System.out.println("共"+gpsdataList.size()+"个点");
		PrintWriter out = response.getWriter();
		out.print(jsonGps.toString());
		out.flush();
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