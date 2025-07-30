import fs from 'fs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { image } = req.body;
    if (!image) return res.status(400).json({ error: 'No image received' });

    // Remove Base64 header
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    // Save snapshot to the Vercel server's temporary folder
    const filePath = `/tmp/snapshot_${Date.now()}.png`;
    fs.writeFileSync(filePath, base64Data, 'base64');

    console.log('✅ Image saved to:', filePath);

    // For now, just confirm receipt (later we can email or push it somewhere)
    res.status(200).send('✅ Image received & saved temporarily');
  } catch (err) {
    console.error('❌ Error:', err);
    res.status(500).send('❌ Server error saving image');
  }
}
