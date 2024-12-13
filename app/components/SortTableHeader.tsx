"use client";

import { FaChevronUp } from "react-icons/fa";
import Link from "next/link";

interface SortableHeaderProps {
  title: string;
  sortByField: string;
  currentSortBy: string;
  currentSortDirection: string;
  searchParams: Record<string, string | undefined>;
  route: string;
}

export default function SortableHeader({
  title,
  sortByField,
  currentSortBy,
  currentSortDirection,
  searchParams,
  route
}: SortableHeaderProps) {
  const isActive = currentSortBy === sortByField;
  const nextSortDirection =
    isActive && currentSortDirection === "asc" ? "desc" : "asc";

  return (
    <Link
      href={{
        pathname: `/dashboard/${route}`,
        query: {
          ...searchParams,
          sortBy: sortByField,
          sortDirection: nextSortDirection,
        },
      }}
      className="px-4 py-2 text-left font-medium cursor-pointer flex items-center"
    >
      {title}
      <span
        className={`ml-1 transition-transform duration-200 ${
          isActive ? "opacity-100" : "opacity-0"
        }`}
      >
        <FaChevronUp
          className={`transform ${
            currentSortDirection === "asc" ? "rotate-0" : "rotate-180"
          }`}
        />
      </span>
    </Link>
  );
}

