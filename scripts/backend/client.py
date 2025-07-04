"""
Example client script to interact with the Drug Data API.
This demonstrates how to use the API programmatically.
"""

import requests
import json
from datetime import datetime

BASE_URL = "http://localhost:8000"

def print_response(response):
    """Pretty print the API response"""
    try:
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
    except:
        print(f"Response: {response.text}")
    print("-" * 50)

def get_all_drugs():
    """Get all drugs"""
    print("\nGetting all drugs...")
    response = requests.get(f"{BASE_URL}/drugs")
    print_response(response)
    return response.json() if response.status_code == 200 else []

def search_drugs(name=None, category=None, ingredient=None):
    """Search for drugs with filters"""
    params = {}
    if name:
        params["name"] = name
    if category:
        params["category"] = category
    if ingredient:
        params["ingredient"] = ingredient
    
    print(f"\nSearching drugs with params: {params}...")
    response = requests.get(f"{BASE_URL}/drugs", params=params)
    print_response(response)

def get_drug(drug_id):
    """Get a specific drug by ID"""
    print(f"\nGetting drug with ID: {drug_id}...")
    response = requests.get(f"{BASE_URL}/drugs/{drug_id}")
    print_response(response)

def create_drug(drug_data):
    """Create a new drug"""
    print(f"\nCreating new drug: {drug_data['name']}...")
    response = requests.post(f"{BASE_URL}/drugs", json=drug_data)
    print_response(response)
    return response.json() if response.status_code == 201 else None

def update_drug(drug_id, update_data):
    """Update an existing drug"""
    print(f"\nUpdating drug with ID: {drug_id}...")
    response = requests.put(f"{BASE_URL}/drugs/{drug_id}", json=update_data)
    print_response(response)

def delete_drug(drug_id):
    """Delete a drug"""
    print(f"\nDeleting drug with ID: {drug_id}...")
    response = requests.delete(f"{BASE_URL}/drugs/{drug_id}")
    print(f"Status Code: {response.status_code}")
    print("-" * 50)

def main():
    """Main function to demonstrate API usage"""
    print("Drug Data API Client Demo")
    print("=" * 50)
    
    # Get all drugs
    drugs = get_all_drugs()
    
    # Search for drugs
    search_drugs(name="amox")
    search_drugs(category="Analgesics")
    search_drugs(ingredient="Ibuprofen")
    
    # Get a specific drug
    if drugs:
        get_drug(drugs[0]["id"])
    
    # Create a new drug
    new_drug = {
        "id": "metformin-test-123",  # Client-provided ID for idempotency
        "name": "Metformin",
        "category": "Antidiabetic",
        "description": "Used to treat type 2 diabetes",
        "active_ingredients": ["Metformin Hydrochloride"],
        "dosage_forms": ["Tablet", "Extended-release tablet"],
        "side_effects": ["Nausea", "Diarrhea", "Stomach upset"],
        "contraindications": ["Kidney disease", "Liver disease"]
    }
    created_drug = create_drug(new_drug)
    
    # Test idempotency by creating the same drug again
    if created_drug:
        print("\nTesting idempotency by creating the same drug again...")
        create_drug(new_drug)
    
    # Update a drug
    if created_drug:
        update_data = {
            "description": "Updated description: First-line medication for type 2 diabetes",
            "side_effects": ["Nausea", "Diarrhea", "Stomach upset", "Vitamin B12 deficiency"]
        }
        update_drug(created_drug["id"], update_data)
    
    # Delete a drug
    if created_drug:
        delete_drug(created_drug["id"])
    
    print("\nDemo completed!")

if __name__ == "__main__":
    main()
