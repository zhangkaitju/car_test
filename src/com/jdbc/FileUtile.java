package com.jdbc;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;

/**
 * File文件操作类
 * @author zhangkai
 *
 */
public class FileUtile {
	private final File folder;
	private final List<File> fileList;
	
	public FileUtile(File folder){
		this.folder = folder;
		this.fileList = new LinkedList<File>();
	}
	
	public List<File> getFileList(){
		return this.fileList;
	}
	//按行读取文件
	public String readAllLines(File file) {
		StringBuffer buffer = new StringBuffer();
		try {
			Scanner scanner = new Scanner(file);
			while(scanner.hasNextLine()){
				buffer.append(scanner.nextLine());
			}
			scanner.close();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}
		return buffer.toString();
	}
	//得到文件夹目录下所有文件
	public void getAllFiles(File root){
		File files[] = root.listFiles();
		if(files != null){
			for(File f : files){
				if(f.isDirectory()){
					getAllFiles(f);
				}else if(f.isFile()){
					fileList.add(f);
				}
			}
		}
	}
}
