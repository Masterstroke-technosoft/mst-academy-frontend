MST Academy Support Chatbot API
 0.1.0 
OAS 3.1
/openapi.json
default


GET
/
Serve Widget Test


Serves the index.html test page from the static directory.

Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links

GET
/api/health
Health Check


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links

GET
/api/knowledge/status
Knowledge Status


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links

POST
/api/knowledge/reload
Reload Local Knowledge


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links

GET
/api/website/status
Website Status


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links

POST
/api/website/refresh
Refresh Website


Parameters
Try it out
No parameters

Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links

POST
/api/chat
Chat


Parameters
Try it out
No parameters

Request body

application/json
Example Value
Schema
{
  "message": "string",
  "history": [],
  "provider": "gemini"
}
Responses
Code	Description	Links
200	
Successful Response

Media type

application/json
Controls Accept header.
Example Value
Schema
"string"
No links
422	
Validation Error

Media type

application/json
Example Value
Schema
{
  "detail": [
    {
      "loc": [
        "string",
        0
      ],
      "msg": "string",
      "type": "string",
      "input": "string",
      "ctx": {}
    }
  ]
}
No links

Schemas
ChatRequestCollapse allobject
messagestring
historyExpand allarray<any>
providerExpand allstring
HTTPValidationErrorCollapse allobject
detailExpand allarray<object>
ValidationErrorCollapse allobject
locExpand allarray<(string | integer)>
msgstring
typestring
inputany
ctxobject