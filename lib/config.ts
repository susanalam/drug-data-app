// Frontend Configuration Management
// Centralized configuration with environment variables and validation

interface AppConfig {
  // API Configuration
  apiUrl: string
  apiTimeout: number

  // Application Configuration
  appName: string
  appVersion: string
  environment: "development" | "staging" | "production"

  // Feature Flags
  enableDebugLogs: boolean
  enableMockDataFallback: boolean

  // UI Configuration
  itemsPerPage: number
  maxSearchResults: number
}

class ConfigManager {
  private config: AppConfig

  constructor() {
    this.config = this.loadConfig()
    this.validateConfig()
  }

  private loadConfig(): AppConfig {
    return {
      // API Configuration
      apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
      apiTimeout: Number.parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || "10000"),

      // Application Configuration
      appName: process.env.NEXT_PUBLIC_APP_NAME || "Drug Database",
      appVersion: process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0",
      environment: (process.env.NEXT_PUBLIC_ENVIRONMENT as AppConfig["environment"]) || "development",

      // Feature Flags
      enableDebugLogs: process.env.NEXT_PUBLIC_ENABLE_DEBUG_LOGS === "true",
      enableMockDataFallback: process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA_FALLBACK === "true",

      // UI Configuration
      itemsPerPage: Number.parseInt(process.env.NEXT_PUBLIC_ITEMS_PER_PAGE || "20"),
      maxSearchResults: Number.parseInt(process.env.NEXT_PUBLIC_MAX_SEARCH_RESULTS || "100"),
    }
  }

  private validateConfig(): void {
    const errors: string[] = []

    // Validate API URL
    if (!this.config.apiUrl) {
      errors.push("API URL is required")
    }

    // Validate timeout
    if (this.config.apiTimeout < 1000) {
      errors.push("API timeout must be at least 1000ms")
    }

    // Validate pagination
    if (this.config.itemsPerPage < 1 || this.config.itemsPerPage > 100) {
      errors.push("Items per page must be between 1 and 100")
    }

    // Validate search results
    if (this.config.maxSearchResults < 1 || this.config.maxSearchResults > 1000) {
      errors.push("Max search results must be between 1 and 1000")
    }

    if (errors.length > 0) {
      console.error("Configuration validation errors:", errors)
      throw new Error(`Configuration validation failed: ${errors.join(", ")}`)
    }

    if (this.config.enableDebugLogs) {
      console.log("✅ Configuration loaded successfully:", this.config)
    }
  }

  // Getters for configuration values
  get api() {
    return {
      url: this.config.apiUrl,
      timeout: this.config.apiTimeout,
    }
  }

  get app() {
    return {
      name: this.config.appName,
      version: this.config.appVersion,
      environment: this.config.environment,
    }
  }

  get features() {
    return {
      debugLogs: this.config.enableDebugLogs,
      mockDataFallback: this.config.enableMockDataFallback,
    }
  }

  get ui() {
    return {
      itemsPerPage: this.config.itemsPerPage,
      maxSearchResults: this.config.maxSearchResults,
    }
  }

  // Utility methods
  isDevelopment(): boolean {
    return this.config.environment === "development"
  }

  isProduction(): boolean {
    return this.config.environment === "production"
  }

  shouldShowDebugInfo(): boolean {
    return this.config.enableDebugLogs && this.isDevelopment()
  }
}

// Export singleton instance
export const config = new ConfigManager()

// Export types for use in other files
export type { AppConfig }
