"use client"

import { useState, useEffect } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, CheckCircle, RefreshCw } from "lucide-react"
import { checkApiHealth } from "@/lib/api"

export function ApiStatus() {
  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)

  const checkApi = async () => {
    setIsChecking(true)
    const available = await checkApiHealth()
    setIsApiAvailable(available)
    setIsChecking(false)

    // Debug log
    console.log("API Health Check:", available ? "✅ Connected" : "❌ Disconnected")
  }

  useEffect(() => {
    checkApi()
  }, [])

  if (isApiAvailable === null) {
    return null // Don't show anything while initially checking
  }

  if (isApiAvailable) {
    return (
      <Alert className="mb-4 border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Backend API is connected and running at http://localhost:8000
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert className="mb-4 border-red-200 bg-red-50">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-800 flex items-center justify-between">
        <span>⚠️ Backend API is not available at http://localhost:8000. Please ensure Docker container is running.</span>
        <Button
          variant="outline"
          size="sm"
          onClick={checkApi}
          disabled={isChecking}
          className="ml-4 border-red-300 text-red-800 hover:bg-red-100 bg-transparent"
        >
          {isChecking ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          {isChecking ? "Checking..." : "Retry"}
        </Button>
      </AlertDescription>
    </Alert>
  )
}
