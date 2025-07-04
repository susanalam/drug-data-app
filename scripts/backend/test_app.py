import pytest
from fastapi.testclient import TestClient
from app import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Drug Data API"}

def test_get_drugs():
    response = client.get("/drugs")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
    # Should have our 3 seeded drugs
    assert len(response.json()) == 3

def test_get_drug():
    # Get a drug that exists
    response = client.get("/drugs/amoxicillin-123")
    assert response.status_code == 200
    assert response.json()["name"] == "Amoxicillin"
    
    # Get a drug that doesn't exist
    response = client.get("/drugs/nonexistent")
    assert response.status_code == 404

def test_create_drug():
    # Create a new drug
    new_drug = {
        "name": "Metformin",
        "category": "Antidiabetic",
        "description": "Used to treat type 2 diabetes",
        "active_ingredients": ["Metformin Hydrochloride"],
        "dosage_forms": ["Tablet", "Extended-release tablet"],
        "side_effects": ["Nausea", "Diarrhea", "Stomach upset"],
        "contraindications": ["Kidney disease", "Liver disease"]
    }
    
    response = client.post("/drugs", json=new_drug)
    assert response.status_code == 201
    created_drug = response.json()
    assert created_drug["name"] == "Metformin"
    
    # Test idempotency with client-provided ID
    new_drug_with_id = {
        "id": "test-idempotency-123",
        "name": "Test Drug",
        "category": "Test Category",
        "description": "Test Description",
        "active_ingredients": ["Test Ingredient"],
        "dosage_forms": ["Test Form"]
    }
    
    # First creation
    response1 = client.post("/drugs", json=new_drug_with_id)
    assert response1.status_code == 201
    
    # Second creation with same ID should return the same drug
    response2 = client.post("/drugs", json=new_drug_with_id)
    assert response2.status_code == 201
    assert response1.json()["id"] == response2.json()["id"]
    assert response1.json()["created_at"] == response2.json()["created_at"]

def test_update_drug():
    # Update an existing drug
    update_data = {
        "description": "Updated description for testing"
    }
    
    response = client.put("/drugs/amoxicillin-123", json=update_data)
    assert response.status_code == 200
    updated_drug = response.json()
    assert updated_drug["description"] == "Updated description for testing"
    
    # Try to update a non-existent drug
    response = client.put("/drugs/nonexistent", json=update_data)
    assert response.status_code == 404

def test_delete_drug():
    # Create a drug to delete
    new_drug = {
        "id": "delete-test-123",
        "name": "Delete Test",
        "category": "Test",
        "description": "Drug to be deleted",
        "active_ingredients": ["Test"],
        "dosage_forms": ["Test"]
    }
    
    client.post("/drugs", json=new_drug)
    
    # Delete the drug
    response = client.delete("/drugs/delete-test-123")
    assert response.status_code == 204
    
    # Verify it's deleted
    response = client.get("/drugs/delete-test-123")
    assert response.status_code == 404
    
    # Try to delete a non-existent drug
    response = client.delete("/drugs/nonexistent")
    assert response.status_code == 404

def test_search_drugs():
    # Search by name
    response = client.get("/drugs?name=amox")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["name"] == "Amoxicillin"
    
    # Search by category
    response = client.get("/drugs?category=Analgesics")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["name"] == "Ibuprofen"
    
    # Search by ingredient
    response = client.get("/drugs?ingredient=Ibuprofen")
    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["name"] == "Ibuprofen"
    
    # Test pagination
    response = client.get("/drugs?limit=2")
    assert response.status_code == 200
    assert len(response.json()) == 2
