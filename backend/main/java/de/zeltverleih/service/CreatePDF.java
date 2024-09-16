package de.zeltverleih.service;


import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import de.zeltverleih.model.InvoiceDetails;
import de.zeltverleih.model.datenbank.BookingMaterial;
import de.zeltverleih.model.datenbank.Client;
import de.zeltverleih.model.datenbank.CostDetails;
import de.zeltverleih.model.datenbank.DateDetails;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.DecimalFormat;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

public class CreatePDF {
    private static final String ANGEBOTSORDNER = "/Users/maximilianfuchs/Documents/Angebot/";
    private static final String RECHNUNGSORDNER = "/Users/maximilianfuchs/Documents/Rechnung/";

    private static final BaseFont regular;
    private static final BaseFont bold;
    private static final Font base;
    private static final DecimalFormat DECIMAL_FORMAT = new DecimalFormat("0.00");
    private static final DateTimeFormatter DATE_TIME_FORMATTER = DateTimeFormatter.ofPattern("dd.MM.yyyy");
    private static final int MAX_ROWS_PER_TABLE = 20;
    private static final int beginLeft = 35;

    private PdfWriter writer;

    static {
        try {
            regular = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
            base = FontFactory.getFont(FontFactory.HELVETICA, 12, Font.BOLD);
            bold = BaseFont.createFont(BaseFont.HELVETICA_BOLD, BaseFont.CP1252, BaseFont.NOT_EMBEDDED);
        } catch (DocumentException | IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void createPDF(Client client, Map<BookingMaterial, Double> materialPreisListe,
                          Map<String, Double> servicePreisListe,
                          DateDetails dates,
                          CostDetails costDetails) {
        Document document = new Document();
        try {
            PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(ANGEBOTSORDNER + client.getName() + ".pdf"));
            this.writer = writer;
            document.open();
            headerAngebot(writer, client, dates);
            addDeliveryToService(servicePreisListe, costDetails);
            fillTable(document, materialPreisListe, servicePreisListe);
            footer(writer);
            document.close();
        } catch (FileNotFoundException | DocumentException ignored) {
        }
    }

    public void createPDF(Client client, Map<BookingMaterial, Double> materialPreisListe,
                          Map<String, Double> servicePreisListe, InvoiceDetails costDetails) {
        Document document = new Document();
        try {
            PdfWriter writer = PdfWriter.getInstance(document, new FileOutputStream(RECHNUNGSORDNER  + client.getName() + ".pdf"));
            this.writer = writer;
            document.open();
            headerRechnung(writer, client, costDetails);
            addDeliveryToService(servicePreisListe,costDetails);
            fillTable(document,materialPreisListe,servicePreisListe);
            footer(writer);
            document.add(new Paragraph(" "));
            document.add(new Paragraph("Bitte begleichen sie den angegebenen Betrag bis zum " + DATE_TIME_FORMATTER.format(costDetails.getPaymentDate())));
            document.close();
        } catch (FileNotFoundException | DocumentException ignored) {
        }
    }

    private static String preisToString(double preis){
        String doubleAsString = DECIMAL_FORMAT.format(preis);
        return doubleAsString.replace(".",",") + " €";
    }

    private static void addTableHeader(PdfPTable table) {
        Stream.of("Bezeichnung", "Menge", "Betrag")
                .forEach(columnTitle -> {
                    PdfPCell cell = createPdfCell(columnTitle);
                    cell.setPhrase(new Phrase(columnTitle, base));
                    cell.setBackgroundColor(new BaseColor(28, 134, 238));
                    if (columnTitle.equals("Betrag"))
                        cell.setHorizontalAlignment(2);
                    table.addCell(cell);
                });
    }

    private static PdfPCell createPdfCell(String text) {
        text = text.trim();
        PdfPCell cell = new PdfPCell();
        cell.setBorderWidth(1);
        cell.setPhrase(new Phrase(text));
        cell.setPaddingRight(5);
        cell.setFixedHeight(17F);
        return cell;
    }

    private void fillTable(Document document, Map<BookingMaterial, Double> materialPreisListe,
                                  Map<String, Double> servicePreisListe) throws DocumentException {
        List<BookingMaterial> bList = materialPreisListe.keySet().stream().toList();
        List<String> serviceLeistungen = servicePreisListe.keySet().stream().toList();
        boolean space = true;
        PdfPTable t = newTable();

        double summe = 0;
        int rownumber=0;
        int checkNewPage=0;
        for (int i = 0; i < bList.size(); i++) {
            if (rownumber%((checkNewPage+1)*MAX_ROWS_PER_TABLE)==0 && rownumber!=0){
                addTableToDocument(document,t,space);
                space = false;
                footer(this.writer);
                document.newPage();
                checkNewPage=2;
                t = newTable();
            }
            BookingMaterial bm = bList.get(i);
            summe+= materialPreisListe.get(bm);
            String anzahl = String.valueOf(bm.getQuantity());
            String preis = preisToString(materialPreisListe.get(bm));
            addRows(t, bList.get(i).getMaterial().getName(), anzahl, preis);
            rownumber++;
        }

        for (int i = 0; i < serviceLeistungen.size(); i++) {
            if (rownumber%((checkNewPage+1)*MAX_ROWS_PER_TABLE)==0 && rownumber!=0){
                addTableToDocument(document,t,space);
                space = false;
                footer(this.writer);
                document.newPage();
                checkNewPage=2;
                t = newTable();
            }
            String serviceName = serviceLeistungen.get(i);
            summe+= servicePreisListe.get(serviceName);
            String preis = preisToString(servicePreisListe.get(serviceName));
            addRows(t, serviceName, "", preis);
            rownumber++;
        }


        addRows(t,"Mehrwertsteuer","19%",preisToString(summe*0.19));
        summe*=1.19;

        //leere Zeile int Tabelle einfügen
        PdfPCell p = createPdfCell(" ");
        p.setBorderWidth(0);
        for (int i = 0; i < 3; i++) {
            t.addCell(p);
        }
        //Summe einfügen
        p.setPhrase(new Phrase("Summe:", base));
        t.addCell(p);
        p.setPhrase(new Phrase(""));
        t.addCell(p);
        p.setPhrase(new Phrase(preisToString(summe), base));
        p.setHorizontalAlignment(2);
        t.addCell(p);
        addTableToDocument(document,t,space);
    }

    private static void addRows(PdfPTable table, String name, String anzahl, String preis) {
        table.addCell(createPdfCell(name));
        table.addCell(createPdfCell(anzahl));
        PdfPCell preisCell = createPdfCell(preis);
        preisCell.setHorizontalAlignment(2);
        table.addCell(preisCell);
    }

    private static void FixText(String text, float x, float y, PdfWriter writer, int size, BaseFont bf) {
        PdfContentByte cb = writer.getDirectContent();
        cb.saveState();
        cb.beginText();
        cb.moveText(x, y);
        cb.setFontAndSize(bf, size);
        cb.showText(text);
        cb.endText();
        cb.restoreState();
    }

    private static void CompanyAndClientInfos(PdfWriter writer, Client client){
        int startFirmaAdresse = 788;
        FixText("Zeltverleih Erfurt - Ludwig Fuchs", beginLeft, startFirmaAdresse, writer, 8, regular);
        FixText("__________________________", beginLeft, startFirmaAdresse, writer, 8, regular);
        FixText("Lützewiesenweg 18 - 99098 Erfurt", beginLeft, startFirmaAdresse - 10, writer, 8, regular);
        FixText("___________________________", beginLeft, startFirmaAdresse - 10, writer, 8, regular);
        FixText("_", 152, startFirmaAdresse - 10, writer, 8, regular);

        FixText("Zeltverleih Erfurt", 463, startFirmaAdresse, writer, 12, bold);
        FixText("Ludwig Fuchs", 480, startFirmaAdresse - 12, writer, 12, bold);
        FixText("Lützewiesenweg 18 ", 455, startFirmaAdresse - 24, writer, 12, regular);
        FixText("99098 Erfurt", 493, startFirmaAdresse - 36, writer, 12, regular);

        int startKontaktInfo = startFirmaAdresse - 66;
        FixText("Tel.: 01 76 / 45 82 95 95", 430, startKontaktInfo, writer, 12, regular);
        FixText("E-Mail: info@zeltverleiherfurt.de", 390, startKontaktInfo - 12, writer, 12, regular);
        FixText("Internet: www.zeltverleiherfurt.de", 385.5F, startKontaktInfo - 24, writer, 12, regular);

        int startAdresse = startFirmaAdresse - 32;
        FixText(client.getName(), beginLeft, startAdresse, writer, 12, regular);
        FixText(client.getAddress().getStreet() + " " + client.getAddress().getHouseNumber(), beginLeft, startAdresse - 15, writer, 12, regular);
        FixText(client.getAddress().getPostalCode() + " " + client.getAddress().getCity(), beginLeft, startAdresse - 30, writer, 12, regular);
    }

    private static void headerAngebot(PdfWriter writer, Client client, DateDetails dates) {
        CompanyAndClientInfos(writer, client);
        int startRechnungGross = 642;
        FixText("Angebot vom " + DATE_TIME_FORMATTER.format(dates.getStartDate()) +
                        " bis " + DATE_TIME_FORMATTER.format(dates.getEndDate()),
                beginLeft, startRechnungGross, writer, 20, bold);
        FixText("gültig bis: " + dates.getValidUntil().format(DATE_TIME_FORMATTER),
                beginLeft, startRechnungGross - 20, writer, 10, bold);
        FixText("_______________________________________________________________________________",
                beginLeft, startRechnungGross - 40, writer, 12, regular);
    }

    private static void headerRechnung(PdfWriter writer, Client client, InvoiceDetails rechnungInfos){
        CompanyAndClientInfos(writer, client);
        int startKontaktInfo = 722;
        FixText("Rechnungsdatum: " + rechnungInfos.getInvoiceDate().format(DATE_TIME_FORMATTER), 400.5F, startKontaktInfo - 66, writer, 12, regular);
        FixText("Leistungsdatum: " + rechnungInfos.getPaymentDate().format(DATE_TIME_FORMATTER), 410, startKontaktInfo - 78, writer, 12, regular);
        FixText("ClientNumber: " + client.getCustomerNumber(), 443, startKontaktInfo - 90, writer, 12, regular);

        int startRechnungGross = startKontaktInfo - 80;
        FixText("Rechnung", beginLeft, startRechnungGross, writer, 24, bold);
        FixText("Rechnung Nr.: " + rechnungInfos.invoiceString(), beginLeft, startRechnungGross - 20, writer, 12, bold);
        FixText("Bitte bei Zahlungen und Schriftverkehr angeben!", beginLeft, startRechnungGross - 30, writer, 8, regular);
        FixText("_______________________________________________________________________________",
                beginLeft, startRechnungGross - 40, writer, 12, regular);
    }

    private static void addDeliveryToService(Map<String, Double> servicePreisListe, CostDetails costDetails){
        if (costDetails.getDeliveryCosts()>0)
            servicePreisListe.put("Lieferung", (double) costDetails.getDeliveryCosts());
    }

    private static void footer(PdfWriter writer){
        int startunten = 100;
        FixText("_______________________________________________________________________________",
                beginLeft, startunten, writer, 12, regular);
        FixText("Zeltverleih Erfurt", beginLeft, startunten - 10, writer, 8, regular);
        FixText("Inh. Ludwig Fuchs", beginLeft, startunten - 20, writer, 8, regular);
        FixText("Lützewiesenweg 18", beginLeft, startunten - 30, writer, 8, regular);
        FixText("99098 Erfurt", beginLeft, startunten - 40, writer, 8, regular);

        int beginMiddleLeft = 150;
        FixText("FYRST BASE", beginLeft + beginMiddleLeft, startunten - 10, writer, 8, regular);
        FixText("BLZ: 100 100 10", beginLeft + beginMiddleLeft, startunten - 20, writer, 8, regular);
        FixText("alt KTO: 0020232508", beginLeft + beginMiddleLeft, startunten - 30, writer, 8, regular);
        FixText("KTO Inh.: Zeitverleih Erfurt", beginLeft + beginMiddleLeft, startunten - 40, writer, 8, regular);


        int beginMiddleRight = beginMiddleLeft + 150;
        FixText("IBAN: DE03 1001 0010 0068 2481 46", beginLeft + beginMiddleRight, startunten - 10, writer, 8, regular);
        FixText("BIC: PBNKDEFF", beginLeft + beginMiddleRight, startunten - 20, writer, 8, regular);

        FixText("USt-IdNr. ", 510, startunten - 10, writer, 8, regular);
        FixText("DE356901873", 510, startunten - 20, writer, 8, regular);
    }


    private static PdfPTable newTable(){
        PdfPTable t = new PdfPTable(new float[]{55f, 15f, 30f});
        t.setHorizontalAlignment(0);
        t.setWidthPercentage(75F);
        addTableHeader(t);
        return t;
    }

    private static void addTableToDocument(Document document, PdfPTable t, boolean space) throws DocumentException {
        if (space)
            for (int j = 0; j < 12; j++) {
                document.add(new Paragraph(" "));
            }
        document.add(t);
    }
}
