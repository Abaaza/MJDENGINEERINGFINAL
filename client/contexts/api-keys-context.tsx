"use client"

import React, { createContext, useContext, useState, useEffect } from "react"

interface ApiKeyContextType {
  openaiKey: string
  cohereKey: string
  geminiKey: string
  setKeys: (keys: Partial<{openaiKey:string;cohereKey:string;geminiKey:string}>) => void
}

const ApiKeyContext = createContext<ApiKeyContextType>({
  openaiKey: "",
  cohereKey: "",
  geminiKey: "",
  setKeys: () => {}
})

export function ApiKeyProvider({children}:{children:React.ReactNode}){
  const [openaiKey,setOpenai] = useState("")
  const [cohereKey,setCohere] = useState("")
  const [geminiKey,setGemini] = useState("")

  useEffect(() => {
    const stored = localStorage.getItem("apiKeys")
    if(stored){
      const k = JSON.parse(stored)
      setOpenai(k.openaiKey||"")
      setCohere(k.cohereKey||"")
      setGemini(k.geminiKey||"")
    }
  },[])

  const setKeys = (keys: Partial<{openaiKey:string;cohereKey:string;geminiKey:string}>) => {
    if(keys.openaiKey!==undefined) setOpenai(keys.openaiKey)
    if(keys.cohereKey!==undefined) setCohere(keys.cohereKey)
    if(keys.geminiKey!==undefined) setGemini(keys.geminiKey)
    const all = {
      openaiKey: keys.openaiKey ?? openaiKey,
      cohereKey: keys.cohereKey ?? cohereKey,
      geminiKey: keys.geminiKey ?? geminiKey
    }
    localStorage.setItem("apiKeys", JSON.stringify(all))
  }

  return (
    <ApiKeyContext.Provider value={{openaiKey,cohereKey,geminiKey,setKeys}}>
      {children}
    </ApiKeyContext.Provider>
  )
}

export const useApiKeys = () => useContext(ApiKeyContext)
