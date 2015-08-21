package com.jdbc;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.LinkedList;
import java.util.List;
import java.util.Scanner;

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
	
	public void getAllFiles(File root){
		File files[] = root.listFiles();
		if(files != null){
			for(File f : files){
				if(f.isDirectory()){
					getAllFiles(f);
				}else if(f.isFile()){
					String path = f.getAbsolutePath();
					fileList.add(f);
				}
			}
		}
	}
}
