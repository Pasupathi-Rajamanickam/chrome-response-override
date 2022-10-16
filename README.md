# chrome-response-override
Chrome devtools extension to modify response on the fly, no external app installation required.

Provide support to override API/HTML/* response using simple Find & Replace steps. No external app installation required.

## Install Plugin
* Install from chrome web store - https://chrome.google.com/webstore/detail/chrome-response-override/kbipbobgpnhgghikihmodppmfbkbmgfj
* Close all devtools and open new devtools by pressing F12 or by navigating through developer menu or by right click on page and inspect element.
* You might see new tab called "Response Override" added 
<img width="408" alt="image" src="https://user-images.githubusercontent.com/12167873/196017955-f7d44515-05ea-4b74-9561-d38c1d3dfd40.png">

* Click on Response Override tab and proceed further steps.


## Steps to override response body in chrome extension

1) Open devtools, navigate to "Response Override" tab 
2) Click "Add Row"
3) Enter URL contains value only this URL response will be modified. If you want to modify URL in home page like www.example.com and no URI Path, use Special variable called `~NO_URI~` in URL contains field.
4) Enter Find value It's a javascript regex pattern. 
5) Enter Replace value to replace with. No need to provide content-type
6) Click "Save" to save everything.
7) Click "Play" button to start modifying response.
8) You must click pause button to stop this modification.
9) You must keep this devtools open
10) Issue with the override, either open private tab with only this plugin enabled in private tab or please try disabling other plugins working with network, like request header modifier and run this plugin again. If the other plugins using old network API may affect this plugin

Ex. 
If you want to add new node in json. 
Find: "existingNode":"existingValue" 
Replace: "existingNode":"existingValue", "newNode": "newValue"

If you want to modify URL in home page like on www.example.com page and no URI Path, use Special variable called `~NO_URI~` in URL contains field.

## Special Variable
1. If you put `~NO_API~` in Find, no remote call will be made, provide full response. Provide content-type in this case.
2. If you want to modify URL in home page like on www.example.com page and no URI Path, use Special variable called `~NO_URI~` in URL contains field.

How This works: This devtools extension add network break point and listen to URL contains the user input Make API Client call and get response. Do Find and Replace on top of response. Serve the replaced response.

Project space: https://github.com/Pasupathi-Rajamanickam/chrome-response-override

## Contribution
### PR/Issues are welcome. 
1. Please refer <a href="https://github.com/Pasupathi-Rajamanickam/chrome-response-override/projects">Project space</a> to see if we have any ToDo items. 
2. Need clarification? Create an issue with card link.
