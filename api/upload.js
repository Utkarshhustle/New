import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image received' });

    // ✅ Remove Base64 header
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    // ✅ CHANGE THIS TO YOUR ACTUAL DOWNLOADS FOLDER PATH
    // ⚠️ On Windows use double backslashes \\ 
    // Example for Windows:
    // const downloadsPath = 'C:\\Users\\YourUsername\\Downloads';
    // Example for Mac/Linux:
    // const downloadsPath = '/Users/YourUsername/Downloads';

    const downloadsPath = '/Users/utkarshsharma/Downloads';  // <-- CHANGE THIS

    // ✅ Ensure Downloads folder exists (if not, create it)
    if (!fs.existsSync(downloadsPath)) {
      fs.mkdirSync(downloadsPath, { recursive: true });
    }

    // ✅ Create unique filename
    const fileName = `snapshot_${Date.now()}.png`;
    const filePath = path.join(downloadsPath, fileName);

    // ✅ Save snapshot directly to your Downloads folder
    fs.writeFileSync(filePath, base64Data, 'base64');

    console.log('✅ Image saved to:', filePath);
    res.status(200).send(`✅ Image saved locally: ${filePath}`);

  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).send('❌ Server error saving image');
  }
}
