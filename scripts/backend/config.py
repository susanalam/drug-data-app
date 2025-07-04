from pydantic import BaseSettings, validator
from typing import List, Optional
import os
from pathlib import Path

class Settings(BaseSettings):
    """
    Application settings with environment variable support.
    Uses Pydantic for automatic validation and type conversion.
    """
    
    # Database Configuration
    database_url: str = "sqlite:///./drug_database.db"
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = True
    
    # API Configuration
    api_title: str = "Drug Data API"
    api_description: str = "REST API for managing drug information"
    api_version: str = "2.0.0"
    
    # Security Configuration
    secret_key: str = "your-secret-key-change-in-production"
    cors_origins: str = "*"
    
    # Feature Flags
    enable_cors: bool = True
    enable_swagger_ui: bool = True
    seed_database: bool = True
    
    # Logging Configuration
    log_level: str = "INFO"
    
    @validator('database_url')
    def validate_database_url(cls, v):
        if not v:
            raise ValueError('Database URL cannot be empty')
        return v
    
    @validator('port')
    def validate_port(cls, v):
        if not 1 <= v <= 65535:
            raise ValueError('Port must be between 1 and 65535')
        return v
    
    @validator('secret_key')
    def validate_secret_key(cls, v):
        if len(v) < 32:
            raise ValueError('Secret key must be at least 32 characters long')
        return v
    
    @validator('log_level')
    def validate_log_level(cls, v):
        valid_levels = ['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL']
        if v.upper() not in valid_levels:
            raise ValueError(f'Log level must be one of: {valid_levels}')
        return v.upper()
    
    @property
    def cors_origins_list(self) -> List[str]:
        """Convert CORS origins string to list"""
        if self.cors_origins == "*":
            return ["*"]
        return [origin.strip() for origin in self.cors_origins.split(",")]
    
    @property
    def is_sqlite(self) -> bool:
        """Check if using SQLite database"""
        return self.database_url.startswith("sqlite")
    
    @property
    def is_postgresql(self) -> bool:
        """Check if using PostgreSQL database"""
        return self.database_url.startswith("postgresql")
    
    @property
    def is_mysql(self) -> bool:
        """Check if using MySQL database"""
        return self.database_url.startswith("mysql")
    
    def get_database_connect_args(self) -> dict:
        """Get database connection arguments based on database type"""
        if self.is_sqlite:
            return {"check_same_thread": False}
        return {}
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

# Create settings instance
settings = Settings()

# Validation on import
def validate_settings():
    """Validate settings and print configuration info"""
    try:
        # Test database URL format
        if settings.is_sqlite:
            db_path = settings.database_url.replace("sqlite:///", "")
            if not db_path.startswith("./"):
                # Create directory if it doesn't exist
                Path(db_path).parent.mkdir(parents=True, exist_ok=True)
        
        print("✅ Configuration loaded successfully:")
        print(f"   Database: {settings.database_url}")
        print(f"   Server: {settings.host}:{settings.port}")
        print(f"   Debug: {settings.debug}")
        print(f"   API Title: {settings.api_title}")
        print(f"   CORS Origins: {settings.cors_origins}")
        print(f"   Log Level: {settings.log_level}")
        print(f"   Features: CORS={settings.enable_cors}, Swagger={settings.enable_swagger_ui}, Seed={settings.seed_database}")
        
    except Exception as e:
        print(f"❌ Configuration validation failed: {e}")
        raise

# Validate on import
validate_settings()
