# Icon Setup Instructions

⚠️ **IMPORTANT**: The manifest.json has been updated to use PNG icons. You now need to create the PNG files.

## Converting SVG to PNG

### 🚀 Option 1: Automated Conversion (Recommended)
1. Open `convert-icons-to-png.html` in your web browser
2. Click "Generate & Download All PNG Icons"
3. The browser will automatically download all 4 PNG files
4. Move the downloaded files to this `icons/` folder
5. Verify all files are named correctly:
   - `icon16.png` (16x16 pixels)
   - `icon32.png` (32x32 pixels) 
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

### Option 2: Manual Browser Conversion
1. Open `convert-icons-to-png.html` in your web browser
2. Click "Generate PNG Icons"
3. Right-click each generated icon
4. Select "Save image as..." 
5. Save in this `icons/` folder with correct names

### Option 3: Online Converters
1. Visit an online SVG to PNG converter (e.g., cloudconvert.com, convertio.co)
2. Upload each SVG file from this folder
3. Convert to PNG format at original dimensions
4. Download and save as:
   - `icon16.png` (16x16 pixels)
   - `icon32.png` (32x32 pixels) 
   - `icon48.png` (48x48 pixels)
   - `icon128.png` (128x128 pixels)

### Option 4: Using Image Editing Software
1. Open each SVG file in GIMP, Photoshop, or similar
2. Export as PNG at the correct dimensions
3. Save in this `icons/` folder

## Verification

After creating PNG files, verify:

1. ✅ All PNG files exist in icons/ folder
2. ✅ Files are named exactly: icon16.png, icon32.png, icon48.png, icon128.png
3. ✅ Manifest.json references .png (already updated)
4. ✅ Test extension in Chrome developer mode

## Current Status

- ✅ Manifest.json updated to use PNG extensions
- ⏳ PNG files need to be created (use options above)
- ⏳ Extension ready for testing after PNG creation

## File Structure
```
icons/
├── icon16.png (or .svg)
├── icon32.png (or .svg)  
├── icon48.png (or .svg)
└── icon128.png (or .svg)
```