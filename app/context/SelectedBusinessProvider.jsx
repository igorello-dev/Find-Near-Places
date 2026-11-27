
"use client";

import { useState } from "react";
import { SelectedBusinessContext } from "./SelectedBusinessContext";

// Provider stores the currently selected place/business
//
// Used by:
// - BusinessList
// - MapGoogle
// - PlaceInfoBox

export default function SelectedBusinessProvider({ children }) {
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  return (
    <SelectedBusinessContext.Provider
      value={{
        selectedBusiness,
        setSelectedBusiness,
      }}
    >
      {children}
    </SelectedBusinessContext.Provider>
  );
}
