# georaster-to-canvas
Converts a GeoRaster into a Canvas

# usage
```javascript
const geoblaze = require("geoblaze");
const toCanvas = require("georaster-to-canvas");
const url = "https://s3.amazonaws.com/geoblaze/wildfires.tiff";
geoblaze.load(url).then(georaster => {
  const canvas = toCanvas(georaster, { height: 500, width: 500 });
});
```