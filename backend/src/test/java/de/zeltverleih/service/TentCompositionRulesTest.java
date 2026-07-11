package de.zeltverleih.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class TentCompositionRulesTest {

    @Test
    void two4x6AndTwo4x10NotPossible() {
        assertFalse(TentCompositionRules.isFeasible(2, 0, 0, 2));
    }

    @Test
    void one4x6AndTwo4x10Possible() {
        assertTrue(TentCompositionRules.isFeasible(1, 0, 0, 2));
    }

    @Test
    void two4x6StillAllowsOne4x10ViaUnitB() {
        assertTrue(TentCompositionRules.isFeasible(2, 0, 0, 1));
        assertFalse(TentCompositionRules.isFeasible(2, 0, 0, 2));
    }

    @Test
    void allComponentsTakenBlocks4x10() {
        assertFalse(TentCompositionRules.isFeasible(2, 1, 1, 1));
    }

    @Test
    void one4x8TakenStillAllowsOne4x10ViaUnitA() {
        assertTrue(TentCompositionRules.isFeasible(0, 1, 0, 1));
    }

    @Test
    void customer2ScenarioAfterCustomer1TookBoth4x6() {
        long afterC1Direct4x6 = 2;
        assertTrue(TentCompositionRules.isFeasible(afterC1Direct4x6, 0, 0, 1));
        assertEquals(1, TentCompositionRules.available4x10(afterC1Direct4x6, 0, 0, 0));
    }

    @Test
    void customer2BlockedAfterCustomer1MixedBooking() {
        assertFalse(TentCompositionRules.isFeasible(2, 1, 1, 1));
    }
}
