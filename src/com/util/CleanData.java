package com.util;

public class CleanData {

	/**
	 * @param args
	 */
	public static void main(String[] args) {
		String fileName = "d:\\ConciseOrder_201507.csv";
		try {
			CSVFileUtil csv = new CSVFileUtil(fileName);
			csv.readAllByLine();
			//System.out.println(temp);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}
