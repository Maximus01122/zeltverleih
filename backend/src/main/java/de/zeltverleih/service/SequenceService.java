package de.zeltverleih.service;

import de.zeltverleih.entity.NumberSequence;
import de.zeltverleih.repository.NumberSequenceRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SequenceService {

    public static final String CUSTOMER_NUMBER = "customer_number";
    public static final String INVOICE_COUNTER = "invoice_counter";

    private final NumberSequenceRepository repository;
    private final long customerStart;
    private final long invoiceStart;

    public SequenceService(NumberSequenceRepository repository,
                           @Value("${app.numbering.customer-start}") long customerStart,
                           @Value("${app.numbering.invoice-start}") long invoiceStart) {
        this.repository = repository;
        this.customerStart = customerStart;
        this.invoiceStart = invoiceStart;
    }

    @Transactional
    public long nextCustomerNumber() {
        return next(CUSTOMER_NUMBER, customerStart);
    }

    /** Next value that would be handed out, without consuming it. */
    @Transactional(readOnly = true)
    public long peekNextCustomerNumber() {
        return repository.findById(CUSTOMER_NUMBER)
                .map(NumberSequence::getNextValue)
                .orElse(customerStart);
    }

    /** Keeps auto-assignment from reusing a manually assigned customer number. */
    @Transactional
    public void ensureCustomerSequenceAbove(long value) {
        NumberSequence sequence = repository.findByNameForUpdate(CUSTOMER_NUMBER)
                .orElseGet(() -> repository.saveAndFlush(new NumberSequence(CUSTOMER_NUMBER, customerStart)));
        if (sequence.getNextValue() <= value) {
            sequence.setNextValue(value + 1);
        }
    }

    @Transactional
    public long nextInvoiceCounter() {
        return next(INVOICE_COUNTER, invoiceStart);
    }

    /** Row-locked read-increment so concurrent transactions never hand out the same number. */
    private long next(String name, long startValue) {
        NumberSequence sequence = repository.findByNameForUpdate(name)
                .orElseGet(() -> repository.saveAndFlush(new NumberSequence(name, startValue)));
        long value = sequence.getNextValue();
        sequence.setNextValue(value + 1);
        return value;
    }
}
