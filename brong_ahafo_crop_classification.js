// Crop vs Non-Crop: Ghana (Brong Ahafo)

// Define study area
var studyArea = ee.Geometry.Rectangle([-3.0, 6.5, -1.5, 8.5]);
Map.centerObject(studyArea, 8);
Map.addLayer(studyArea, {color: 'red'}, 'Brong Ahafo AOI');

// Load Sentinel-2 Surface Reflectance collection
var s2Collection = ee.ImageCollection('COPERNICUS/S2_SR')
  .filterBounds(studyArea)
  .filterDate('2023-04-01', '2023-07-31')  // Major growing season
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20));

print('Number of images found:', s2Collection.size());

// Function to mask clouds and cirrus (QA60 band)
function maskS2clouds(image) {
  var qa = image.select('QA60');
  var cloudBitMask = 1 << 10;
  var cirrusBitMask = 1 << 11;
  var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
              .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
  return image.updateMask(mask)
              .divide(10000)  // scale reflectance to 0–1
              .copyProperties(image, ['system:time_start']);
}

// Apply cloud masking and create median composite
var s2Composite = s2Collection
  .map(maskS2clouds)
  .median()
  .clip(studyArea)
  .select(['B2','B3','B4','B8','B11','B12']); // RGB + NIR + SWIR

// Compute NDVI
var ndvi = s2Composite.normalizedDifference(['B8','B4']).rename('NDVI');

// NDVI visualization parameters
var ndviVis = {
  min: 0.1,
  max: 0.9,
  palette: ['blue', 'white', 'green']  // water / bare soil / vegetation
};

// Add layers to map
Map.addLayer(ndvi, ndviVis, 'NDVI');
// Map.addLayer(s2Composite, {bands: ['B4','B3','B2'], min:0, max:0.3}, 'S2 Composite - True Color');
// Map.addLayer(s2Composite, {bands: ['B8','B4','B3'], min:0, max:0.3}, 'S2 Composite - False Color');

// Threshold NDVI to define crop and non-crop masks
var cropMask = ndvi.gt(0.4);
var nonCropMask = ndvi.lt(0.2);

// Visualize
Map.addLayer(cropMask.updateMask(cropMask), {palette: ['green']}, 'Crop Mask');
Map.addLayer(nonCropMask.updateMask(nonCropMask), {palette: ['red']}, 'Non-Crop Mask');

// Function to sample points from a mask
function getSamplePoints(mask, label, count) {
  return mask.selfMask()  // keep only valid pixels
    .stratifiedSample({
      numPoints: count,
      classBand: null,   // no class band in mask
      region: studyArea,
      scale: 10,
      seed: label + 1,
      geometries: true
    })
    .map(function(f) {
      return f.set('class', label);
    });
}

// Generate 100 points for each class
var cropPoints = getSamplePoints(cropMask, 1, 300);
var nonCropPoints = getSamplePoints(nonCropMask, 0, 300);

// Merge into single training FeatureCollection
var trainingPoints = cropPoints.merge(nonCropPoints);

// Visualize sampled points
Map.addLayer(trainingPoints, {color: 'yellow'}, 'Training Points');

var trainingData = s2Composite.sampleRegions({
  collection: trainingPoints,
  properties: ['class'],
  scale: 10
});

// Select relevant bands and class label for export
var exportData = trainingData.select(['B2','B3','B4','B8','B11','B12','class']);

// Export the table to Google Drive
Export.table.toDrive({
  collection: exportData,
  description: 'BrongAhafo_Crop_TrainingData_2023',  // Export task name
  fileNamePrefix: 'BrongAhafo_TrainData_2023',       // CSV file name
  folder: 'GEE_Exports',                             // Drive folder name
  fileFormat: 'CSV'
});
