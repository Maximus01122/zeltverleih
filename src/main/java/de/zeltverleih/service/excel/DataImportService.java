package de.zeltverleih.service.excel;

import de.zeltverleih.model.datenbank.*;
import de.zeltverleih.repository.BookingRepository;
import de.zeltverleih.repository.ClientRepository;
import de.zeltverleih.repository.MaterialRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
@Service
public class DataImportService {

    @Autowired
    private ClientRepository clientRepository;
    @Autowired
    private MaterialRepository materialRepository;
    @Autowired
    private BookingRepository bookingRepository;
    private final Map<String, Integer> columnMapping = new HashMap<>();

    private final DataFormatter dataFormatter = new DataFormatter();

    //@PostConstruct
    public void importData() throws IOException {
        FileInputStream excelFile = new FileInputStream("/Users/maximilianfuchs/Desktop/Projekte/Docker2/zeltverleihreactbuchungssystem/src/main/resources/Terminübersicht 2021 Kopie.xlsx");
        Workbook workbook = new XSSFWorkbook(excelFile);
        Sheet sheet = workbook.getSheet("Buchungen");

        //Materialien insgesamt
        //Kunden erstellen
        //Materialien für Buchung auslesen
        //Buchung erstellen

        // Read header row to create column mapping
        Row headerRow = sheet.getRow(0);
        for (Cell cell : headerRow) {
            columnMapping.put(cell.getStringCellValue(), cell.getColumnIndex());
        }

        // create Materialien for database
        createMaterialien(sheet);


        long costumerNumber = 0L;
        for (Row row : sheet) {
            if (row.getRowNum() < 6) continue; // Skip header row

            if (Objects.equals(getCellValue(row, "Kundenname"), "Summe")) {
                break;
            }
            createClient(row, costumerNumber);
            costumerNumber++;
        }

        cleanUpClient();

        for (Row row : sheet) {
            if (row.getRowNum() < 6) continue; // Skip header row

            if (Objects.equals(getCellValue(row, "Kundenname"), "Summe")) {
                break;
            }
            createBooking(row, headerRow);
        }


        workbook.close();
    }

    private String getCellValue(Row row, String columnName) {
        Integer cellIndex = columnMapping.get(columnName);
        if (cellIndex == null) {
            return null;
        }
        Cell cell = row.getCell(cellIndex);
        return cell != null ? dataFormatter.formatCellValue(cell) : null;
    }

    private void createMaterialien(Sheet sheet){
        int colStart = columnMapping.get("Zelt (4x2)");
        int colEnd = columnMapping.get("Vedunklungsplanen");
        int materialInfos = 5; // first 5 rows in sheet contain information about material

        for (int col = colStart; col <= colEnd; col++) {
            Material material = new Material();
            MaterialPrice materialPrice = new MaterialPrice(material, LocalDate.of(2000,1,1));
            for (int row = 0; row <= materialInfos; row++) {
                Cell cell = sheet.getRow(row).getCell(col);
                switch (row) {
                    case 0:
                        material.setName(cell.getStringCellValue());
                        break;
                    case 2:
                        material.setCount((int) cell.getNumericCellValue());
                        break;
                    case 3:
                        materialPrice.setDayPrice(cell.getNumericCellValue());
                        break;
                    case 4:
                        materialPrice.setWeekendPrice(cell.getNumericCellValue());
                        break;
                    case 5:
                        materialPrice.setBuildUpPrice(cell.getNumericCellValue());
                        break;
                }
            }
            material.setMaterialPrices(List.of(materialPrice));
            material.setCategory(MaterialCategory.Zelte);
            materialRepository.save(material);
        }
    }

    private void cleanUpClient() {
        clientRepository.deleteById(45L);
        clientRepository.deleteById(91L);
        Client f = clientRepository.findById(47L).get();
        f.setName("Frau ??");
        clientRepository.save(f);
    }

    private Client createClient(Row row, long costumerNumber){
        Client client = new Client();
        client.setName(getCellValue(row, "Kundenname"));
        client.setPhoneNumber(getCellValue(row, "Telefonnummer"));
        client.setEmail(getCellValue(row, "Email"));
        client.setCustomerNumber(costumerNumber);

        Address address = new Address();
        address.setStreet(getCellValue(row, "Straße"));
        address.setHouseNumber(getCellValue(row, "Hausnummer"));
        address.setPostalCode(getCellValue(row, "PLZ"));
        address.setCity(getCellValue(row, "Ort"));

        client.setAddress(address);
        return clientRepository.save(client);
    }

    private void createBooking(Row currentRow, Row headerRow){
        Booking booking = new Booking();
        String clientName = getCellValue(currentRow, "Kundenname");
        Client client = clientRepository.findByName(clientName).orElseThrow(() -> new RuntimeException("Client not found: " + clientName));
        booking.setClient(client);

        LocalDate startDate = getLocalDateCellValue(currentRow, columnMapping.get("Startdatum"));
        LocalDate endDate = getLocalDateCellValue(currentRow, columnMapping.get("Enddatum"));
        LocalDate offerDate = getLocalDateCellValue(currentRow, columnMapping.get("Angebot vom"));
        LocalDate validUntil = getLocalDateCellValue(currentRow, columnMapping.get("gültig bis"));
        String service = getCellValue(currentRow, "Service");
        assert service != null;
        String[] services = service.split(" und ");
        List<SetupService> setupServices = new ArrayList<>();

        for (String s : services) {
            s = s.trim().replace(" ","_");
            if (!service.isEmpty() && !service.isBlank()){
                SetupServiceName setupService = getEnumFromString(SetupServiceName.class, s.toUpperCase());
                if (setupService != null) {
                    System.out.println("Gefundener Enum-Wert: " + setupService);
                    // Du kannst jetzt `setupService` verwenden.
                } else {
                    System.out.println("Kein passender Enum-Wert gefunden.");
                }
                setupServices.add(new SetupService(setupService,0, booking));
            }
        }

        booking.setDateDetails(new DateDetails(startDate,endDate,offerDate,validUntil));
        booking.setCostDetails(new CostDetails());
        booking.setStatus(BookingStatus.COMPLETED);
        booking.setInvoiceNumber("0000-00-00");
        booking.setSetupServices(setupServices);

        List<BookingMaterial> bookingMaterials = new ArrayList<>();

        // Iteriere über die relevanten Materialspalten und erstelle BookingMaterial-Einträge
        int colStart = columnMapping.get("Zelt (4x2)"); // Startspalte für Materialien
        int colEnd = columnMapping.get("Vedunklungsplanen"); // Endspalte für Materialien

        for (int col = colStart; col <= colEnd; col++) {
            String materialName = headerRow.getCell(col).getStringCellValue(); // Materialname aus der Header-Zeile
            Material material = materialRepository.findByName(materialName)
                    .orElseThrow(() -> new RuntimeException("Material not found: " + materialName));

            String cellValue = getCellValue(currentRow, materialName);
            if (cellValue != null && !cellValue.trim().isEmpty()) {
                int quantity = Integer.parseInt(cellValue);
                BookingMaterial bookingMaterial = new BookingMaterial();
                bookingMaterial.setBooking(booking);
                bookingMaterial.setMaterial(material);
                bookingMaterial.setQuantity(quantity);
                bookingMaterials.add(bookingMaterial);
            }
        }

        booking.setBookingMaterials(bookingMaterials);
        // Save the booking to the database
        bookingRepository.save(booking);
    }

    private LocalDate getLocalDateCellValue(Row row, Integer cellIndex) {
        if (cellIndex == null) return null;
        Cell cell = row.getCell(cellIndex);

        if (cell != null) {
            // Wenn die Zelle ein Datum als Text enthält, z.B. "10-Mai-2021"
            if (cell.getCellType() == CellType.STRING) {
                try {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MMM-yyyy", Locale.GERMAN);
                    return LocalDate.parse(cell.getStringCellValue(), formatter);
                } catch (DateTimeParseException e) {
                    e.printStackTrace();
                    return null;
                }
            }
            // Wenn die Zelle tatsächlich ein Datumstyp ist
            else if (cell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(cell)) {
                return cell.getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
            }
        }

        return null;
    }

    public static <T extends Enum<T>> T getEnumFromString(Class<T> enumClass, String value) {
        if (enumClass != null && value != null) {
            try {
                return Enum.valueOf(enumClass, value);
            } catch (IllegalArgumentException e) {
                // Das bedeutet, dass der String-Wert nicht im Enum vorkommt
            }
        }
        return null; // Rückgabe von null, wenn kein passender Enum-Wert gefunden wurde
    }
}