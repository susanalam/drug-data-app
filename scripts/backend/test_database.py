import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient
from app import app, get_db
from models import Drug as DrugModel
from database import Base
import tempfile
import os

# Create a temporary database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_drug():
    response = client.post(
        "/drugs",
        json={
            "name": "Test Drug",
            "category": "Test Category",
            "description": "Test Description",
            "active_ingredients": ["Test Ingredient"],
            "dosage_forms": ["Test Form"],
            "side_effects": ["Test Side Effect"],
            "contraindications": ["Test Contraindication"]
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Test Drug"
    assert data["category"] == "Test Category"
    assert "id" in data
    assert "created_at" in data
    assert "updated_at" in data

def test_get_drugs():
    response = client.get("/drugs")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

def test_get_drug():
    # First create a drug
    create_response = client.post(
        "/drugs",
        json={
            "id": "test-drug-123",
            "name": "Test Drug",
            "category": "Test Category",
            "description": "Test Description",
            "active_ingredients": ["Test Ingredient"],
            "dosage_forms": ["Test Form"]
        }
    )
    
    # Then get it
    response = client.get("/drugs/test-drug-123")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Test Drug"

def test_update_drug():
    # First create a drug
    create_response = client.post(
        "/drugs",
        json={
            "id": "test-drug-update",
            "name": "Original Name",
            "category": "Test Category",
            "description": "Test Description",
            "active_ingredients": ["Test Ingredient"],
            "dosage_forms": ["Test Form"]
        }
    )
    
    # Then update it
    response = client.put(
        "/drugs/test-drug-update",
        json={"name": "Updated Name"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Updated Name"

def test_delete_drug():
    # First create a drug
    create_response = client.post(
        "/drugs",
        json={
            "id": "test-drug-delete",
            "name": "To Be Deleted",
            "category": "Test Category",
            "description": "Test Description",
            "active_ingredients": ["Test Ingredient"],
            "dosage_forms": ["Test Form"]
        }
    )
    
    # Then delete it
    response = client.delete("/drugs/test-drug-delete")
    assert response.status_code == 204
    
    # Verify it's gone
    get_response = client.get("/drugs/test-drug-delete")
    assert get_response.status_code == 404

def test_get_categories():
    response = client.get("/categories")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)

# Cleanup
def teardown_module():
    if os.path.exists("./test.db"):
        os.remove("./test.db")
