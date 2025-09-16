# Satellite-Enabled Precision Agriculture: Machine Learning Classification of Cropland Using Sentinel-2 Imagery
A machine learning project that classifies agricultural cropland versus non-cropland areas using Sentinel-2 satellite imagery and spectral analysis techniques.
![Google Earth Engine](https://img.shields.io/badge/Google%20Earth%20Engine-JavaScript-green.svg)
![Jupyter](https://img.shields.io/badge/Jupyter-Notebook-orange.svg)
## Project Overview
This project demonstrates the application of remote sensing and machine learning techniques to classify land use patterns in the Brong-Ahafo region of Ghana. Using Sentinel-2 satellite data, we achieve **100% accuracy** in distinguishing between agricultural cropland and non-cropland areas through spectral band analysis and vegetation indices.

## Technologies & Tools
### **Remote Sensing & Data Collection**
- **Google Earth Engine (GEE)** - Cloud-based platform for satellite data processing
- **Sentinel-2 Satellite Imagery** - European Space Agency's multispectral satellite data
- **JavaScript** - GEE scripting for data extraction and preprocessing

### **Data Analysis & Machine Learning**
- **Python 3.8+** - Primary programming language
- **Jupyter Lab/Notebook** - Interactive development environment
- **Pandas** - Data manipulation and analysis
- **NumPy** - Numerical computing
- **Scikit-learn** - Machine learning algorithms and evaluation metrics

### **Visualization & Analysis**
- **Matplotlib** - Static plotting and visualization
- **Seaborn** - Statistical data visualization
- **PCA** - Principal Component Analysis for dimensionality reduction

## Dataset
- **Source**: Sentinel-2 Level-2A surface reflectance data via Google Earth Engine
- **Study Area**: Brong-Ahafo Region, Ghana
- **Time Period**: 2023
- **Sample Size**: 600 data points (300 crop, 300 non-crop)
- **Features**: 6 spectral bands + 3 derived vegetation indices
- **Balance**: Perfectly balanced dataset (50% crop, 50% non-crop)

**For data collection (optional)**
- Open Google Earth Engine Code Editor
- Copy and Run script: brong_ahafo_crop_classification.js file

### Spectral Bands Used:
- **B2** (Blue): Atmospheric and water analysis
- **B3** (Green): Vegetation and water features
- **B4** (Red): Chlorophyll absorption
- **B8** (NIR): Vegetation health and biomass
- **B11** (SWIR1): Soil and vegetation moisture
- **B12** (SWIR2): Geological features

### Key Insights
- **Vegetation indices are the most discriminative features** (78.5% total importance)
- **Perfect class separation** achieved through spectral differences
- **NDWI shows highest importance**, indicating water content differences
- **Clear spectral signatures** between crop and non-crop areas
