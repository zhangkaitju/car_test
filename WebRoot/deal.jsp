<%@ page language="java" contentType="text/heml;charset=utf-8"%>
<%@ page import="java.util.*"  %>
<%
	String maptype = request.getParameter("maptype");
	if (maptype == null) {
		maptype = "d1";
	}
	StringBuffer sb = new StringBuffer();
	sb.append("<freq>");

	Map map = new HashMap();
	String d0 = "<freq><id>0</id><name>请选择</name></freq>";
	String d1 = "<freq><id>1</id><name>百度API</name></freq><freq><id>2</id><name>百度LBS云</name></freq>";
	String d2 = "<freq><id>3</id><name>高德云图</name></freq>";
	map.put("1", d1);
	map.put("2", d2);
	map.put("0", d0);

	sb.append(map.get(maptype).toString());
	sb.append("</freq>");
	response.setContentType("text/xml");
	out.write(sb.toString());
%>