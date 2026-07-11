package de.zeltverleih.service;

import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * Materials that share one physical stock but appear as separate line items (e.g. different prices).
 */
public final class SharedMaterialPoolRules {

    /** Hussen Bierzeltgarnitur (weiß, ungebügelt) – mit / ohne Biertischgarnitur-Miete */
    public static final long HUSSE_BZG_UNGEB_MIT = 19L;
    public static final long HUSSE_BZG_UNGEB_OHNE = 20L;
    /** Hussen Bierzeltgarnitur (weiß, gebügelt) – mit / ohne Biertischgarnitur-Miete */
    public static final long HUSSE_BZG_GEB_MIT = 21L;
    public static final long HUSSE_BZG_GEB_OHNE = 22L;
    /** Hufeisenwerfen – Selbstaufbau / mit Montage */
    public static final long HUFEISEN_SELBST = 50L;
    public static final long HUFEISEN_MONTAGE = 51L;

    private record Pool(long[] materialIds) {
        long reserved(Map<Long, Long> demand) {
            long sum = 0;
            for (long id : materialIds) {
                sum += demand.getOrDefault(id, 0L);
            }
            return sum;
        }

        boolean contains(long materialId) {
            for (long id : materialIds) {
                if (id == materialId) {
                    return true;
                }
            }
            return false;
        }
    }

    private static final Pool HUSSE_UNGEBUEGT = new Pool(new long[] { HUSSE_BZG_UNGEB_MIT, HUSSE_BZG_UNGEB_OHNE });
    private static final Pool HUSSE_GEBUEGT = new Pool(new long[] { HUSSE_BZG_GEB_MIT, HUSSE_BZG_GEB_OHNE });
    private static final Pool HUFEISEN = new Pool(new long[] { HUFEISEN_SELBST, HUFEISEN_MONTAGE });
    private static final List<Pool> POOLS = List.of(HUSSE_UNGEBUEGT, HUSSE_GEBUEGT, HUFEISEN);

    private static final Set<Long> POOL_MATERIALS = Set.of(
            HUSSE_BZG_UNGEB_MIT, HUSSE_BZG_UNGEB_OHNE, HUSSE_BZG_GEB_MIT, HUSSE_BZG_GEB_OHNE,
            HUFEISEN_SELBST, HUFEISEN_MONTAGE
    );

    private SharedMaterialPoolRules() {
    }

    public static boolean isPoolMaterial(long materialId) {
        return POOL_MATERIALS.contains(materialId);
    }

    public static boolean isFeasible(Map<Long, Long> demand, Map<Long, Integer> totalCounts) {
        for (Pool pool : POOLS) {
            if (pool.reserved(demand) > poolCapacity(pool, totalCounts)) {
                return false;
            }
        }
        return true;
    }

    public static int availableFor(long materialId, Map<Long, Long> reserved, Map<Long, Integer> totalCounts) {
        Pool pool = poolFor(materialId);
        if (pool == null) {
            throw new IllegalArgumentException("Not a shared pool material: " + materialId);
        }
        return Math.max(0, poolCapacity(pool, totalCounts) - (int) pool.reserved(reserved));
    }

    private static Pool poolFor(long materialId) {
        for (Pool pool : POOLS) {
            if (pool.contains(materialId)) {
                return pool;
            }
        }
        return null;
    }

    private static int poolCapacity(Pool pool, Map<Long, Integer> totalCounts) {
        int capacity = 0;
        for (long id : pool.materialIds()) {
            capacity = Math.max(capacity, totalCounts.getOrDefault(id, 0));
        }
        return capacity;
    }
}
