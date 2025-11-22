# Claude Code Web Image Paste Extension

**Lightweight Firefox extension for pasting images into Claude Web Code**

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Firefox](https://img.shields.io/badge/Firefox-120%2B-orange.svg)

---

## Overview

This browser extension enables seamless image pasting into [Claude Code Web](https://claude.ai/code) - Anthropic's terminal-based coding interface. Simply copy an image (screenshot, error message, diagram) and paste it directly into your coding session.

### Key Features

- **One-Click Paste**: Ctrl+V (Cmd+V on Mac) to paste images
- **Smart Compression**: 4-tier automatic compression (500KB → 5MB)
- **Multi-Format Support**: PNG, JPEG, WebP, AVIF, HEIC, GIF, BMP
- **Mobile & Desktop**: Optimized for both form factors
- **Zero Config**: Works instantly after installation
- **Privacy-First**: All processing happens locally in your browser

---

## Installation

### Firefox (Recommended)

#### Method 1: Load Unpacked (Developer Mode)

1. **Download** this repository:
   ```bash
   git clone https://github.com/mrmostley/claude-code-image-paste.git
   cd claude-code-image-paste
   ```

2. **Open Firefox** and navigate to:
   ```
   about:debugging#/runtime/this-firefox
   ```

3. Click **"Load Temporary Add-on"**

4. Navigate to the extension folder and select **`manifest.json`**

5. The extension is now active! Visit [claude.ai/code](https://claude.ai/code) to test

#### Method 2: Install from .xpi (Permanent)

_Coming soon - awaiting Firefox Add-ons approval_

---

## Usage

### Basic Workflow

```
1. Take a screenshot or copy an image (Ctrl+C / Cmd+C)
2. Navigate to claude.ai/code
3. Start or continue a coding session
4. Press Ctrl+V (or Cmd+V) in the chat input
5. See "✓ Image pasted!" notification
6. Type your prompt and send
7. Claude analyzes your image
```

### Example Use Cases

**Debug Error Screenshots**
```
User: [Pastes error screenshot]
      "What's causing this TypeError?"
Claude: Analyzes the stack trace and suggests fixes
```

**Code Review**
```
User: [Pastes code snippet image]
      "How can I optimize this function?"
Claude: Reviews code and provides suggestions
```

**UI/UX Feedback**
```
User: [Pastes design mockup]
      "Implement this button component"
Claude: Generates matching HTML/CSS/JS
```

---

## Features in Detail

### Image Compression

The extension automatically optimizes images based on size:

| Original Size | Compression | Max Width | Quality |
|---------------|-------------|-----------|---------|
| < 500 KB      | None        | Original  | 100%    |
| 500 KB - 1 MB | Light       | 2560px    | 85%     |
| 1 MB - 2 MB   | Moderate    | 1920px    | 75%     |
| 2 MB - 5 MB   | Aggressive  | 1280px    | 60%     |
| > 5 MB        | ❌ Error    | N/A       | N/A     |

### Supported Formats

✅ PNG (Portable Network Graphics)
✅ JPEG/JPG (Joint Photographic Experts Group)
✅ WebP (Modern web format)
✅ AVIF (Next-gen format)
✅ HEIC (iPhone photos)
✅ GIF (static images)
✅ BMP (Bitmap)

### Visual Feedback

The extension provides clear toast notifications:

- **Processing**: "⏳ Processing image..."
- **Success**: "✓ Image pasted! 📊 Size: 1.2 MB"
- **Compressed**: "✓ Image pasted! 📊 Compressed: 3.4 MB → 1.1 MB (68% smaller)"
- **Error**: "✗ Image too large (6.3MB). Maximum: 5MB"

---

## Technical Details

### Architecture

```
manifest.json     → Extension configuration (Manifest V3)
content.js        → Main logic (paste detection, compression, injection)
icons/            → Extension icons (16px, 48px, 128px)
```

### Permissions Required

- `clipboardRead` - Detect pasted images
- `https://claude.ai/*` - Inject into Claude Code Web pages

### Browser Compatibility

| Browser | Status | Notes |
|---------|--------|-------|
| Firefox 120+ | ✅ Fully supported | Recommended |
| Firefox Mobile | ✅ Works | Requires clipboard access |
| Chrome/Edge | ⚠️ Untested | Should work (Manifest V3) |
| Safari | ❌ Not supported | Different extension format |

### Performance

- **Load Time**: < 50ms
- **Paste Detection**: < 10ms
- **Compression**: 200ms - 2s (depending on size)
- **Injection**: < 50ms
- **Total**: Usually < 1 second

---

## Troubleshooting

### Image Not Appearing

**Problem**: Pasted image doesn't show in chat

**Solutions**:
1. Check browser console for errors (F12 → Console)
2. Verify extension is active: `about:debugging`
3. Reload claude.ai/code page
4. Try pasting into different input field
5. Check if image format is supported

### "Input Not Found" Error

**Problem**: Extension can't find input field

**Solutions**:
1. Wait for page to fully load
2. Click into the chat input before pasting
3. Try refreshing the page
4. Check if Claude Code Web UI has been updated (report issue)

### Image Too Large Error

**Problem**: "Image too large (X MB). Maximum: 5MB"

**Solutions**:
1. Resize image before copying
2. Use lower quality screenshot tool
3. Crop unnecessary parts
4. Convert to more efficient format (WebP/AVIF)

### Compression Taking Too Long

**Problem**: "Processing image..." for > 10 seconds

**Solutions**:
1. Check image size (likely > 3MB)
2. Reduce image resolution before pasting
3. Close other heavy tabs
4. Wait for compression to finish (max 10s)

### Extension Not Loading

**Problem**: Extension doesn't appear in Firefox

**Solutions**:
1. Verify manifest.json is valid JSON
2. Check Firefox version (requires 120+)
3. Try reinstalling: remove → add again
4. Check Firefox console for errors

---

## Development

### Building from Source

```bash
# Clone repository
git clone https://github.com/[your-username]/claude-code-image-paste.git
cd claude-code-image-paste

# No build step required - pure vanilla JavaScript!
# Just load in Firefox as described in Installation
```

### Project Structure

```
claude-code-image-paste/
├── manifest.json          # Extension config
├── content.js            # Main logic (600+ lines)
├── icons/
│   ├── icon16.png       # Toolbar icon
│   ├── icon48.png       # Extension manager icon
│   └── icon128.png      # Firefox Add-ons icon
├── README.md            # This file
├── LICENSE              # MIT License
└── docs/                # Additional documentation
    ├── PRD.md
    ├── QUICK_START.md
    └── TECH_STACK_VALIDATION.md
```

### Testing Locally

1. Open Firefox Developer Tools (F12)
2. Navigate to claude.ai/code
3. Paste test image
4. Check console for logs:
   ```
   [Claude Paste] Extension initialized
   [Claude Paste] Paste event detected
   [Claude Paste] Image detected: image/png 1234567
   [Claude Paste] Image injected via contentEditable
   ```

### Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open Pull Request

---

## Known Limitations

### Current Version (1.0.0)

- **Single image only** - Multiple images require multiple pastes
- **No image preview** - Image sent immediately
- **No drag-and-drop** - Paste-only (Ctrl+V)
- **No editing** - Can't crop/annotate before sending
- **Desktop-focused** - Mobile support experimental

### Platform Limitations

- **Mobile browsers**: Limited clipboard API support
- **Chrome/Edge**: Untested (should work)
- **Safari**: Not supported (needs separate implementation)

---

## Roadmap

### Phase 2 (Future)
- [ ] Drag-and-drop support
- [ ] Image preview before sending
- [ ] Multi-image paste
- [ ] Image annotation tools
- [ ] Chrome Web Store release

### Phase 3 (Wishlist)
- [ ] OCR text extraction
- [ ] Image optimization settings
- [ ] Keyboard shortcuts configuration
- [ ] Safari support
- [ ] Mobile app (if feasible)

---

## FAQ

**Q: Is this official Anthropic software?**
A: No, this is an unofficial community project. Not affiliated with Anthropic.

**Q: Does it work on mobile?**
A: Partially. Firefox Mobile has limited clipboard support. Best used on desktop.

**Q: Can I use it on Chrome?**
A: Theoretically yes (Manifest V3), but untested. Firefox is recommended.

**Q: Does it send data to external servers?**
A: No. All processing happens locally in your browser. No external requests.

**Q: Will this break if Anthropic updates Claude Code Web?**
A: Possibly. The extension uses DOM selectors that may change. Report issues on GitHub.

**Q: Can I paste multiple images at once?**
A: Not in v1.0. Paste images one at a time.

**Q: What happens to my pasted images?**
A: They're converted to base64 and sent directly to Claude Code Web. No storage/logging.

---

## Support

### Get Help

- **Bug Reports**: [GitHub Issues](https://github.com/mrmostley/claude-code-image-paste/issues)
- **Feature Requests**: [GitHub Discussions](https://github.com/mrmostley/claude-code-image-paste/discussions)
- **Community**: Reddit [r/ClaudeAI](https://reddit.com/r/ClaudeAI)

### Debugging

Enable debug logging in Firefox console:
1. Press F12
2. Go to Console tab
3. Filter by `[Claude Paste]`
4. Reproduce issue
5. Copy console logs to issue report

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

**TL;DR**: Free to use, modify, distribute. No warranty provided.

---

## Acknowledgments

- **Anthropic** - For Claude and Claude Code Web
- **Open Source Community** - For browser extension best practices


---

## Changelog

### v1.0.0 (2025-11-20)
- Initial release
- Image paste detection
- 4-tier compression system
- Multi-format support (PNG, JPEG, WebP, AVIF, HEIC, GIF, BMP)
- Toast notifications
- Firefox Manifest V3
- Mobile & desktop compatibility

---

## Links

- **Repository**: https://github.com/mrmostley/claude-code-image-paste
- **Issues**: https://github.com/mrmostley/claude-code-image-paste/issues
- **Claude Code**: https://claude.ai/code
- **Anthropic**: https://anthropic.com

---

**Made with Claude Code Web x @mrmostley**

*If you find this useful, consider starring the repo and sharing with others!*
