# Quick Installation Guide

## Firefox Installation (2 minutes)

### Step 1: Download
```bash
git clone https://github.com/mrmostley/ClaudeWebCode_CopyPaste.git
cd ClaudeWebCode_CopyPaste
```

### Step 2: Load in Firefox

1. Open Firefox
2. Type in address bar: `about:debugging#/runtime/this-firefox`
3. Click **"Load Temporary Add-on"**
4. Navigate to the extension folder
5. Select `manifest.json`
6. Done! Extension is now active

### Step 3: Test

1. Go to https://claude.ai/code
2. Copy any image (screenshot, photo, etc.)
3. Press **Ctrl+V** (or Cmd+V on Mac)
4. You should see "✓ Image pasted!" notification

## Troubleshooting

**Extension not appearing?**
- Make sure you selected the correct manifest.json file
- Check Firefox version (requires 120+)
- Try reloading: Remove and add again

**Image not pasting?**
- Click into the chat input first
- Check browser console (F12) for errors
- Make sure image is < 5MB

**Need help?**
- See full README.md for detailed docs
- Report issues on GitHub

---

**That's it! Happy coding with Claude!** 🚀
