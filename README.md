# chrome-response-override
Chrome devtools extension to modify response on the fly, no external app installation required.

Provide support to override API/HTML/* response using simple Find & Replace steps. No external app installation required.

Steps to override response body in chrome extension

1) Open devtools, navigate to "Override Response Body" tab 
2) Enter URL contains value, only this URL response body will be modified. 
3) Enter Find value It's a javascript regex pattern. 
4) Enter Replace value to replace with. 5) Once done, please click Cancel - Chrome, Stop Debugging - Opera.

Ex. If you want to add new node in json. Find: "existingNode":"existingValue" Replace: "existingNode":"existingValue", "newNode": "newValue"

How This works: This devtools extension add network break point and listen to URL contains the user input Make API Client call and get response. Do Find and Replace on top of response. Serve the replaced response.s