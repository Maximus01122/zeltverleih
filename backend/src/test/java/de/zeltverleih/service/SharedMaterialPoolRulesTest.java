package de.zeltverleih.service;

import org.junit.jupiter.api.Test;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class SharedMaterialPoolRulesTest {

    private static final Map<Long, Integer> TOTAL_COUNTS = Map.of(
            SharedMaterialPoolRules.HUSSE_BZG_UNGEB_MIT, 17,
            SharedMaterialPoolRules.HUSSE_BZG_UNGEB_OHNE, 17,
            SharedMaterialPoolRules.HUSSE_BZG_GEB_MIT, 17,
            SharedMaterialPoolRules.HUSSE_BZG_GEB_OHNE, 17,
            SharedMaterialPoolRules.HUFEISEN_SELBST, 1,
            SharedMaterialPoolRules.HUFEISEN_MONTAGE, 1
    );

    @Test
    void mitAndOhneShareSameUngebuegtPool() {
        Map<Long, Long> demand = Map.of(
                SharedMaterialPoolRules.HUSSE_BZG_UNGEB_MIT, 10L,
                SharedMaterialPoolRules.HUSSE_BZG_UNGEB_OHNE, 8L
        );
        assertFalse(SharedMaterialPoolRules.isFeasible(demand, TOTAL_COUNTS));
    }

    @Test
    void combinedDemandWithinPoolIsFeasible() {
        Map<Long, Long> demand = Map.of(
                SharedMaterialPoolRules.HUSSE_BZG_UNGEB_MIT, 10L,
                SharedMaterialPoolRules.HUSSE_BZG_UNGEB_OHNE, 7L
        );
        assertTrue(SharedMaterialPoolRules.isFeasible(demand, TOTAL_COUNTS));
    }

    @Test
    void availableReflectsSharedReservations() {
        Map<Long, Long> reserved = Map.of(SharedMaterialPoolRules.HUSSE_BZG_UNGEB_MIT, 5L);
        assertEquals(12, SharedMaterialPoolRules.availableFor(
                SharedMaterialPoolRules.HUSSE_BZG_UNGEB_OHNE, reserved, TOTAL_COUNTS));
        assertEquals(12, SharedMaterialPoolRules.availableFor(
                SharedMaterialPoolRules.HUSSE_BZG_UNGEB_MIT, reserved, TOTAL_COUNTS));
    }

    @Test
    void gebuegtPoolIsIndependent() {
        Map<Long, Long> reserved = Map.of(
                SharedMaterialPoolRules.HUSSE_BZG_UNGEB_MIT, 17L,
                SharedMaterialPoolRules.HUSSE_BZG_GEB_MIT, 3L
        );
        assertEquals(14, SharedMaterialPoolRules.availableFor(
                SharedMaterialPoolRules.HUSSE_BZG_GEB_OHNE, reserved, TOTAL_COUNTS));
    }

    @Test
    void hufeisenSelbstaufbauAndMontageShareSamePool() {
        Map<Long, Long> bothBooked = Map.of(
                SharedMaterialPoolRules.HUFEISEN_SELBST, 1L,
                SharedMaterialPoolRules.HUFEISEN_MONTAGE, 1L
        );
        assertFalse(SharedMaterialPoolRules.isFeasible(bothBooked, TOTAL_COUNTS));

        Map<Long, Long> oneBooked = Map.of(SharedMaterialPoolRules.HUFEISEN_SELBST, 1L);
        assertTrue(SharedMaterialPoolRules.isFeasible(oneBooked, TOTAL_COUNTS));
        assertEquals(0, SharedMaterialPoolRules.availableFor(
                SharedMaterialPoolRules.HUFEISEN_MONTAGE, oneBooked, TOTAL_COUNTS));
    }
}
