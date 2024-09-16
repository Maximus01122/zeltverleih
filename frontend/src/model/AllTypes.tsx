type Address = {
    id?: number;
    street: string;
    houseNumber: string;
    city: string;
    postalCode: string;
}

const setupValues =
    ["SELBSTABHOLUNG", "LIEFERUNG", "AUFBAU_ZELT", "AUFBAU_BESTUHLUNG", "AUFBAU_REGENRINNE", "AUFBAU_ZELTBODEN", "AUFBAU_AKTIVITÄTEN"] as const;
type SetupServiceName = typeof setupValues[number];

type SetupService = {
    id?: number;
    name: SetupServiceName;
    price?: number;
}

const statusValues =
    ["UNPROCESSED", "OFFER_SENT", "OFFER_REJECTED", "OFFER_ACCEPTED", "PAYMENT_PENDING", "COMPLETED"] as const;
type Status = typeof statusValues[number];

const statusTranslation = {
    "UNPROCESSED" : "unbearbeitet",
    "OFFER_SENT" : "Angebot gesendet",
    "OFFER_REJECTED" : "Angebot abgelehnt",
    "OFFER_ACCEPTED" : "Angebot akzeptiert",
    "PAYMENT_PENDING" : "Zahlung offen",
    "COMPLETED" : "beendet"
}

const categoryValues =
    ["Zelte", "Tische_Bänke_Stühle", "Licht_Schatten", "Wärme_Kälte", "Aktivitäten"] as const;
type Category = typeof categoryValues[number];

type DateDetails = {
    startDate: Date;
    endDate: Date;
    offerDate?: Date;
    validUntil?: Date;
}

type CostDetails = {
    countDailyRent: number;
    countWeekendRent: number;
    deliveryCosts: number;
}

type Booking = {
    id?: number;
    client: Client;
    bookingMaterials: BookingMaterial[];
    setupServices?: SetupService[] | null;  // Akzeptiere auch 'null'
    loadingFee?: LoadingFee | null;       // Akzeptiere auch 'null'
    dateDetails: DateDetails;
    costDetails?: CostDetails;
    status: Status;
    invoiceNumber?: string;
}


type BookingMaterial = {
    id?: number;
    booking?: Booking;
    material: Material;
    quantity: number;
}

type MaterialAvailability = {
    material: Material;
    availableCount: number;
}


type Client = {
    id?: number;
    name: string;
    phoneNumber: string;
    email: string;
    customerNumber?: number;
    address: Address;
}

type LoadingFee = {
    id?: number;
    price: number;
    name: string;
}

type Material = {
    id?: number;
    name: string;
    count: number;
    category: Category,
    materialPrices: MaterialPrice[];
}

type MaterialPrice = {
    id?: number;
    dayPrice: number;
    weekendPrice: number;
    buildUpPrice: number;
    startDate: Date | string;
    material: Material;
}

type PlatzMaterial = {
    material: Material;
    count: number;
    id?: number;
}

type StatistikMaterial = {
    material: string;
    category: string;
    count: number;
    rang: number;
}


export type {
    Address,
    SetupService,
    Booking,
    BookingMaterial,
    Category,
    Client,
    LoadingFee,
    Material,
    MaterialPrice,
    MaterialAvailability,
    PlatzMaterial,
    StatistikMaterial,
    DateDetails,
    CostDetails,
    Status,
    SetupServiceName
}
export { statusValues, statusTranslation, categoryValues, setupValues}
