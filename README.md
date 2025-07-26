# MMM-KVV-Trias
This is a  MagicMirror² module to gather data from the official KVV-Trias api.
## THIS MODULE IS NOT FULLY DEVELOPED, BUT ALREADY SOMEWHAT WORKS!!
# MMM-Template

![Example of MMM-Template](./example_1.png)

MMM-KVV-Trias uses the Trias API to gather data from KVV Directly

## Installation

### Install

In your terminal, go to your [MagicMirror²][mm] Module folder and clone MMM-Template:

```bash
cd ~/MagicMirror/modules
git clone https://github.com/ZeroTwoWeeb/MMM-KVV-Trias
```
```bash
npm install xml2js
npm install node-fetch@2
```
### Update

```bash
cd ~/MagicMirror/modules/MMM-KVV-Trias
git pull
```

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:

```js
    {
		module: "MMM-KVV-Trias",
		position: "bottom_left",
		config: {
			stationID: "de:08212:90:2:1", // Replace with actual stop ID from stops.txt
			updateInterval: 60000,
			stopsToShow: 5, // how many trains will be shown
			apiURL: "https://projekte.kvv-efa.de/YOUR_API_NAME/trias",
			requestorRef: "API_KEY"
		}
	},
```

## Configuration options

Option|Default|Description
------|------|-----------
`stationID`|not available|Station ID from stops.txt (google transit data)
`updateInterval`|60000|interval of api calls (the API is rate limited) stay over 30000
`stopsToShow`|5|how many connections will be shown ![Download google_transit.zip](https://projekte.kvv-efa.de/GTFS/google_transit.zip)
`apiURL`||your custom api URL (get it from KVV)
`requestorRef`||your api key

## The MIT License (MIT)

Copyright © 2024 ZeroTwoWeeb (https://github.com/ZeroTwoWeeb)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

[mm]: https://github.com/MagicMirrorOrg/MagicMirror
