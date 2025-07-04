from fastapi import FastAPI, HTTPException, Query, status, Depends, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import create_engine, Column, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.dialects.sqlite import JSON
from typing import List, Optional
from pydantic import BaseModel, validator, ValidationError
import uuid
from datetime import datetime, date
import uvicorn
import logging
import traceback

# Import configuration
from config import settings

# Configure structured logging
logging.basicConfig(
    level=getattr(logging, settings.log_level),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Database setup with configuration
engine = create_engine(
    settings.database_url,
    connect_args=settings.get_database_connect_args()
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class DrugModel(Base):
    __tablename__ = "drugs"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    active_ingredients = Column(JSON, nullable=False)
    dosage_forms = Column(JSON, nullable=False)
    side_effects = Column(JSON, nullable=True, default=[])
    contraindications = Column(JSON, nullable=True, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI app with configuration
app = FastAPI(
    title=settings.api_title,
    description=settings.api_description,
    version=settings.api_version,
    docs_url="/docs" if settings.enable_swagger_ui else None,
    redoc_url="/redoc" if settings.enable_swagger_ui else None,
)

# Global exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.error(f"HTTP Exception: {exc.status_code} - {exc.detail}", 
                extra={"status_code": exc.status_code, "path": request.url.path})
    return JSONResponse(
        status_code=exc.status_code,
        content={"error": {"code": "http_error", "message": exc.detail, "status": exc.status_code}}
    )

@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    logger.error(f"Validation Error: {exc.errors()}", 
                extra={"path": request.url.path, "errors": exc.errors()})
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"error": {"code": "validation_error", "message": "Validation failed", "details": exc.errors()}}
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception: {str(exc)}", 
                extra={"path": request.url.path, "traceback": traceback.format_exc()})
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"error": {"code": "internal_error", "message": "An internal server error occurred"}}
    )

# Add CORS middleware if enabled
if settings.enable_cors:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    logger.info(f"CORS enabled for origins: {settings.cors_origins_list}")

# Dependency to get database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic Models
class DrugBase(BaseModel):
    name: str
    category: str
    description: str
    active_ingredients: List[str]
    dosage_forms: List[str]
    side_effects: List[str] = []
    contraindications: List[str] = []

    @validator('name')
    def name_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()

    @validator('category')
    def category_must_not_be_empty(cls, v):
        if not v or not v.strip():
            raise ValueError('Category cannot be empty')
        return v.strip()

class DrugCreate(DrugBase):
    id: Optional[str] = None

class DrugUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    description: Optional[str] = None
    active_ingredients: Optional[List[str]] = None
    dosage_forms: Optional[List[str]] = None
    side_effects: Optional[List[str]] = None
    contraindications: Optional[List[str]] = None

    @validator('name')
    def name_must_not_be_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip() if v else v

    @validator('category')
    def category_must_not_be_empty(cls, v):
        if v is not None and not v.strip():
            raise ValueError('Category cannot be empty')
        return v.strip() if v else v

class Drug(DrugBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ErrorResponse(BaseModel):
    detail: str

# Database operations
def get_drug_by_id(db: Session, drug_id: str):
    return db.query(DrugModel).filter(DrugModel.id == drug_id).first()

def get_drugs(
    db: Session,
    name: Optional[str] = None,
    category: Optional[str] = None,
    ingredient: Optional[str] = None,
    created_after: Optional[date] = None,
    created_before: Optional[date] = None,
    skip: int = 0,
    limit: int = 100
):
    query = db.query(DrugModel)
    
    if name:
        query = query.filter(DrugModel.name.ilike(f"%{name}%"))
    if category:
        query = query.filter(DrugModel.category.ilike(f"%{category}%"))
    if ingredient:
        query = query.filter(DrugModel.active_ingredients.like(f"%{ingredient}%"))
    if created_after:
        query = query.filter(DrugModel.created_at >= created_after)
    if created_before:
        query = query.filter(DrugModel.created_at <= created_before)
    
    return query.order_by(DrugModel.name).offset(skip).limit(limit).all()

def get_categories(db: Session):
    categories = db.query(DrugModel.category).distinct().all()
    return [category[0] for category in categories]

def create_drug(db: Session, drug: DrugCreate):
    if drug.id:
        existing_drug = get_drug_by_id(db, drug.id)
        if existing_drug:
            return existing_drug
        drug_id = drug.id
    else:
        drug_id = str(uuid.uuid4())
    
    db_drug = DrugModel(
        id=drug_id,
        name=drug.name,
        category=drug.category,
        description=drug.description,
        active_ingredients=drug.active_ingredients,
        dosage_forms=drug.dosage_forms,
        side_effects=drug.side_effects,
        contraindications=drug.contraindications
    )
    
    db.add(db_drug)
    db.commit()
    db.refresh(db_drug)
    return db_drug

def update_drug(db: Session, drug_id: str, drug_update: DrugUpdate):
    db_drug = get_drug_by_id(db, drug_id)
    if not db_drug:
        return None
    
    update_data = drug_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_drug, field, value)
    
    db_drug.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_drug)
    return db_drug

def delete_drug(db: Session, drug_id: str):
    db_drug = get_drug_by_id(db, drug_id)
    if not db_drug:
        return False
    
    db.delete(db_drug)
    db.commit()
    return True

# API Endpoints
@app.get("/")
def read_root():
    return {
        "message": f"Welcome to {settings.api_title}",
        "version": settings.api_version,
        "environment": "development" if settings.debug else "production"
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "version": settings.api_version
    }

@app.get("/drugs", response_model=List[Drug])
def get_drugs_endpoint(
    name: Optional[str] = None,
    category: Optional[str] = None,
    ingredient: Optional[str] = None,
    created_after: Optional[date] = None,
    created_before: Optional[date] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db)
):
    return get_drugs(db, name, category, ingredient, created_after, created_before, skip, limit)

@app.get("/categories")
def get_categories_endpoint(db: Session = Depends(get_db)):
    return get_categories(db)

@app.get("/drugs/{drug_id}", response_model=Drug)
def get_drug_endpoint(drug_id: str, db: Session = Depends(get_db)):
    drug = get_drug_by_id(db, drug_id)
    if not drug:
        raise HTTPException(status_code=404, detail="Drug not found")
    return drug

@app.post("/drugs", response_model=Drug, status_code=status.HTTP_201_CREATED)
def create_drug_endpoint(drug: DrugCreate, db: Session = Depends(get_db)):
    return create_drug(db, drug)

@app.put("/drugs/{drug_id}", response_model=Drug)
def update_drug_endpoint(drug_id: str, drug_update: DrugUpdate, db: Session = Depends(get_db)):
    updated_drug = update_drug(db, drug_id, drug_update)
    if not updated_drug:
        raise HTTPException(status_code=404, detail="Drug not found")
    return updated_drug

@app.delete("/drugs/{drug_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_drug_endpoint(drug_id: str, db: Session = Depends(get_db)):
    if not delete_drug(db, drug_id):
        raise HTTPException(status_code=404, detail="Drug not found")
    return None

# Seed data on startup if enabled
@app.on_event("startup")
def seed_data():
    if not settings.seed_database:
        logger.info("Database seeding disabled")
        return
        
    db = SessionLocal()
    try:
        if db.query(DrugModel).count() == 0:
            sample_drugs = [
                DrugCreate(
                    id="amoxicillin-123",
                    name="Amoxicillin",
                    category="Antibiotics",
                    description="A penicillin antibiotic that fights bacteria",
                    active_ingredients=["Amoxicillin Trihydrate"],
                    dosage_forms=["Capsule", "Tablet", "Oral suspension"],
                    side_effects=["Diarrhea", "Stomach upset", "Nausea", "Vomiting", "Rash"],
                    contraindications=["Penicillin allergy", "Mononucleosis"]
                ),
                DrugCreate(
                    id="ibuprofen-456",
                    name="Ibuprofen",
                    category="Analgesics",
                    description="Reduces inflammation and treats pain or fever",
                    active_ingredients=["Ibuprofen"],
                    dosage_forms=["Tablet", "Capsule", "Oral suspension", "Topical gel"],
                    side_effects=["Upset stomach", "Heartburn", "Dizziness", "Headache"],
                    contraindications=["Aspirin allergy", "Heart failure", "Stomach ulcers"]
                ),
                DrugCreate(
                    id="lisinopril-789",
                    name="Lisinopril",
                    category="Cardiovascular",
                    description="ACE inhibitor that treats high blood pressure",
                    active_ingredients=["Lisinopril"],
                    dosage_forms=["Tablet"],
                    side_effects=["Dizziness", "Headache", "Dry cough", "Fatigue"],
                    contraindications=["Pregnancy", "History of angioedema", "Kidney disease"]
                ),
                DrugCreate(
                    id="metformin-101",
                    name="Metformin",
                    category="Antidiabetic",
                    description="Used to treat type 2 diabetes",
                    active_ingredients=["Metformin Hydrochloride"],
                    dosage_forms=["Tablet", "Extended-release tablet"],
                    side_effects=["Nausea", "Diarrhea", "Stomach upset", "Metallic taste"],
                    contraindications=["Kidney disease", "Liver disease", "Heart failure"]
                ),
            ]
            
            for drug_data in sample_drugs:
                create_drug(db, drug_data)
                
            logger.info("Database seeded with sample data")
        else:
            logger.info("Database already contains data, skipping seed")
    finally:
        db.close()

if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
