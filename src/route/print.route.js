import React from 'react'
import { Route } from 'react-router-dom'

import { QuoPrintPreview } from '../components/print'
import { SOPrintPreview } from '../components/print'

export const PrintRouter = (<>
  <Route path="/quo-print/:code/:print?" element={<QuoPrintPreview />} />
  <Route path="/so-print/:code/:print?" element={<SOPrintPreview />} />
</>)