/* global ImageData */

function toImageData(georaster, canvasWidth, canvasHeight) {
  if (georaster.values) {
    const { noDataValue, mins, ranges, values } = georaster;
    const numBands = values.length;
    const xRatio = georaster.width / canvasWidth;
    const yRatio = georaster.height / canvasHeight;
    const data = new Uint8ClampedArray(canvasWidth * canvasHeight * 4);
    for (let rowIndex = 0; rowIndex < canvasHeight; rowIndex++) {
      for (let columnIndex = 0; columnIndex < canvasWidth; columnIndex++) {
        const rasterRowIndex = Math.round(rowIndex * yRatio);
        const rasterColumnIndex = Math.round(columnIndex * xRatio);
        const pixelValues = values.map(band => {
          try {
            return band[rasterRowIndex][rasterColumnIndex];
          } catch (error) {
            console.error(error);
          }
        });
        const haveDataForAllBands = pixelValues.every(value => value !== undefined && value !== noDataValue);
        if (haveDataForAllBands) {
          const i = (rowIndex * (canvasWidth * 4)) + 4 * columnIndex;
          if (numBands === 1) {
            const pixelValue = Math.round(pixelValues[0]);
            const scaledPixelValue = Math.round((pixelValue - mins[0]) / ranges[0] * 255);
            data[i] = scaledPixelValue;
            data[i + 1] = scaledPixelValue;
            data[i + 2] = scaledPixelValue;
            data[i + 3] = 255;
          } else if (numBands === 3) {
            try {
              const [r, g, b] = pixelValues;
              data[i] = r;
              data[i + 1] = g;
              data[i + 2] = b;
              data[i + 3] = 255;
            } catch (error) {
              console.error(error);
            }
          } else if (numBands === 4) {
            try {
              const [r, g, b, a] = pixelValues;
              data[i] = r;
              data[i + 1] = g;
              data[i + 2] = b;
              data[i + 3] = a;
            } catch (error) {
              console.error(error);
            }
          }
        }
      }
    }
    return new ImageData(data, canvasWidth, canvasHeight);
  }
}

export default function toCanvas(georaster, options) {
  if (typeof ImageData === "undefined") {
    throw `toCanvas is not supported in your environment`;
  } else {
    const canvas = document.createElement("CANVAS");
    const canvasHeight = options && options.height ? Math.min(georaster.height, options.height) : Math.min(georaster.height, 100);
    const canvasWidth = options && options.width ? Math.min(georaster.width, options.width) : Math.min(georaster.width, 100);
    canvas.height = canvasHeight;
    canvas.width = canvasWidth;
    canvas.style.minHeight = "200px";
    canvas.style.minWidth = "400px";
    canvas.style.maxWidth = "100%";
    const context = canvas.getContext("2d");
    const imageData = toImageData(georaster, canvasWidth, canvasHeight);
    context.putImageData(imageData, 0, 0);
    return canvas;
  }
}

