package de.zeltverleih.service;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDDocumentCatalog;
import org.apache.pdfbox.pdmodel.PDDocumentInformation;
import org.apache.pdfbox.pdmodel.common.PDMetadata;
import org.apache.pdfbox.pdmodel.documentinterchange.logicalstructure.PDMarkInfo;
import org.apache.pdfbox.pdmodel.graphics.color.PDOutputIntent;
import org.springframework.stereotype.Component;
import org.apache.xmpbox.XMPMetadata;
import org.apache.xmpbox.schema.DublinCoreSchema;
import org.apache.xmpbox.schema.PDFAIdentificationSchema;
import org.apache.xmpbox.schema.XMPBasicSchema;
import org.apache.xmpbox.type.BadFieldValueException;
import org.apache.xmpbox.xml.XmpSerializer;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;

/**
 * Upgrades a regular PDF to PDF/A-3b with sRGB output intent and XMP metadata.
 */
@Component
public class PdfA3Converter {

    private static final String ICC_RESOURCE = "/org/apache/pdfbox/resources/sRGB.icc";

    public byte[] toPdfA3(byte[] pdfBytes) {
        try (PDDocument document = Loader.loadPDF(pdfBytes);
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            PDDocumentCatalog catalog = document.getDocumentCatalog();

            try (InputStream icc = openIccProfile()) {
                PDOutputIntent outputIntent = new PDOutputIntent(document, icc);
                outputIntent.setInfo("sRGB IEC61966-2.1");
                outputIntent.setOutputCondition("sRGB IEC61966-2.1");
                outputIntent.setOutputConditionIdentifier("sRGB IEC61966-2.1");
                outputIntent.setRegistryName("http://www.color.org");
                catalog.setOutputIntents(List.of(outputIntent));
            }

            PDDocumentInformation info = document.getDocumentInformation();
            if (info.getTitle() == null) {
                info.setTitle("Rechnung");
            }
            if (info.getCreator() == null) {
                info.setCreator("Zeltverleih Erfurt");
            }
            if (info.getProducer() == null) {
                info.setProducer("Zeltverleih Erfurt");
            }

            catalog.setMetadata(new PDMetadata(document));
            catalog.getMetadata().importXMPMetadata(buildXmpMetadata(info));

            PDMarkInfo markInfo = new PDMarkInfo();
            markInfo.setMarked(true);
            catalog.setMarkInfo(markInfo);

            document.save(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("PDF/A-3 conversion failed", e);
        }
    }

    private InputStream openIccProfile() {
        InputStream icc = PdfA3Converter.class.getResourceAsStream(ICC_RESOURCE);
        if (icc == null) {
            icc = PdfA3Converter.class.getResourceAsStream("/sRGB.icc");
        }
        if (icc == null) {
            throw new IllegalStateException("sRGB ICC profile not found on classpath");
        }
        return icc;
    }

    private byte[] buildXmpMetadata(PDDocumentInformation info) throws BadFieldValueException {
        XMPMetadata xmp = XMPMetadata.createXMPMetadata();
        PDFAIdentificationSchema pdfa = xmp.createAndAddPDFAIdentificationSchema();
        pdfa.setConformance("B");
        pdfa.setPart(3);

        XMPBasicSchema basic = xmp.createAndAddXMPBasicSchema();
        Calendar now = GregorianCalendar.getInstance();
        basic.setCreateDate(now);
        basic.setModifyDate(now);
        basic.setCreatorTool(info.getProducer());

        DublinCoreSchema dc = xmp.createAndAddDublinCoreSchema();
        if (info.getTitle() != null) {
            dc.setTitle(info.getTitle());
        }

        try (ByteArrayOutputStream xmpOut = new ByteArrayOutputStream()) {
            new XmpSerializer().serialize(xmp, xmpOut, true);
            return xmpOut.toByteArray();
        } catch (Exception e) {
            throw new IllegalStateException("XMP metadata creation failed", e);
        }
    }
}
