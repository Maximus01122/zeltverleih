package de.zeltverleih;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;

import java.time.Year;
import java.util.*;

public class Konstanten {
    private static final String GARNITUR = "Garnituren";
    private static final String BANK = "einzelne Bänke";
    private static final String TISCH = "einzelne Tische";

    private static final List<String> Bestuhlung = Arrays.asList(
            GARNITUR, BANK, TISCH);
    private static final String Zelt4x6 = " Zelt (4x6)";
    private static final String Zelt4x10 = "Zelt (4x10)";
    private static final List<String> Zelte = Arrays.asList(
            Zelt4x6, Zelt4x10);

    public static List<String> getBestuhlung() {
        return Bestuhlung;
    }

    public static List<String> getConnectedZelte() {
        return Zelte;
    }

    public static String getGarniturName(){
        return GARNITUR;
    }

    public static String getTischName(){
        return TISCH;
    }

    public static String getBankName(){
        return BANK;
    }

    public static String getZelt4x6Name(){
        return Zelt4x6;
    }

    public static String getZelt4x10Name(){
        return Zelt4x10;
    }

    public static final int LIEFERPAUSCHALE = 95;
    public static final int AUFBAUPAUSCHALE = 35;
    public static String PATH_TO_EXCEL = String.format("src/main/resources/Terminübersicht %s Kopie.xlsx", Year.now().getValue()); //Year.now().getValue());

    public static String SHEET_NAME = "Buchungen";

    public static int BeginAfterHeadline = 6;

    public static int getLastRowWrittenOn(Sheet sheet, Map<String,Integer> ColumnNames) {
        int i = BeginAfterHeadline;
        Iterator<Row> rowIterator = sheet.iterator();
        for (int j = 0; j < i; j++) {
            rowIterator.next();
        }
        while (rowIterator.hasNext()){
            Row row = rowIterator.next();
            Cell startdatum = row.getCell(ColumnNames.get("Startdatum"));
            i++;
            try{
                if(startdatum == null || startdatum.getLocalDateTimeCellValue() == null){
                    i--;
                    break;
                }
            }
            catch (Exception ignored){
                i--;
                break;
            }
        }
        return i;
    }
}
