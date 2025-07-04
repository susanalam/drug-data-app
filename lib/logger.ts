// Structured Logging Utility
// Provides consistent logging with different levels and structured data

export type LogLevel = "debug" | "info" | "warn" | "error"

interface LogEntry {
  timestamp: string
  level: LogLevel
  message: string
  data?: any
  error?: Error
  context?: Record<string, any>
}

class Logger {
  private isDebugEnabled: boolean

  constructor() {
    this.isDebugEnabled = process.env.NODE_ENV === "development" || 
                          process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGS === "true"
  }

  private formatLog(entry: LogEntry): string {
    const { timestamp, level, message, data, error, context } = entry
    
    let logString = `[${timestamp}] ${level.toUpperCase()}: ${message}`
    
    if (data) {
      logString += ` | Data: ${JSON.stringify(data)}`
    }
    
    if (error) {
      logString += ` | Error: ${error.message}`
      if (error.stack) {
        logString += ` | Stack: ${error.stack}`
      }
    }
    
    if (context && Object.keys(context).length > 0) {
      logString += ` | Context: ${JSON.stringify(context)}`
    }
    
    return logString
  }

  private log(level: LogLevel, message: string, data?: any, error?: Error, context?: Record<string, any>) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      error,
      context,
    }

    const formattedLog = this.formatLog(entry)

    switch (level) {
      case "debug":
        if (this.isDebugEnabled) {
          console.log(formattedLog)
        }
        break
      case "info":
        console.info(formattedLog)
        break
      case "warn":
        console.warn(formattedLog)
        break
      case "error":
        console.error(formattedLog)
        break
    }
  }

  debug(message: string, data?: any, context?: Record<string, any>) {
    this.log("debug", message, data, undefined, context)
  }

  info(message: string, data?: any, context?: Record<string, any>) {
    this.log("info", message, data, undefined, context)
  }

  warn(message: string, data?: any, context?: Record<string, any>) {
    this.log("warn", message, data, undefined, context)
  }

  error(message: string, error?: Error, data?: any, context?: Record<string, any>) {
    this.log("error", message, data, error, context)
  }

  // Convenience methods for common scenarios
  apiRequest(url: string, method: string, data?: any) {
    this.debug("API Request", { url, method, data })
  }

  apiResponse(url: string, status: number, data?: any) {
    this.debug("API Response", { url, status, data })
  }

  apiError(url: string, error: Error, status?: number) {
    this.error("API Error", error, { url, status })
  }

  userAction(action: string, data?: any) {
    this.info("User Action", { action, data })
  }

  validationError(field: string, message: string, data?: any) {
    this.warn("Validation Error", { field, message, data })
  }
}

// Export singleton instance
export const logger = new Logger()

// Export types for use in other files
export type { LogEntry } 