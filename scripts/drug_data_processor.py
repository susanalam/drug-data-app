import json
import sys
from datetime import datetime

# This script demonstrates how you might process drug data
# In a real application, this could be used to:
# - Clean and validate drug data
# - Generate statistics
# - Prepare data for import into a database

# Sample drug data
sample_drugs = [
    {
        "id": "amoxicillin",
        "name": "Amoxicillin",
        "category": "Antibiotics",
        "description": "A penicillin antibiotic that fights bacteria",
        "interactions": ["Probenecid", "Allopurinol", "Oral contraceptives"],
        "side_effects": ["Diarrhea", "Stomach upset", "Nausea", "Rash"]
    },
    {
        "id": "ibuprofen",
        "name": "Ibuprofen",
        "category": "Analgesics",
        "description": "Reduces inflammation and treats pain or fever",
        "interactions": ["Aspirin", "Blood thinners", "ACE inhibitors"],
        "side_effects": ["Upset stomach", "Heartburn", "Dizziness", "Headache"]
    },
    {
        "id": "lisinopril",
        "name": "Lisinopril",
        "category": "Cardiovascular",
        "description": "ACE inhibitor that treats high blood pressure",
        "interactions": ["Potassium supplements", "NSAIDs", "Lithium"],
        "side_effects": ["Dizziness", "Headache", "Dry cough", "Fatigue"]
    }
]

def analyze_drug_data(drugs):
    """Analyze drug data and return statistics"""
    categories = {}
    interaction_counts = {}
    side_effect_counts = {}
    
    for drug in drugs:
        # Count categories
        category = drug.get("category")
        if category:
            categories[category] = categories.get(category, 0) + 1
        
        # Count interactions
        for interaction in drug.get("interactions", []):
            interaction_counts[interaction] = interaction_counts.get(interaction, 0) + 1
        
        # Count side effects
        for side_effect in drug.get("side_effects", []):
            side_effect_counts[side_effect] = side_effect_counts.get(side_effect, 0) + 1
    
    return {
        "total_drugs": len(drugs),
        "categories": categories,
        "common_interactions": sorted(interaction_counts.items(), key=lambda x: x[1], reverse=True)[:5],
        "common_side_effects": sorted(side_effect_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    }

def validate_drug_data(drugs):
    """Validate drug data and return validation results"""
    valid_drugs = []
    invalid_drugs = []
    
    for drug in drugs:
        errors = []
        
        # Check required fields
        for field in ["id", "name", "category", "description"]:
            if field not in drug or not drug[field]:
                errors.append(f"Missing {field}")
        
        # Validate ID format (alphanumeric with hyphens only)
        if "id" in drug and drug["id"]:
            if not all(c.isalnum() or c == '-' for c in drug["id"]):
                errors.append("ID should contain only alphanumeric characters and hyphens")
        
        if errors:
            invalid_drugs.append({"drug": drug.get("name", "Unknown"), "errors": errors})
        else:
            valid_drugs.append(drug)
    
    return {
        "valid_count": len(valid_drugs),
        "invalid_count": len(invalid_drugs),
        "invalid_details": invalid_drugs
    }

def main():
    print("Drug Data Processor")
    print("===================")
    
    # In a real application, you might load data from a file or API
    # For this example, we'll use the sample data
    drugs = sample_drugs
    
    print(f"\nProcessing {len(drugs)} drugs...")
    
    # Analyze the data
    analysis = analyze_drug_data(drugs)
    print("\nData Analysis:")
    print(f"Total drugs: {analysis['total_drugs']}")
    print("\nCategories:")
    for category, count in analysis['categories'].items():
        print(f"- {category}: {count}")
    
    print("\nMost common interactions:")
    for interaction, count in analysis['common_interactions']:
        print(f"- {interaction}: {count}")
    
    print("\nMost common side effects:")
    for side_effect, count in analysis['common_side_effects']:
        print(f"- {side_effect}: {count}")
    
    # Validate the data
    validation = validate_drug_data(drugs)
    print("\nData Validation:")
    print(f"Valid drugs: {validation['valid_count']}")
    print(f"Invalid drugs: {validation['invalid_count']}")
    
    if validation['invalid_count'] > 0:
        print("\nInvalid drug details:")
        for invalid in validation['invalid_details']:
            print(f"- {invalid['drug']}: {', '.join(invalid['errors'])}")
    
    # Generate a report
    report = {
        "timestamp": datetime.now().isoformat(),
        "analysis": analysis,
        "validation": validation
    }
    
    print("\nReport generated successfully.")
    
    # In a real application, you might save this report to a file
    # print(json.dumps(report, indent=2))

if __name__ == "__main__":
    main()
