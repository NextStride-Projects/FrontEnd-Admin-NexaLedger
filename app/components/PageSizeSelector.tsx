"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

interface SelectorProps {
  route: string;
}

export default function PageSizeSelector({ route }: SelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageSizeParam = searchParams.get("pageSize") || "10";
  const [pageSize, setPageSize] = useState(pageSizeParam);

  useEffect(() => {
    setPageSize(pageSizeParam);
  }, [pageSizeParam]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = e.target.value;
    setPageSize(newSize);

    const params = new URLSearchParams(searchParams.toString());
    params.set("pageSize", newSize);
    params.set("page", "1"); // Reset to first page when page size changes

    router.push(`/dashboard/${route}?${params.toString()}`);
  };

  return (
    <div className="mb-4">
      <label htmlFor="pageSize" className="mr-2">
        Registros por página:
      </label>
      <select
        id="pageSize"
        value={pageSize}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="25">25</option>
        <option value="50">50</option>
        <option value="100">100</option>
      </select>
    </div>
  );
}
