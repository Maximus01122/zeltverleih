package de.zeltverleih.model;

import de.zeltverleih.model.datenbank.CostDetails;

import java.time.LocalDate;

public class InvoiceDetails extends CostDetails {

    private LocalDate invoiceDate; // rechnungsdatum

    private LocalDate paymentDate; // begleichsdatum
    private LocalDate serviceDate; // leistungsdatum

    int invoiceNumber; // rechnungsnummer

    public InvoiceDetails(LocalDate invoiceDate, LocalDate paymentDate,
                          LocalDate serviceDate, int invoiceNumber) {
        super(0, 0, 0);
        this.invoiceDate = invoiceDate;
        this.paymentDate = paymentDate;
        this.serviceDate = serviceDate;
        this.invoiceNumber = invoiceNumber;
    }

    public String invoiceString(){
        String invoiceString = paymentDate.getYear()+"-";
        if (paymentDate.getMonthValue() < 10)
            invoiceString += "0";
        return invoiceString + paymentDate.getMonthValue() + "-" + invoiceNumber;
    }

    public LocalDate getInvoiceDate() {
        return invoiceDate;
    }

    public void setInvoiceDate(LocalDate invoiceDate) {
        this.invoiceDate = invoiceDate;
    }

    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public int getInvoiceNumber() {
        return invoiceNumber;
    }

    public void setInvoiceNumber(int invoiceNumber) {
        this.invoiceNumber = invoiceNumber;
    }

    public LocalDate getServiceDate() {
        return serviceDate;
    }

    public void setServiceDate(LocalDate serviceDate) {
        this.serviceDate = serviceDate;
    }
}
