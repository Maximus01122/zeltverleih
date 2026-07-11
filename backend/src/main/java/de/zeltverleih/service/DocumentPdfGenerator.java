package de.zeltverleih.service;

import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.Font;
import com.lowagie.text.Image;
import com.lowagie.text.PageSize;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Rectangle;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfPageEventHelper;
import com.lowagie.text.pdf.PdfWriter;
import de.zeltverleih.config.CompanyProperties;
import de.zeltverleih.dto.response.DocumentItemView;
import de.zeltverleih.entity.Client;
import de.zeltverleih.service.DocumentCalculationService.Totals;
import org.springframework.stereotype.Component;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.math.BigDecimal;
import java.text.DecimalFormat;
import java.text.DecimalFormatSymbols;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

/**
 * Renders offer and invoice PDFs following the existing Zeltverleih Erfurt
 * invoice layout: logo top left, sender block top right, recipient left,
 * meta block right, position table (Bezeichnung/Menge/Betrag) with dark blue
 * header row, totals, and a bank footer pinned to the bottom of the page.
 */
@Component
public class DocumentPdfGenerator {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("dd.MM.yyyy");
    private static final DecimalFormat MONEY =
            new DecimalFormat("#,##0.00 €", DecimalFormatSymbols.getInstance(Locale.GERMANY));
    private static final DecimalFormat QUANTITY =
            new DecimalFormat("#,##0.##", DecimalFormatSymbols.getInstance(Locale.GERMANY));

    private static final Color HEADER_BLUE = new Color(31, 55, 92);

    private static final Font FONT_NORMAL = new Font(Font.HELVETICA, 10);
    private static final Font FONT_BOLD = new Font(Font.HELVETICA, 10, Font.BOLD);
    private static final Font FONT_TITLE = new Font(Font.HELVETICA, 16, Font.BOLD);
    private static final Font FONT_SMALL = new Font(Font.HELVETICA, 8);
    private static final Font FONT_TABLE_HEADER = new Font(Font.HELVETICA, 10, Font.BOLD, Color.WHITE);

    private static final float MARGIN = 56;
    private static final float FOOTER_HEIGHT = 84;

    private final CompanyProperties company;
    private final byte[] logo;

    public DocumentPdfGenerator(CompanyProperties company) {
        this.company = company;
        this.logo = loadLogo();
    }

    public byte[] invoice(Client client, String invoiceNumber, LocalDate invoiceDate, LocalDate serviceDate,
                          LocalDate dueDate, Long customerNumber, List<DocumentItemView> items, Totals totals) {
        Map<String, String> meta = new LinkedHashMap<>();
        meta.put("Rechnungsdatum:", DATE.format(invoiceDate));
        meta.put("Leistungsdatum:", DATE.format(serviceDate));
        meta.put("Kundennummer:", String.valueOf(customerNumber));

        return render("Rechnung", "Rechnung Nr.: " + invoiceNumber,
                "Bitte bei Zahlungen und Schriftverkehr angeben!", client, meta, items, totals,
                "Bitte begleichen Sie den angegebenen Betrag bis zum " + DATE.format(dueDate));
    }

    public byte[] offer(Client client, LocalDate offerDate, LocalDate validUntil,
                        LocalDate rentalStart, LocalDate rentalEnd, Long customerNumber,
                        List<DocumentItemView> items, Totals totals) {
        String title = "Angebot vom %s bis %s".formatted(DATE.format(rentalStart), DATE.format(rentalEnd));
        return render(title, null, null, client, Map.of(), items, totals,
                "Dieses Angebot ist gültig bis zum " + DATE.format(validUntil));
    }

    private byte[] render(String title, String numberLine, String numberHint, Client client,
                          Map<String, String> meta, List<DocumentItemView> items, Totals totals,
                          String closingNote) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Document doc = new Document(PageSize.A4, MARGIN, MARGIN, 48, FOOTER_HEIGHT + 40);
            PdfWriter writer = PdfWriter.getInstance(doc, out);
            writer.setPageEvent(new BottomFooter());
            doc.open();

            addHeader(doc);
            addRecipientAndMeta(doc, client, meta);
            addTitle(doc, title, numberLine, numberHint);
            addItemsTable(doc, items, totals);

            Paragraph note = new Paragraph(closingNote, FONT_NORMAL);
            note.setSpacingBefore(24);
            doc.add(note);

            doc.close();
            return out.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("PDF generation failed", e);
        }
    }

    /** Logo left, sender block right. */
    private void addHeader(Document doc) {
        PdfPTable header = new PdfPTable(new float[]{40, 60});
        header.setWidthPercentage(100);

        PdfPCell logoCell;
        if (logo != null) {
            try {
                Image image = Image.getInstance(logo);
                image.scaleToFit(110, 110);
                logoCell = new PdfPCell(image, false);
            } catch (Exception e) {
                logoCell = new PdfPCell(new Phrase(""));
            }
        } else {
            logoCell = new PdfPCell(new Phrase(""));
        }
        logoCell.setBorder(Rectangle.NO_BORDER);
        logoCell.setVerticalAlignment(Element.ALIGN_TOP);
        header.addCell(logoCell);

        Phrase sender = new Phrase();
        sender.add(new Phrase(company.name() + "\n", FONT_BOLD));
        sender.add(new Phrase(company.owner() + "\n" + company.street() + "\n"
                + company.postalCode() + " " + company.city() + "\n\n"
                + "Tel.: " + company.phone() + "\n"
                + "E-Mail: " + company.email() + "\n"
                + "Internet: " + company.website(), FONT_NORMAL));
        Paragraph senderParagraph = new Paragraph(sender);
        senderParagraph.setAlignment(Element.ALIGN_RIGHT);
        PdfPCell senderCell = new PdfPCell();
        senderCell.setBorder(Rectangle.NO_BORDER);
        senderCell.setVerticalAlignment(Element.ALIGN_TOP);
        senderCell.addElement(senderParagraph);
        header.addCell(senderCell);

        doc.add(header);
    }

    private void addRecipientAndMeta(Document doc, Client client, Map<String, String> meta) {
        PdfPTable table = new PdfPTable(new float[]{62, 38});
        table.setWidthPercentage(100);
        table.setSpacingBefore(24);

        String recipient = client.getName() + "\n"
                + client.getAddress().getStreet() + " " + client.getAddress().getHouseNumber() + "\n"
                + client.getAddress().getPostalCode() + " " + client.getAddress().getCity();
        PdfPCell recipientCell = new PdfPCell(new Phrase(recipient, FONT_NORMAL));
        recipientCell.setBorder(Rectangle.NO_BORDER);
        recipientCell.setPadding(2);
        table.addCell(recipientCell);

        if (meta.isEmpty()) {
            table.addCell(borderless(new Phrase("")));
        } else {
            // Values right-aligned so the block ends flush with the sender header above
            PdfPTable metaTable = new PdfPTable(new float[]{55, 45});
            metaTable.setWidthPercentage(100);
            meta.forEach((label, value) -> {
                metaTable.addCell(borderless(new Phrase(label, FONT_NORMAL)));
                PdfPCell valueCell = borderless(new Phrase(value, FONT_NORMAL));
                valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
                metaTable.addCell(valueCell);
            });
            PdfPCell metaCell = new PdfPCell(metaTable);
            metaCell.setBorder(Rectangle.NO_BORDER);
            table.addCell(metaCell);
        }

        doc.add(table);
    }

    private void addTitle(Document doc, String title, String numberLine, String numberHint) {
        Paragraph titleParagraph = new Paragraph(title, FONT_TITLE);
        titleParagraph.setSpacingBefore(24);
        doc.add(titleParagraph);

        if (numberLine != null) {
            doc.add(new Paragraph(numberLine, FONT_BOLD));
        }
        if (numberHint != null) {
            doc.add(new Paragraph(numberHint, FONT_SMALL));
        }
    }

    private void addItemsTable(Document doc, List<DocumentItemView> items, Totals totals) {
        PdfPTable table = new PdfPTable(new float[]{58, 14, 28});
        table.setWidthPercentage(100);
        table.setSpacingBefore(16);

        table.addCell(headerCell("Bezeichnung", Element.ALIGN_LEFT));
        table.addCell(headerCell("Menge", Element.ALIGN_CENTER));
        table.addCell(headerCell("Betrag", Element.ALIGN_RIGHT));

        for (DocumentItemView item : items) {
            table.addCell(bodyCell(item.description(), Element.ALIGN_LEFT));
            table.addCell(bodyCell(QUANTITY.format(item.quantity()), Element.ALIGN_CENTER));
            table.addCell(bodyCell(MONEY.format(item.lineTotal()), Element.ALIGN_RIGHT));
        }

        addTotalRow(table, "Summe netto", totals.net(), FONT_NORMAL);
        addTotalRow(table, "Mehrwertsteuer 19%", totals.vat(), FONT_NORMAL);
        addTotalRow(table, "Summe brutto", totals.gross(), FONT_BOLD);

        doc.add(table);
    }

    /** Draws the bank/company footer pinned to the bottom of every page. */
    private class BottomFooter extends PdfPageEventHelper {
        @Override
        public void onEndPage(PdfWriter writer, Document doc) {
            PdfPTable footer = new PdfPTable(new float[]{25, 25, 32, 18});
            footer.setTotalWidth(doc.getPageSize().getWidth() - 2 * MARGIN);

            footer.addCell(footerCell(company.name() + "\nInh. " + company.owner() + "\n"
                    + company.street() + "\n" + company.postalCode() + " " + company.city()));
            footer.addCell(footerCell(company.bankName()
                    + "\nBLZ: " + company.bankCode()
                    + "\nKTO: " + company.accountNumber()
                    + "\nKTO Inh.: " + company.accountHolder()));
            footer.addCell(footerCell("IBAN: " + company.iban() + "\nBIC: " + company.bic()));
            footer.addCell(footerCell("USt-IdNr.\n" + company.vatId()));

            footer.writeSelectedRows(0, -1, MARGIN, FOOTER_HEIGHT, writer.getDirectContent());
        }
    }

    private byte[] loadLogo() {
        try (InputStream in = getClass().getResourceAsStream("/pdf/logo.jpg")) {
            return in != null ? in.readAllBytes() : null;
        } catch (Exception e) {
            return null;
        }
    }

    private PdfPCell borderless(Phrase phrase) {
        PdfPCell cell = new PdfPCell(phrase);
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(2);
        return cell;
    }

    private PdfPCell headerCell(String text, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FONT_TABLE_HEADER));
        cell.setBackgroundColor(HEADER_BLUE);
        cell.setHorizontalAlignment(alignment);
        return gridCell(cell);
    }

    private PdfPCell bodyCell(String text, int alignment) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FONT_NORMAL));
        cell.setHorizontalAlignment(alignment);
        return gridCell(cell);
    }

    /** Own cell per column so the vertical grid lines continue through the totals rows. */
    private void addTotalRow(PdfPTable table, String label, BigDecimal value, Font font) {
        table.addCell(gridCell(new PdfPCell(new Phrase(label, font))));
        table.addCell(gridCell(new PdfPCell(new Phrase(""))));
        PdfPCell valueCell = new PdfPCell(new Phrase(MONEY.format(value), font));
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(gridCell(valueCell));
    }

    /** Full grid: separator lines between all rows and columns. */
    private PdfPCell gridCell(PdfPCell cell) {
        cell.setBorder(Rectangle.BOX);
        cell.setBorderWidth(0.5f);
        cell.setPadding(6);
        return cell;
    }

    private PdfPCell footerCell(String text) {
        PdfPCell cell = new PdfPCell(new Phrase(text, FONT_SMALL));
        cell.setBorder(Rectangle.TOP);
        cell.setPadding(4);
        return cell;
    }
}
