from pydantic import BaseModel, validator
from typing import List, Optional
from datetime import datetime

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
