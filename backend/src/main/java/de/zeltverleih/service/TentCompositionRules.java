package de.zeltverleih.service;

import java.util.Set;

/**
 * Physical coupling between rentable 4×10 m tents and smaller tent modules.
 * <p>
 * Two 4×10 m units exist with fixed component recipes (see seed IDs):
 * <ul>
 *   <li>Unit A: 1× 4×6 m</li>
 *   <li>Unit B: 1× 4×8 m + 1× 4×2 m</li>
 * </ul>
 * Direct rentals of 4×6 m, 4×8 m or 4×2 m compete with these units for the same pool.
 */
public final class TentCompositionRules {

    /** Zelt XS (4×2 m) */
    public static final long TENT_4X2 = 1L;
    /** Zelt L (4×6 m) */
    public static final long TENT_4X6 = 6L;
    /** Zelt XL/1 (4×8 m) */
    public static final long TENT_4X8 = 7L;
    /** Zelt XXL (4×10 m) */
    public static final long TENT_4X10 = 9L;

    private static final int POOL_4X6 = 2;
    private static final int POOL_4X8 = 2;
    private static final int POOL_4X2 = 1;
    private static final int POOL_4X10 = 2;

    private static final Set<Long> COMPOSITION_MATERIALS = Set.of(
            TENT_4X2, TENT_4X6, TENT_4X8, TENT_4X10
    );

    private TentCompositionRules() {
    }

    public static boolean isCompositionMaterial(long materialId) {
        return COMPOSITION_MATERIALS.contains(materialId);
    }

    /**
     * Whether the requested direct bookings and 4×10 m units can be assigned to the two fixed units.
     */
    public static boolean isFeasible(long direct4x6, long direct4x8, long direct4x2, long tents4x10) {
        if (direct4x6 < 0 || direct4x8 < 0 || direct4x2 < 0 || tents4x10 < 0) {
            return false;
        }
        if (direct4x6 > POOL_4X6 || direct4x8 > POOL_4X8 || direct4x2 > POOL_4X2 || tents4x10 > POOL_4X10) {
            return false;
        }
        if (tents4x10 == 0) {
            return true;
        }
        if (tents4x10 == 2) {
            return direct4x6 + 1 <= POOL_4X6
                    && direct4x8 + 1 <= POOL_4X8
                    && direct4x2 + 1 <= POOL_4X2;
        }
        // Exactly one 4×10 m unit booked: either unit A or unit B
        boolean viaUnitA = direct4x6 + 1 <= POOL_4X6;
        boolean viaUnitB = direct4x8 + 1 <= POOL_4X8 && direct4x2 + 1 <= POOL_4X2;
        return viaUnitA || viaUnitB;
    }

    /** Maximum total 4×10 m units that fit alongside the direct bookings. */
    public static int maxFeasible4x10(long direct4x6, long direct4x8, long direct4x2) {
        if (isFeasible(direct4x6, direct4x8, direct4x2, 2)) {
            return 2;
        }
        if (isFeasible(direct4x6, direct4x8, direct4x2, 1)) {
            return 1;
        }
        return 0;
    }

    /** Additional 4×10 m units still bookable given existing reservations. */
    public static int available4x10(long direct4x6, long direct4x8, long direct4x2, long reserved4x10) {
        return Math.max(0, maxFeasible4x10(direct4x6, direct4x8, direct4x2) - (int) reserved4x10);
    }

    /** Additional direct 4×6 m units still bookable given existing reservations. */
    public static int available4x6(long direct4x6, long direct4x8, long direct4x2, long reserved4x10) {
        return Math.max(0, maxDirect4x6(direct4x8, direct4x2, reserved4x10) - (int) direct4x6);
    }

    /** Additional direct 4×8 m units still bookable given existing reservations. */
    public static int available4x8(long direct4x6, long direct4x8, long direct4x2, long reserved4x10) {
        return Math.max(0, maxDirect4x8(direct4x6, direct4x2, reserved4x10) - (int) direct4x8);
    }

    /** Additional direct 4×2 m units still bookable given existing reservations. */
    public static int available4x2(long direct4x6, long direct4x8, long direct4x2, long reserved4x10) {
        return Math.max(0, maxDirect4x2(direct4x6, direct4x8, reserved4x10) - (int) direct4x2);
    }

    public static int availableFor(long materialId, long direct4x6, long direct4x8, long direct4x2, long reserved4x10) {
        if (materialId == TENT_4X6) {
            return available4x6(direct4x6, direct4x8, direct4x2, reserved4x10);
        }
        if (materialId == TENT_4X8) {
            return available4x8(direct4x6, direct4x8, direct4x2, reserved4x10);
        }
        if (materialId == TENT_4X2) {
            return available4x2(direct4x6, direct4x8, direct4x2, reserved4x10);
        }
        if (materialId == TENT_4X10) {
            return available4x10(direct4x6, direct4x8, direct4x2, reserved4x10);
        }
        throw new IllegalArgumentException("Not a tent composition material: " + materialId);
    }

    private static int maxDirect4x6(long direct4x8, long direct4x2, long reserved4x10) {
        for (int k = POOL_4X6; k >= 0; k--) {
            if (isFeasible(k, direct4x8, direct4x2, reserved4x10)) {
                return k;
            }
        }
        return 0;
    }

    private static int maxDirect4x8(long direct4x6, long direct4x2, long reserved4x10) {
        for (int k = POOL_4X8; k >= 0; k--) {
            if (isFeasible(direct4x6, k, direct4x2, reserved4x10)) {
                return k;
            }
        }
        return 0;
    }

    private static int maxDirect4x2(long direct4x6, long direct4x8, long reserved4x10) {
        for (int k = POOL_4X2; k >= 0; k--) {
            if (isFeasible(direct4x6, direct4x8, k, reserved4x10)) {
                return k;
            }
        }
        return 0;
    }
}
