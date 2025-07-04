import { NextResponse } from "next/server"

// This would typically come from a database
const categories = [
  {
    id: "antibiotics",
    name: "Antibiotics",
    description: "Medications used to treat bacterial infections",
  },
  {
    id: "analgesics",
    name: "Analgesics",
    description: "Pain relievers and medications that reduce inflammation",
  },
  {
    id: "cardiovascular",
    name: "Cardiovascular Drugs",
    description: "Medications for heart conditions and blood pressure",
  },
  {
    id: "antidiabetic",
    name: "Antidiabetic",
    description: "Medications used to treat diabetes",
  },
  {
    id: "hormones",
    name: "Hormones",
    description: "Medications that replace or supplement natural hormones",
  },
]

export async function GET() {
  return NextResponse.json(categories)
}

export async function POST(request: Request) {
  try {
    const category = await request.json()

    // Validate required fields
    if (!category.name || !category.description) {
      return NextResponse.json({ error: "Name and description are required" }, { status: 400 })
    }

    // In a real app, you would save to a database here
    // For this example, we'll just return the category with a fake ID
    const newCategory = {
      id: category.name.toLowerCase().replace(/\s+/g, "-"),
      ...category,
    }

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
  }
}
