from sqlalchemy import Column, String, DateTime, Text, JSON
from sqlalchemy.dialects.sqlite import JSON as SQLiteJSON
from database import Base
from datetime import datetime

class Drug(Base):
    __tablename__ = "drugs"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    category = Column(String, nullable=False, index=True)
    description = Column(Text, nullable=False)
    active_ingredients = Column(SQLiteJSON, nullable=False)
    dosage_forms = Column(SQLiteJSON, nullable=False)
    side_effects = Column(SQLiteJSON, nullable=True, default=[])
    contraindications = Column(SQLiteJSON, nullable=True, default=[])
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def __repr__(self):
        return f"<Drug(id='{self.id}', name='{self.name}', category='{self.category}')>"
