"use client";

import { useState, useMemo, useCallback } from "react";
import type { Amiibo, AmiiboRelease } from "@/lib/amiibo";
import AmiiboCard from "@/components/AmiiboCard/AmiiboCard";
import FilterBar, { type Filters } from "@/components/FilterBar/FilterBar";
import styles from "./AmiiboGallery.module.css";

const PAGE_SIZE = 48;

function getEarliestDate(release: AmiiboRelease): string {
  const dates = [release.na, release.eu, release.jp, release.au].filter(
    Boolean
  ) as string[];
  return dates.sort()[0] ?? "9999-99-99";
}

interface Props {
  amiibos: Amiibo[];
  allSeries: string[];
}

export default function AmiiboGallery({ amiibos, allSeries }: Props) {
  const [filters, setFilters] = useState<Filters>({
    search: "",
    series: "",
    figureType: "",
    releaseRegion: "",
    sortBy: "release-desc",
  });
  const [page, setPage] = useState(1);

  const handleFiltersChange = useCallback((f: Filters) => {
    setFilters(f);
    setPage(1);
  }, []);

  const filtered = useMemo(() => {
    let list = amiibos;

    if (filters.search.trim()) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter((a) => a.name.toLowerCase().includes(q));
    }
    if (filters.series) {
      list = list.filter((a) => a.series === filters.series);
    }
    if (filters.figureType) {
      list = list.filter((a) => a.figureType === filters.figureType);
    }
    if (filters.releaseRegion) {
      const reg = filters.releaseRegion as keyof AmiiboRelease;
      list = list.filter((a) => !!a.release[reg]);
    }

    const sorted = [...list];
    switch (filters.sortBy) {
      case "name-desc":
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "release-asc":
        sorted.sort(
          (a, b) =>
            getEarliestDate(a.release).localeCompare(getEarliestDate(b.release))
        );
        break;
      case "release-desc":
        sorted.sort(
          (a, b) =>
            getEarliestDate(b.release).localeCompare(getEarliestDate(a.release))
        );
        break;
      default:
        sorted.sort((a, b) => a.name.localeCompare(b.name));
    }

    return sorted;
  }, [amiibos, filters]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div>
      <FilterBar
        allSeries={allSeries}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        totalCount={amiibos.length}
        filteredCount={filtered.length}
      />

      {paginated.length === 0 ? (
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>🔎</span>
          <p>No amiibo found matching your filters.</p>
          <button
            className={styles.resetLink}
            onClick={() =>
              handleFiltersChange({
                search: "",
                series: "",
                figureType: "",
                releaseRegion: "",
                sortBy: "name-asc",
              })
            }
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className={styles.grid}>
          {paginated.map((amiibo) => (
            <AmiiboCard key={amiibo.id} amiibo={amiibo} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            ← Prev
          </button>
          <div className={styles.pageNumbers}>
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let p: number;
              if (totalPages <= 7) {
                p = i + 1;
              } else if (page <= 4) {
                p = i + 1;
              } else if (page >= totalPages - 3) {
                p = totalPages - 6 + i;
              } else {
                p = page - 3 + i;
              }
              return (
                <button
                  key={p}
                  className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              );
            })}
          </div>
          <button
            className={styles.pageBtn}
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
