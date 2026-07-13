package de.zeltverleih.service;

import de.zeltverleih.config.CompanyProperties;
import de.zeltverleih.config.EInvoiceProperties;
import de.zeltverleih.dto.response.DocumentItemView;
import de.zeltverleih.entity.Client;
import de.zeltverleih.entity.Invoice;
import de.zeltverleih.exception.EInvoiceValidationException;
import org.mustangproject.ZUGFeRD.Profiles;
import org.mustangproject.ZUGFeRD.ZUGFeRD2PullProvider;
import org.mustangproject.ZUGFeRD.ZUGFeRDExporterFromA3;
import org.mustangproject.validator.ZUGFeRDValidator;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class EInvoiceService {

    public record EInvoiceResult(byte[] pdf, byte[] xml) {}

    private final ZugferdInvoiceMapper mapper;
    private final EInvoiceProperties einvoiceProperties;
    private final CompanyProperties company;

    public EInvoiceService(ZugferdInvoiceMapper mapper,
                           EInvoiceProperties einvoiceProperties,
                           CompanyProperties company) {
        this.mapper = mapper;
        this.einvoiceProperties = einvoiceProperties;
        this.company = company;
    }

    public EInvoiceResult create(Invoice invoice, Client client, List<DocumentItemView> items, byte[] visualPdfA3) {
        org.mustangproject.Invoice mustangInvoice = mapper.toMustangInvoice(invoice, client, items);
        byte[] xml = generateXml(mustangInvoice);
        byte[] zugferdPdf = embedXml(visualPdfA3, xml);
        validate(zugferdPdf);
        return new EInvoiceResult(zugferdPdf, xml);
    }

    public byte[] embedStoredXml(byte[] visualPdfA3, byte[] storedXml) {
        return embedXml(visualPdfA3, storedXml);
    }

    public byte[] generateXml(org.mustangproject.Invoice mustangInvoice) {
        ZUGFeRD2PullProvider provider = new ZUGFeRD2PullProvider();
        provider.setProfile(Profiles.getByName(einvoiceProperties.profile()));
        provider.generateXML(mustangInvoice);
        return provider.getXML();
    }

    private byte[] embedXml(byte[] visualPdfA3, byte[] xml) {
        try (ZUGFeRDExporterFromA3 exporter = new ZUGFeRDExporterFromA3()
                .setProducer(company.name())
                .setCreator(company.name())
                .setProfile(Profiles.getByName(einvoiceProperties.profile()))) {
            exporter.load(visualPdfA3);
            exporter.setXML(xml);
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            exporter.export(out);
            return out.toByteArray();
        } catch (IOException e) {
            throw new IllegalStateException("ZUGFeRD PDF generation failed", e);
        }
    }

    private void validate(byte[] pdf) {
        ZUGFeRDValidator validator = new ZUGFeRDValidator();
        validator.disableNotices();
        String validationText = validator.validate(pdf, "pdf");
        if (!validator.wasCompletelyValid()) {
            throw new EInvoiceValidationException(
                    "E-Rechnung ist nicht valide: " + validationText);
        }
    }
}
