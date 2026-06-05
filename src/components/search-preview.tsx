"use client";

import { useState } from "react";
import { SearchToggle } from "./search-toggle";

export function SearchPreview() {
  const [query, setQuery] = useState("");

  return <SearchToggle value={query} onChange={setQuery} />;
}
