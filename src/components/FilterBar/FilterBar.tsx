"use client";

import { useState } from "react";
import styles from "./FilterBar.module.css";

export interface Filters {
  search: string;
  series: string;
  figureType: string;
  releaseRegion: string;
  sortBy: string;
}

interface Props {
  allSeries: string[];
  filters: Filters;
  onFiltersChange: (f: Filters) => void;
  totalCount: number;
  filteredCount: number;
}

export default function FilterBar({
  allSeries,
  filters,
  onFiltersChange,
  totalCount,
  filteredCount,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const update = (key: keyof Filters, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const reset = () => {
    onFiltersChange({
      search: "",
      series: "",
      figureType: "",
      releaseRegion: "",
      sortBy: "name-asc",
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.series ||
    filters.figureType ||
    filters.releaseRegion ||
    filters.sortBy !== "name-asc";

  return (
    <div className={styles.filterBar}>
      <div className={styles.topRow}>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search amiibo…"
            value={filters.search}
            onChange={(e) => update("search", e.target.value)}
            aria-label="Search amiibo by name"
          />
          {filters.search && (
            <button
              className={styles.clearBtn}
              onClick={() => update("search", "")}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        <button
          className={`${styles.toggleBtn} ${expanded ? styles.toggleActive : ""}`}
          onClick={() => setExpanded((e) => !e)}
          aria-expanded={expanded}
        >
          <span>Filters</span>
          {hasActiveFilters && <span className={styles.activeDot} />}
          <span className={styles.chevron}>{expanded ? "▲" : "▼"}</span>
        </button>
      </div>

      {expanded && (
        <div className={styles.filtersGrid}>
          <label className={styles.field}>
            <span className={styles.label}>Series</span>
            <select
              className={styles.select}
              value={filters.series}
              onChange={(e) => update("series", e.target.value)}
            >
              <option value="">All Series</option>
              {allSeries.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Type</span>
            <select
              className={styles.select}
              value={filters.figureType}
              onChange={(e) => update("figureType", e.target.value)}
            >
              <option value="">All Types</option>
              <option value="Figure">Figure</option>
              <option value="Card">Card</option>
              <option value="Yarn">Yarn</option>
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Region</span>
            <select
              className={styles.select}
              value={filters.releaseRegion}
              onChange={(e) => update("releaseRegion", e.target.value)}
            >
              <option value="">All Regions</option>
              <option value="na">North America</option>
              <option value="eu">Europe</option>
              <option value="jp">Japan</option>
              <option value="au">Australia</option>
            </select>
          </label>

          <label className={styles.field}>
            <span className={styles.label}>Sort By</span>
            <select
              className={styles.select}
              value={filters.sortBy}
              onChange={(e) => update("sortBy", e.target.value)}
            >
              <option value="name-asc">Name (A–Z)</option>
              <option value="name-desc">Name (Z–A)</option>
              <option value="release-asc">Release (Oldest)</option>
              <option value="release-desc">Release (Newest)</option>
            </select>
          </label>

          {hasActiveFilters && (
            <button className={styles.resetBtn} onClick={reset}>
              Reset Filters
            </button>
          )}
        </div>
      )}

      <div className={styles.resultCount}>
        Showing <strong>{filteredCount}</strong> of{" "}
        <strong>{totalCount}</strong> amiibo
      </div>
    </div>
  );
}
