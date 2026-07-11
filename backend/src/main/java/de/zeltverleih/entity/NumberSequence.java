package de.zeltverleih.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Portable business number sequence (customer numbers, invoice counters).
 * Kept as a row-locked table instead of native DB sequences so the same
 * code works on H2 (dev) and PostgreSQL (prod).
 */
@Entity
@Table(name = "number_sequence")
public class NumberSequence {

    @Id
    private String name;

    private long nextValue;

    protected NumberSequence() {}

    public NumberSequence(String name, long nextValue) {
        this.name = name;
        this.nextValue = nextValue;
    }

    public String getName() { return name; }

    public long getNextValue() { return nextValue; }
    public void setNextValue(long nextValue) { this.nextValue = nextValue; }
}
