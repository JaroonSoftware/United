import React from "react";
import { Route } from "react-router-dom";

import {
  QuoPrintPreview,
  SOPrintPreview,
  DNPrintPreview,
  IVPrintPreview,
  REPrintPreview,
  PaymentPrintPreview,
} from "../components/print";

export const PrintRouter = (
  <>
    <Route path="/quo-print/:code/:print?" element={<QuoPrintPreview />} />
    <Route path="/so-print/:code/:print?" element={<SOPrintPreview />} />
    <Route path="/dn-print/:code/:print?" element={<DNPrintPreview />} />
    <Route path="/re-print/:code/:print?" element={<REPrintPreview />} />
    <Route path="/iv-print/:code/:print?" element={<IVPrintPreview />} />
    <Route
      path="/payment-print/:code/:print?"
      element={<PaymentPrintPreview />}
    />
  </>
);
