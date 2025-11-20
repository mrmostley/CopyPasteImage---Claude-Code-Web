# 🚀 Quick Start: Building with Claude Code
**Claude Web Code Image Paste Extension**

## Choose Your Development Environment

### Option A: Claude Web Code (Browser-Based) ⭐ RECOMMENDED
**Pros:** No setup, works immediately, mobile-accessible  
**Cons:** Need to download files manually

### Option B: Claude Code in VS Code
**Pros:** Local files, Git integration, familiar IDE  
**Cons:** Requires VS Code + Claude Code extension setup

---

## Setup Instructions

### For Claude Web Code:

1. **Go to:** https://claude.ai/code
2. **Connect GitHub repo** (or skip for local dev)
3. **Copy/paste this prompt:**

```
I'm building a Firefox browser extension for mobile + desktop that enables image pasting in claude.ai/code.

Project structure:
/claude-code-image-paste/
  ├── manifest.json
  ├── content.js
  ├── icons/
  │   ├── icon16.png
  │   ├── icon48.png
  │   └── icon128.png
  └── README.md

Requirements from PRD.md:
- Firefox Manifest V3 (Android + Desktop compatible)
- ClipboardAPI for paste detection
- Image compression using browser-image-compression CDN
- Mobile-optimized toast notifications
- Support: PNG, JPEG, WebP, AVIF, HEIC

Start by creating manifest.json following the spec in PRD.md section 2.2.
```

4. **Upload these documents:**
   - PRD.md
   - BRD.md
   - ENHANCEMENTS.md

5. **Claude will generate files** → Download from outputs

---

### For Claude Code in VS Code:

1. **Install VS Code** + **Claude Code extension**
2. **Create project folder:**
   ```bash
   mkdir claude-code-image-paste
   cd claude-code-image-paste
   ```

3. **Start Claude Code:**
   ```bash
   code .  # Opens VS Code
   # Then open Claude Code panel
   ```

4. **Upload context documents** and use same prompt as above

5. **Files will be created in your workspace** automatically

---

## Development Workflow

### Step 1: Generate Core Files
**Prompt Claude:**
```
Create manifest.json and content.js following the mobile-first architecture in PRD.md.

Key requirements:
- Firefox MV3 format
- browser_specific_settings for Android
- ClipboardAPI paste detection
- Mobile-friendly event handlers
- Inject into claude.ai/code DOM
```

### Step 2: Add Compression
**Prompt Claude:**
```
Add image compression using browser-image-compression from CDN.
Follow the 4-tier compression strategy from PRD.md section 3.3.
```

### Step 3: Toast Notifications
**Prompt Claude:**
```
Implement mobile-optimized toast system from PRD.md section 3.4.
Include success, error, warning, and progress toasts.
```

### Step 4: Test Locally

**Load Extension in Firefox:**
1. Open Firefox
2. Go to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select `manifest.json`
5. Navigate to `claude.ai/code`
6. Test paste!

**Test on Firefox Android:**
1. Enable USB debugging on phone
2. Connect phone to computer
3. Firefox Desktop → `about:debugging` → "Enable USB Devices"
4. Select your phone → Load extension
5. Open Firefox Android → test paste

---

## File Generation Prompts

### Manifest.json
```
Create manifest.json for Firefox with:
- manifest_version: 3
- browser_specific_settings.gecko
- permissions: clipboardRead
- host_permissions: https://claude.ai/*
- content_scripts for claude.ai/code/*
- icons: 16, 48, 128
```

### Content.js (Core Logic)
```
Create content.js with:
1. Paste event listener (works on mobile)
2. Image format detection (PNG, JPEG, WebP, AVIF, HEIC)
3. Compression using browser-image-compression CDN
4. Toast notification system
5. DOM injection into claude.ai/code input
6. Error handling for all edge cases
```

### README.md
```
Create README.md with:
- Project description (mobile-first!)
- Installation instructions (Firefox Desktop + Android)
- Usage guide with screenshots
- Supported formats
- Troubleshooting
- Contributing guidelines
- MIT License
```

### Icons (Simple Placeholders)
```
Create simple 16x16, 48x48, 128x128 PNG icons:
- Clipboard with image symbol
- Claude's teal/orange colors
- High contrast for mobile visibility
```

---

## Testing Checklist

### Desktop (Firefox)
- [ ] Extension loads without errors
- [ ] Paste PNG screenshot
- [ ] Paste JPEG photo
- [ ] Paste from clipboard (Ctrl+V)
- [ ] Toast notifications appear
- [ ] Image appears in Claude Code
- [ ] Compression works for large files
- [ ] Error handling for bad formats

### Mobile (Firefox Android)
- [ ] Extension loads via USB debugging
- [ ] Paste from mobile keyboard
- [ ] Screenshot paste works
- [ ] Toast appears at bottom (mobile position)
- [ ] Touch-friendly notifications
- [ ] Works with Gboard/SwiftKey
- [ ] Performance is smooth (<100ms)

---

## Common Issues & Solutions

### "ClipboardAPI not available"
**Solution:** Must be on HTTPS (claude.ai is ✅)

### "Extension not loading"
**Solution:** Check manifest.json syntax with JSON validator

### "Paste not detected"
**Solution:** Check content script is injecting (inspect page → check console)

### "Image not compressing"
**Solution:** Verify CDN loads: check Network tab for browser-image-compression.js

### "Toast not showing on mobile"
**Solution:** Check z-index (must be 999999), position (bottom on mobile)

---

## Quick Debug Commands

**Check if extension loaded:**
```javascript
// In claude.ai/code console:
console.log('Extension active:', window.hasOwnProperty('claudeImagePaste'));
```

**Test clipboard manually:**
```javascript
navigator.clipboard.read().then(items => {
  console.log('Clipboard items:', items);
});
```

**Check DOM injection:**
```javascript
document.querySelector('[contenteditable]'); // Should find input
```

---

## Iteration Workflow

**With Claude Web Code:**
1. Ask Claude to generate/update file
2. Download from outputs
3. Replace in local extension folder
4. Reload extension in Firefox
5. Test
6. Report issues back to Claude
7. Repeat

**With Claude Code in VS Code:**
1. Ask Claude to update file
2. File updates automatically in workspace
3. Reload extension in Firefox
4. Test
5. Continue conversation with Claude
6. Iterate rapidly

---

## Publishing to AMO (Firefox Add-ons)

### Step 1: Create Account
- Go to https://addons.mozilla.org
- Sign up with Firefox Account

### Step 2: Package Extension
```bash
cd claude-code-image-paste
zip -r extension.zip manifest.json content.js icons/
```

### Step 3: Submit
1. AMO → Developer Hub → Submit New Add-on
2. Upload `extension.zip`
3. Fill in details:
   - Name: "Claude Code Image Paste"
   - Summary: "Paste images into Claude Web Code on mobile & desktop"
   - Categories: Developer Tools, Productivity
   - Tags: clipboard, image, mobile, claude, ai
4. **Important:** Check "Works on Firefox for Android"
5. Submit for review

### Step 4: Review Process
- Automated: ~10 minutes
- Manual review: 1-3 days
- Check for mobile compatibility
- Approve → Live!

---

## Next Steps After MVP

1. ✅ Get feedback from mobile users
2. 🔄 Add Chrome desktop support (separate manifest)
3. 🔄 Safari macOS support (if demand exists)
4. 🔄 Add drag-drop as fallback
5. 🔄 Improve compression settings based on usage
6. 🔄 Add image preview before paste
7. 🔄 Multiple image paste support

---

## Resources

**Documentation:**
- [Firefox Extension Workshop](https://extensionworkshop.com/)
- [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [browser-image-compression](https://github.com/Donaldcwl/browser-image-compression)

**Tools:**
- [web-ext](https://github.com/mozilla/web-ext) - CLI for testing
- [Firefox Nightly](https://www.mozilla.org/firefox/nightly/) - Latest APIs
- [Remote Debugging](https://firefox-source-docs.mozilla.org/devtools-user/about_colon_debugging/index.html) - Test on Android

**Community:**
- [Firefox Add-ons Discourse](https://discourse.mozilla.org/c/add-ons/35)
- [r/FirefoxAddons](https://reddit.com/r/FirefoxAddons)
- [Claude Developers Discord](https://discord.gg/claude)

---

## Success Metrics

**MVP Success = ✅ when:**
- Extension works on Firefox Android
- Mobile users can paste screenshots
- Desktop users get bonus functionality
- Published to AMO with 4+ stars
- 100+ downloads in first week

**Stretch Goals:**
- Featured on AMO
- Mentioned by @AnthropicAI
- 1000+ downloads
- Chrome version launched
- Community contributions

---

## You Got This! 🎯

Remember:
- Start simple (manifest + content.js)
- Test on mobile FIRST
- Iterate based on Claude's feedback
- Deploy early, get user feedback
- Mobile users will love you for this!

**When stuck:** Just ask Claude to debug. Share the error, Claude will fix it.

Good luck building! 🚀
