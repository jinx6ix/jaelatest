'use client'

import React, { createContext, useContext } from 'react'

const DocumentContext = createContext<any>(null)

export const DocumentProvider: React.FC<{ doc: any; children: React.ReactNode }> = ({ doc, children }) => {
  return <DocumentContext.Provider value={doc}>{children}</DocumentContext.Provider>
}

export const useDocument = () => useContext(DocumentContext)
