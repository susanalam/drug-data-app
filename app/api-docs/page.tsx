import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"

export default function ApiDocsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">API Documentation</h1>
        <p className="text-gray-600 mb-8">Comprehensive documentation for the Drug Database API</p>

        <Tabs defaultValue="overview">
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="errors">Error Handling</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
                <p className="text-gray-700 mb-4">
                  The Drug Database API provides programmatic access to our comprehensive drug information database.
                  This API allows developers to integrate drug data into healthcare applications, research tools, and
                  educational platforms.
                </p>
                <p className="text-gray-700">
                  Our API follows RESTful principles and returns data in JSON format. All API requests must be made over
                  HTTPS.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Base URL</h2>
                <div className="bg-gray-100 p-4 rounded-md">
                  <p className="font-mono">https://api.drugdatabase.example.com/v1</p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Rate Limiting</h2>
                <p className="text-gray-700 mb-4">
                  API requests are limited to 100 requests per minute per API key. If you exceed this limit, you will
                  receive a 429 Too Many Requests response.
                </p>
                <p className="text-gray-700">Rate limit information is included in the response headers:</p>
                <ul className="list-disc pl-6 mt-2 space-y-1 text-gray-700">
                  <li>
                    <code>X-RateLimit-Limit</code>: Maximum number of requests allowed per minute
                  </li>
                  <li>
                    <code>X-RateLimit-Remaining</code>: Number of requests remaining in the current minute
                  </li>
                  <li>
                    <code>X-RateLimit-Reset</code>: Time in seconds until the rate limit resets
                  </li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
                <ol className="list-decimal pl-6 space-y-3 text-gray-700">
                  <li>
                    <p className="font-medium">Sign up for an API key</p>
                    <p>Register for an account and obtain your API key from the developer dashboard.</p>
                  </li>
                  <li>
                    <p className="font-medium">Make your first request</p>
                    <p>Use your API key to authenticate and make a request to one of our endpoints.</p>
                  </li>
                  <li>
                    <p className="font-medium">Integrate with your application</p>
                    <p>
                      Use our client libraries or make direct HTTP requests to integrate drug data into your
                      application.
                    </p>
                  </li>
                </ol>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="authentication">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Authentication</h2>
                <p className="text-gray-700 mb-4">
                  All API requests require authentication using an API key. Your API key should be included in the
                  request header.
                </p>

                <div className="bg-gray-100 p-4 rounded-md mb-4">
                  <p className="font-mono">Authorization: Bearer YOUR_API_KEY</p>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
                  <p className="text-yellow-800">
                    <strong>Important:</strong> Keep your API key secure and never expose it in client-side code.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Example Request with Authentication</h2>
                <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    {`curl -X GET \\
  https://api.drugdatabase.example.com/v1/drugs \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                  </pre>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">API Key Management</h2>
                <p className="text-gray-700 mb-4">
                  You can manage your API keys from the developer dashboard. We recommend rotating your API keys
                  periodically for security.
                </p>
                <Button>Go to Developer Dashboard</Button>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="endpoints">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Available Endpoints</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-3 px-4 text-left border-b">Endpoint</th>
                        <th className="py-3 px-4 text-left border-b">Method</th>
                        <th className="py-3 px-4 text-left border-b">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-3 px-4 border-b font-mono text-sm">/drugs</td>
                        <td className="py-3 px-4 border-b">GET</td>
                        <td className="py-3 px-4 border-b">List all drugs with pagination</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b font-mono text-sm">/drugs/{"{id}"}</td>
                        <td className="py-3 px-4 border-b">GET</td>
                        <td className="py-3 px-4 border-b">Get detailed information about a specific drug</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b font-mono text-sm">/categories</td>
                        <td className="py-3 px-4 border-b">GET</td>
                        <td className="py-3 px-4 border-b">List all drug categories</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b font-mono text-sm">/categories/{"{id}"}/drugs</td>
                        <td className="py-3 px-4 border-b">GET</td>
                        <td className="py-3 px-4 border-b">List all drugs in a specific category</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b font-mono text-sm">/interactions</td>
                        <td className="py-3 px-4 border-b">GET</td>
                        <td className="py-3 px-4 border-b">Check for interactions between multiple drugs</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">GET /drugs</h2>
                <p className="text-gray-700 mb-4">
                  Returns a paginated list of drugs. You can filter the results using query parameters.
                </p>

                <h3 className="text-lg font-medium mb-2">Query Parameters</h3>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 text-left border-b">Parameter</th>
                        <th className="py-2 px-4 text-left border-b">Type</th>
                        <th className="py-2 px-4 text-left border-b">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b font-mono text-sm">page</td>
                        <td className="py-2 px-4 border-b">Integer</td>
                        <td className="py-2 px-4 border-b">Page number (default: 1)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b font-mono text-sm">limit</td>
                        <td className="py-2 px-4 border-b">Integer</td>
                        <td className="py-2 px-4 border-b">Number of results per page (default: 20, max: 100)</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b font-mono text-sm">category</td>
                        <td className="py-2 px-4 border-b">String</td>
                        <td className="py-2 px-4 border-b">Filter by category ID</td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4 border-b font-mono text-sm">search</td>
                        <td className="py-2 px-4 border-b">String</td>
                        <td className="py-2 px-4 border-b">Search term to filter drugs by name or description</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-medium mb-2">Response</h3>
                <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    {`{
  "data": [
    {
      "id": "amoxicillin",
      "name": "Amoxicillin",
      "category": "Antibiotics",
      "description": "A penicillin antibiotic that fights bacteria"
    },
    {
      "id": "ibuprofen",
      "name": "Ibuprofen",
      "category": "Analgesics",
      "description": "Reduces inflammation and treats pain or fever"
    }
  ],
  "pagination": {
    "total": 1500,
    "page": 1,
    "limit": 20,
    "pages": 75
  }
}`}
                  </pre>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">GET /drugs/{"{id}"}</h2>
                <p className="text-gray-700 mb-4">Returns detailed information about a specific drug.</p>

                <h3 className="text-lg font-medium mb-2">Path Parameters</h3>
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-2 px-4 text-left border-b">Parameter</th>
                        <th className="py-2 px-4 text-left border-b">Type</th>
                        <th className="py-2 px-4 text-left border-b">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-2 px-4 border-b font-mono text-sm">id</td>
                        <td className="py-2 px-4 border-b">String</td>
                        <td className="py-2 px-4 border-b">Drug ID</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-lg font-medium mb-2">Response</h3>
                <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                  <pre className="text-sm">
                    {`{
  "id": "amoxicillin",
  "name": "Amoxicillin",
  "category": "Antibiotics",
  "description": "A penicillin antibiotic that fights bacteria",
  "full_description": "Amoxicillin is a penicillin antibiotic that fights bacteria...",
  "uses": [
    "Treatment of bacterial infections",
    "Respiratory tract infections",
    "Ear, nose, and throat infections"
  ],
  "dosage": [
    {
      "condition": "Adults with mild to moderate infections",
      "recommendation": "250-500 mg every 8 hours"
    }
  ],
  "side_effects": {
    "common": ["Diarrhea", "Stomach upset", "Nausea"],
    "serious": ["Severe allergic reactions", "Bloody diarrhea"]
  },
  "interactions": {
    "drugs": [
      {
        "drug": "Probenecid",
        "effect": "May increase amoxicillin levels in the blood"
      }
    ],
    "food": ["Can be taken with or without food"]
  }
}`}
                  </pre>
                </div>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="examples">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Example API Requests</h2>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">List all drugs</h3>
                    <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mb-2">
                      <pre className="text-sm">
                        {`curl -X GET \\
  "https://api.drugdatabase.example.com/v1/drugs" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Search for drugs by name</h3>
                    <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mb-2">
                      <pre className="text-sm">
                        {`curl -X GET \\
  "https://api.drugdatabase.example.com/v1/drugs?search=amox" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Get detailed information about a specific drug</h3>
                    <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mb-2">
                      <pre className="text-sm">
                        {`curl -X GET \\
  "https://api.drugdatabase.example.com/v1/drugs/amoxicillin" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">List all drugs in a specific category</h3>
                    <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mb-2">
                      <pre className="text-sm">
                        {`curl -X GET \\
  "https://api.drugdatabase.example.com/v1/categories/antibiotics/drugs" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                      </pre>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Check for interactions between multiple drugs</h3>
                    <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mb-2">
                      <pre className="text-sm">
                        {`curl -X GET \\
  "https://api.drugdatabase.example.com/v1/interactions?drugs=amoxicillin,ibuprofen" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
                      </pre>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Code Examples</h2>

                <Tabs defaultValue="javascript">
                  <TabsList className="mb-4">
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="php">PHP</TabsTrigger>
                  </TabsList>

                  <TabsContent value="javascript">
                    <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                      <pre className="text-sm">
                        {`// Using fetch API
const API_KEY = 'YOUR_API_KEY';
const API_URL = 'https://api.drugdatabase.example.com/v1';

async function fetchDrugs(search = '', category = '') {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category) params.append('category', category);
  
  const response = await fetch(\`\${API_URL}/drugs?\${params.toString()}\`, {
    headers: {
      'Authorization': \`Bearer \${API_KEY}\`,
      'Content-Type': 'application/json'
    }
  });
  
  if (!response.ok) {
    throw new Error(\`API error: \${response.status}\`);
  }
  
  return await response.json();
}

// Example usage
fetchDrugs('amox', 'antibiotics')
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`}
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="python">
                    <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                      <pre className="text-sm">
                        {`import requests

API_KEY = 'YOUR_API_KEY'
API_URL = 'https://api.drugdatabase.example.com/v1'

def fetch_drugs(search='', category=''):
    params = {}
    if search:
        params['search'] = search
    if category:
        params['category'] = category
    
    headers = {
        'Authorization': f'Bearer {API_KEY}',
        'Content-Type': 'application/json'
    }
    
    response = requests.get(f'{API_URL}/drugs', params=params, headers=headers)
    response.raise_for_status()  # Raise exception for 4XX/5XX responses
    
    return response.json()

# Example usage
try:
    data = fetch_drugs(search='amox', category='antibiotics')
    print(data)
except requests.exceptions.RequestException as e:
    print(f'Error: {e}')`}
                      </pre>
                    </div>
                  </TabsContent>

                  <TabsContent value="php">
                    <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto">
                      <pre className="text-sm">
                        {`<?php
$API_KEY = 'YOUR_API_KEY';
$API_URL = 'https://api.drugdatabase.example.com/v1';

function fetchDrugs($search = '', $category = '') {
    global $API_KEY, $API_URL;
    
    $params = [];
    if ($search) $params['search'] = $search;
    if ($category) $params['category'] = $category;
    
    $url = $API_URL . '/drugs?' . http_build_query($params);
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $API_KEY,
        'Content-Type: application/json'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    
    if (curl_errno($ch) || $httpCode >= 400) {
        throw new Exception('API error: ' . curl_error($ch) . ' (HTTP code: ' . $httpCode . ')');
    }
    
    curl_close($ch);
    return json_decode($response, true);
}

// Example usage
try {
    $data = fetchDrugs('amox', 'antibiotics');
    print_r($data);
} catch (Exception $e) {
    echo 'Error: ' . $e->getMessage();
}
?>`}
                      </pre>
                    </div>
                  </TabsContent>
                </Tabs>
              </section>
            </div>
          </TabsContent>

          <TabsContent value="errors">
            <div className="space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4">Error Handling</h2>
                <p className="text-gray-700 mb-4">
                  The API uses standard HTTP status codes to indicate the success or failure of a request. In case of an
                  error, the response body will contain additional information about the error.
                </p>

                <h3 className="text-lg font-medium mb-2">Error Response Format</h3>
                <div className="bg-gray-800 text-white p-4 rounded-md overflow-x-auto mb-4">
                  <pre className="text-sm">
                    {`{
  "error": {
    "code": "invalid_request",
    "message": "A detailed error message",
    "status": 400
  }
}`}
                  </pre>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Common Error Codes</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="py-3 px-4 text-left border-b">Status Code</th>
                        <th className="py-3 px-4 text-left border-b">Error Code</th>
                        <th className="py-3 px-4 text-left border-b">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-3 px-4 border-b">400</td>
                        <td className="py-3 px-4 border-b font-mono text-sm">invalid_request</td>
                        <td className="py-3 px-4 border-b">
                          The request was malformed or contained invalid parameters
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b">401</td>
                        <td className="py-3 px-4 border-b font-mono text-sm">unauthorized</td>
                        <td className="py-3 px-4 border-b">Authentication failed or API key is missing</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b">403</td>
                        <td className="py-3 px-4 border-b font-mono text-sm">forbidden</td>
                        <td className="py-3 px-4 border-b">
                          The API key doesn't have permission to perform the request
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b">404</td>
                        <td className="py-3 px-4 border-b font-mono text-sm">not_found</td>
                        <td className="py-3 px-4 border-b">The requested resource was not found</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b">429</td>
                        <td className="py-3 px-4 border-b font-mono text-sm">rate_limit_exceeded</td>
                        <td className="py-3 px-4 border-b">The API rate limit has been exceeded</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 border-b">500</td>
                        <td className="py-3 px-4 border-b font-mono text-sm">server_error</td>
                        <td className="py-3 px-4 border-b">An error occurred on the server</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4">Error Handling Best Practices</h2>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>Always check the HTTP status code of the response</li>
                  <li>Handle 4XX and 5XX errors appropriately in your application</li>
                  <li>Implement exponential backoff for retrying failed requests</li>
                  <li>Log detailed error information for debugging</li>
                  <li>Display user-friendly error messages to end users</li>
                </ul>
              </section>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
