package de.zeltverleih.util;

public final class DocumentFilenameUtil {

    private DocumentFilenameUtil() {}

    /** e.g. "Angebot Max Mustermann.pdf" */
    public static String pdfFilename(String documentType, String clientName) {
        return "%s %s.pdf".formatted(documentType, sanitizeClientName(clientName));
    }

    private static String sanitizeClientName(String clientName) {
        if (clientName == null || clientName.isBlank()) {
            return "Unbekannt";
        }
        return clientName.trim()
                .replaceAll("[\\\\/:*?\"<>|]", "")
                .replaceAll("\\s+", " ");
    }
}
