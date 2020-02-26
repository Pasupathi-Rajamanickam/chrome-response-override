# chrome-response-override
Chrome devtools extension to modify response on the fly, no external app installation required.

Provide support to override API/HTML/* response using simple Find & Replace steps. No external app installation required.

Steps to override response body in chrome extension

1) Open devtools, navigate to "Response Override" tab 
2) Click "Add Row"
3) Enter URL contains value only this URL resonse will be modified.
4) Enter Find value It's a javascript regex pattern. 
5) Enter Replace value to replace with. 
6) Click "Save" to save everything.
7) Click "Play" button to start modifying response.
8) You must click pause button to stop this modification.
9) You must keep this devtools open

Ex. If you want to add new node in json. 
Find: "existingNode":"existingValue" 
Replace: "existingNode":"existingValue", "newNode": "newValue"

How This works: This devtools extension add network break point and listen to URL contains the user input Make API Client call and get response. Do Find and Replace on top of response. Serve the replaced response.

Project space: https://github.com/Pasupathi-Rajamanickam/chrome-response-override

## Contribution
### PR/Issues are welcome. 
1. Please refer <a href="https://github.com/Pasupathi-Rajamanickam/chrome-response-override/projects">Project space</a> to see if we have any ToDo items. 
2. Need clarification? Create an issue with card link.
