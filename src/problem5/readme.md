# Problem 5

## To run project:
- npm i
- npm run dev
or npm run build then npm run start

## API endpoint

1. Create a resource.
url: http://localhost:3000/courses
method: POST
body: { title: "title" ,description: "description"}

2. List resources with basic filters.
url: http://localhost:3000/courses
method: GET
params: 

3. Get details of a resource.
url: http://localhost:3000/courses/:id
method: GET

4. Update resource details.
url: http://localhost:3000/courses/:id
method: PUT
body: { title: "new title" ,description: "new description"}

5. Delete a resource.
url: http://localhost:3000/courses/:id
method: DELETE