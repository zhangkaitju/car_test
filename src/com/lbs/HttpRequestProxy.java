package com.lbs;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

public class HttpRequestProxy {
	/**
	 * 连接超时
	 */
	private static int connectTimeOut = 5000;

	/**
	 * 读取数据超时
	 */
	private static int readTimeOut = 10000;

	/**
	 * 请求编码
	 */
	private static String requestEncoding = "UTF-8";

	/**
	 * <pre>
	 * 发送带参数的GET的HTTP请求
	 * </pre>
	 * 
	 * @param reqUrl
	 *            HTTP请求URL
	 * @param parameters
	 *            参数映射表
	 * @return HTTP响应的字符串
	 * @throws UnsupportedEncodingException 
	 */
	public static String doGet(String reqUrl, Map parameters,String recvEncoding)  {
		StringBuffer params = new StringBuffer();
		for (Iterator iter = parameters.entrySet().iterator(); iter.hasNext();) {
			Entry element = (Entry) iter.next();
			params.append(element.getKey().toString());
			params.append("=");
			try {
				params.append(URLEncoder.encode(element.getValue().toString(),HttpRequestProxy.requestEncoding));
			} catch (UnsupportedEncodingException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			params.append("&");
		}
		if (params.length() > 0) {
			params = params.deleteCharAt(params.length() - 1);
		}
		reqUrl += "?" + params.toString();
		
		return doGet(reqUrl, recvEncoding);
	}

	/**
	 * <pre>
	 * 发送不带参数的GET的HTTP请求
	 * </pre>
	 * 
	 * @param reqUrl
	 *            HTTP请求URL
	 * @return HTTP响应的字符串
	 */
	public static String doGet(String reqUrl, String recvEncoding) {
		HttpURLConnection url_con = null;
		String responseContent = null;
		try {

			URL url = new URL(reqUrl);
			url_con = (HttpURLConnection) url.openConnection();
			url_con.setRequestMethod("GET");
			
//			System.setProperty("sun.net.client.defaultConnectTimeout", String.valueOf(HttpRequestProxy.connectTimeOut));// （单位：毫秒）jdk1.4换成这个,连接超时
//			System.setProperty("sun.net.client.defaultReadTimeout", String.valueOf(HttpRequestProxy.readTimeOut)); // （单位：毫秒）jdk1.4换成这个,读操作超时
			
			url_con.setConnectTimeout(HttpRequestProxy.connectTimeOut);//（单位：毫秒）jdk 1.5换成这个,连接超时
			url_con.setReadTimeout(HttpRequestProxy.readTimeOut);//（单位：毫秒）jdk 1.5换成这个,读操作超时
			
			url_con.setDoOutput(true);
			
			InputStream in = url_con.getInputStream();
			BufferedReader rd = new BufferedReader(new InputStreamReader(in,recvEncoding));
			String tempLine = rd.readLine();
			StringBuffer temp = new StringBuffer();
			String crlf = System.getProperty("line.separator");
			while (tempLine != null) {
				temp.append(tempLine);
				temp.append(crlf);
				tempLine = rd.readLine();
			}
			responseContent = temp.toString();
			rd.close();
			in.close();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (url_con != null) {
				url_con.disconnect();
			}
		}
		return decodeUnicode(responseContent);
	}

	/**
	 * 发送带参数的POST的HTTP请求
	 * 
	 * @param reqUrl
	 *            HTTP请求URL
	 * @param parameters
	 *            参数映射表
	 * @return HTTP响应的字符串
	 */
	@SuppressWarnings("unchecked")
	public static String doPost(String reqUrl, Map parameters,String recvEncoding) {
		HttpURLConnection url_con = null;
		String responseContent = null;
		try {
			StringBuffer params = new StringBuffer();
			for (Iterator iter = parameters.entrySet().iterator(); iter.hasNext();) {
				Entry element = (Entry) iter.next();
				params.append(element.getKey().toString());
				params.append("=");
				params.append(URLEncoder.encode(element.getValue().toString(),HttpRequestProxy.requestEncoding));
				params.append("&");
			}

			if (params.length() > 0) {
				params = params.deleteCharAt(params.length() - 1);
			}

			URL url = new URL(reqUrl);
			url_con = (HttpURLConnection) url.openConnection();
			url_con.setRequestMethod("POST");
//			System.setProperty("sun.net.client.defaultConnectTimeout", String.valueOf(HttpRequestProxy.connectTimeOut));// （单位：毫秒）jdk1.4换成这个,连接超时
//			System.setProperty("sun.net.client.defaultReadTimeout", String.valueOf(HttpRequestProxy.readTimeOut)); // （单位：毫秒）jdk1.4换成这个,读操作超时
			
			url_con.setConnectTimeout(HttpRequestProxy.connectTimeOut);//（单位：毫秒）jdk 1.5换成这个,连接超时
			url_con.setReadTimeout(HttpRequestProxy.readTimeOut);//（单位：毫秒）jdk 1.5换成这个,读操作超时
			
			url_con.setDoOutput(true);
			byte[] b = params.toString().getBytes();
			url_con.getOutputStream().write(b, 0, b.length);
			url_con.getOutputStream().flush();
			url_con.getOutputStream().close();

			InputStream in = url_con.getInputStream();
			BufferedReader rd = new BufferedReader(new InputStreamReader(in,recvEncoding));
			String tempLine = rd.readLine();
			StringBuffer tempStr = new StringBuffer();
			String crlf = System.getProperty("line.separator");
			while (tempLine != null) {
				tempStr.append(tempLine);
				tempStr.append(crlf);
				tempLine = rd.readLine();
			}
			responseContent = tempStr.toString();
			rd.close();
			in.close();
		} catch (IOException e) {
			e.printStackTrace();
		} finally {
			if (url_con != null) {
				url_con.disconnect();
			}
		}
		return decodeUnicode(responseContent);
	}

	/**
	 * @return 连接超时(毫秒)
	 */
	public static int getConnectTimeOut() {
		return HttpRequestProxy.connectTimeOut;
	}

	/**
	 * @param connectTimeOut
	 *            连接超时(毫秒)
	 */
	public static void setConnectTimeOut(int connectTimeOut) {
		HttpRequestProxy.connectTimeOut = connectTimeOut;
	}
	
	/**
	 * @return 读取数据超时(毫秒)
	 */
	public static int getReadTimeOut() {
		return HttpRequestProxy.readTimeOut;
	}


	/**
	 * @param readTimeOut
	 *            读取数据超时(毫秒)
	 */
	public static void setReadTimeOut(int readTimeOut) {
		HttpRequestProxy.readTimeOut = readTimeOut;
	}

	/**
	 * @return 请求编码
	 */
	public static String getRequestEncoding() {
		return requestEncoding;
	}
	
	/**
	 * @param requestEncoding
	 *            请求编码
	 */
	public static void setRequestEncoding(String requestEncoding) {
		HttpRequestProxy.requestEncoding = requestEncoding;
	}
	/**
     * 
     * unicode 转换成 中文
     * @param theString
     * @return
     */
    public static String decodeUnicode(String theString) {
        char aChar;
        int len = theString.length();
        StringBuffer outBuffer = new StringBuffer(len);
        for (int x = 0; x < len;) {
            aChar = theString.charAt(x++);
            if (aChar == '\\') {
                aChar = theString.charAt(x++);
                if (aChar == 'u') {
                    // Read the xxxx
                    int value = 0;
                    for (int i = 0; i < 4; i++) {
                        aChar = theString.charAt(x++);
                        switch (aChar) {
                        case '0':
                        case '1':
                        case '2':
                        case '3':
                        case '4':
                        case '5':
                        case '6':
                        case '7':
                        case '8':
                        case '9':
                            value = (value << 4) + aChar - '0';
                            break;
                        case 'a':
                        case 'b':
                        case 'c':
                        case 'd':
                        case 'e':
                        case 'f':
                            value = (value << 4) + 10 + aChar - 'a';
                            break;
                        case 'A':
                        case 'B':
                        case 'C':
                        case 'D':
                        case 'E':
                        case 'F':
                            value = (value << 4) + 10 + aChar - 'A';
                            break;
                        default:
                            throw new IllegalArgumentException("Malformed   \\uxxxx   encoding.");
                        }
                    }
                    outBuffer.append((char) value);
                } else {
                    if (aChar == 't')
                        aChar = '\t';
                    else if (aChar == 'r')
                        aChar = '\r';
                    else if (aChar == 'n')
                        aChar = '\n';
                    else if (aChar == 'f')
                        aChar = '\f';
                    outBuffer.append(aChar);
                }
            } else
                outBuffer.append(aChar);
        }
        return outBuffer.toString();
    }
}