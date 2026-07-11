package de.zeltverleih.enums;

public enum SetupService {
    SELBSTABHOLUNG("Selbstabholung"),
    LIEFERUNG("Lieferung"),
    AUFBAU_ZELT("Aufbau Zelte"),
    AUFBAU_BESTUHLUNG("Aufbau Bestuhlung"),
    AUFBAU_REGENRINNE("Aufbau Regenrinne"),
    AUFBAU_ZELTBODEN("Aufbau Zeltboden"),
    AUFBAU_AKTIVITAETEN("Aufbau Aktivitäten"),
    AUFBAUHILFE("Aufbauhilfe");

    private final String label;

    SetupService(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
