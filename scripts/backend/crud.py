from sqlalchemy.orm import Session
from models import Drug as DrugModel
from schemas import DrugCreate, DrugUpdate
from typing import List, Optional
from datetime import date
import uuid

def get_drug(db: Session, drug_id: str):
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
        # For SQLite JSON search
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
    # Handle idempotency
    if drug.id:
        existing_drug = get_drug(db, drug.id)
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
    db_drug = get_drug(db, drug_id)
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
    db_drug = get_drug(db, drug_id)
    if not db_drug:
        return False
    
    db.delete(db_drug)
    db.commit()
    return True
