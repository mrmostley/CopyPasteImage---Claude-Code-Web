# Product Requirements Document (PRD)
**Claude Web Code Image Paste Extension v1.0**

## 1. Product Overview
Lightweight browser extension that intercepts paste events on claude.ai/code and converts images to a format Claude can process in the terminal-based coding interface.

**Status:** Pre-Development  
**Target Launch:** Nov 21, 2025  
**Development Method:** AI-Assisted (Claude Sonnet 4.5)

---

## 2. Technical Architecture

### 2.1 Extension Structure
```
claude-code-image-paste/
├── manifest.json          # Extension configuration (Manifest V3)
├── content.js            # Main logic: paste detection + injection
├── icons/
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md
```

**Framework Choice:** **Vanilla JavaScript** (No WXT/Plasmo)
- **Rationale:** Zero build step, maximum compatibility, instant deployment
- Only 2-3 files needed for this simple use case
- No npm dependencies = No programming setup required

### 2.2 Core Components

#### A. Manifest V3 Configuration
```json
{
  "manifest_version": 3,
  "name": "Claude Code Image Paste",
  "version": "1.0",
  "permissions": ["clipboardRead"],
  "host_permissions": ["https://claude.ai/*"],
  "content_scripts": [{
    "matches": ["https://claude.ai/code/*"],
    "js": ["content.js"]
  }]
}
```

#### B. Content Script Logic
1. **Paste Event Detection**
   - Listen for `paste` event on document
   - Check if `event.clipboardData.files` contains image
   
2. **Image Processing**
   - Read File as Data URL (base64)
   - Optional: Compress if >1MB
   
3. **Claude Code Injection**
   - Find Claude Code input field (textarea/contenteditable)
   - Inject markdown image syntax: `![pasted-image](data:image/png;base64,...)`
   - OR: Create system message with image attachment

---

## 3. Feature Specifications

### 3.1 Image Paste Flow
```
User Action → Paste (Ctrl+V)
     ↓
Extension detects image in clipboard
     ↓
Convert to base64
     ↓
Inject into Claude Code chat input
     ↓
User sees "[Image Pasted]" confirmation
     ↓
Claude processes image in next message
```

### 3.2 Supported Image Formats
- PNG ✅
- JPEG ✅
- WebP ✅
- GIF ✅ (static)
- SVG ⚠️ (if under 500KB)

### 3.3 Size Limits
- **Max file size:** 4MB (to fit Claude's context)
- **Auto-compression:** If >1MB, resize to 1024px width
- **Fallback:** Show error if image too large

---

## 4. Implementation Plan

### Phase 1: MVP (Nov 20-21)
**Goal:** Working paste detection + base64 conversion

**Tasks:**
1. ✅ Create manifest.json with minimum permissions
2. ✅ Write content.js paste event listener
3. ✅ Implement base64 conversion
4. ✅ Test on claude.ai/code
5. ✅ Add visual feedback (toast notification)

**Deliverable:** Chrome extension that detects paste

### Phase 2: Injection Logic (Nov 21)
**Goal:** Actually send image to Claude

**Tasks:**
1. 🔍 Inspect claude.ai/code DOM structure
2. 🔍 Find input field/message API
3. 🔍 Test injection methods:
   - Option A: Insert markdown in input
   - Option B: Simulate file upload
   - Option C: Inject into chat history DOM
4. ✅ Implement most reliable method
5. ✅ Handle edge cases (empty chat, mid-session)

**Deliverable:** Image appears in Claude Code context

### Phase 3: Polish (Nov 21 EOD)
**Tasks:**
1. ✅ Add icons (simple PNG)
2. ✅ Write clear README with install instructions
3. ✅ Test on Firefox/Edge
4. ✅ Create GitHub repo
5. ✅ Add MIT license

**Deliverable:** Publishable open-source extension

---

## 5. Technical Specifications

### 5.1 Code Snippet: Paste Detection
```javascript
// content.js
document.addEventListener('paste', async (e) => {
  const items = e.clipboardData?.items;
  if (!items) return;
  
  for (let item of items) {
    if (item.type.startsWith('image/')) {
      e.preventDefault();
      const file = item.getAsFile();
      const base64 = await fileToBase64(file);
      injectImageToClaudeCode(base64);
      showNotification('Image pasted!');
      break;
    }
  }
});

function fileToBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });
}
```

### 5.2 DOM Injection Strategy
**Challenge:** claude.ai/code is likely a React/complex app

**Approaches (in order of preference):**
1. **Find input element** → `document.querySelector('[contenteditable]')`
2. **Trigger React events** → Dispatch `input` event after modification
3. **Mutation Observer** → Wait for input to appear, then attach handler
4. **Direct DOM manipulation** → Insert image preview in chat area

**Selected Method:** Will be determined during Phase 2 testing

### 5.3 Cross-Browser Compatibility
| Feature | Chrome | Firefox | Edge | Safari |
|---------|--------|---------|------|--------|
| ClipboardAPI | ✅ | ✅ | ✅ | ⚠️ |
| Content Scripts | ✅ | ✅ | ✅ | ✅ |
| Manifest V3 | ✅ | ✅ | ✅ | ⚠️ |

**Safari Note:** May require Safari-specific conversion (Phase 4)

---

## 6. User Experience

### 6.1 Installation
```
1. Download/clone from GitHub
2. Chrome → Extensions → Enable Developer Mode
3. Load Unpacked → Select folder
4. Navigate to claude.ai/code
5. Paste image (Ctrl+V)
```

### 6.2 Usage
```
User has error screenshot on clipboard
     ↓
Go to claude.ai/code
     ↓
Start coding session
     ↓
Press Ctrl+V (or Cmd+V on Mac)
     ↓
See "Image pasted" notification
     ↓
Type prompt: "What's wrong with this error?"
     ↓
Claude analyzes image
```

### 6.3 Visual Feedback
- **Toast notification:** "✓ Image pasted successfully"
- **Error states:** "✗ Image too large" / "✗ Unsupported format"
- **Subtle highlight** on input area (optional)

---

## 7. Testing Plan

### 7.1 Manual Test Cases
| Test Case | Expected Result |
|-----------|----------------|
| Paste PNG screenshot | Image appears in chat |
| Paste JPEG photo | Image appears in chat |
| Paste >5MB image | Error shown |
| Paste non-image | No action |
| Paste on non-claude.ai site | No action |
| Multi-paste | Each image handled separately |

### 7.2 Browser Testing
- Chrome 120+ ✅
- Firefox 120+ ✅
- Edge 120+ ✅
- Brave ✅ (Chromium-based)

---

## 8. Distribution Strategy

### 8.1 Open Source Release
- **Repo:** github.com/[username]/claude-code-image-paste
- **License:** MIT (maximum permissiveness)
- **README must include:**
  - Installation instructions
  - Usage demo (GIF/video)
  - Known limitations
  - Contributing guidelines
  - Disclaimer: "Unofficial, not affiliated with Anthropic"

### 8.2 Community Sharing
- Post on Reddit r/ClaudeAI
- Share on Hacker News (Show HN)
- Tweet @AnthropicAI (tag community)
- Add to awesome-claude list

### 8.3 Chrome Web Store (Future)
**Phase 4 (Optional):** Submit for public distribution
- Requires $5 developer fee ❌ (violates $0 constraint)
- **Alternative:** Keep as sideload-only

---

## 9. Known Limitations

### 9.1 Technical
- **Mobile browsers:** No extension support (Chrome/Firefox mobile)
  - **Workaround:** Document as desktop-only
- **Claude's image limit:** ~4MB context window
  - **Mitigation:** Auto-compress large images
- **DOM changes:** If Anthropic updates claude.ai/code UI
  - **Mitigation:** Version selectors, community maintenance

### 9.2 User Experience
- No drag-and-drop (Phase 1) - only paste
- Single image per paste
- No image preview before sending
- Can't edit/crop image

---

## 10. Success Metrics

### 10.1 Launch Criteria (Go/No-Go)
✅ Extension loads on claude.ai/code  
✅ Paste event detected  
✅ Image converted to base64  
✅ Image injected into Claude context  
✅ Claude can see and analyze image  
✅ Works on Chrome/Edge  
✅ No console errors  

### 10.2 Post-Launch Monitoring
- GitHub stars/forks
- Bug reports in Issues
- Community feedback (Reddit/HN)
- Successful use cases shared

---

## 11. Dependencies & Resources

### 11.1 Required Libraries
**NONE** - Pure vanilla JavaScript

### 11.2 Development Tools
- **Text editor:** Any (VSCode, Sublime, etc.)
- **Browser:** Chrome with DevTools
- **AI Assistant:** Claude (for code generation)
- **Version control:** Git + GitHub

### 11.3 References
- [Chrome Extension Manifest V3 Docs](https://developer.chrome.com/docs/extensions/mv3/)
- [MDN Clipboard API](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API)
- [claude.ai/code Documentation](https://docs.claude.com/claude-code)

---

## 12. Future Enhancements (Out of Scope for MVP)

### Phase 4+ Ideas
- ⭐ Drag-and-drop support
- ⭐ Image annotation before paste
- ⭐ Multiple image uploads
- ⭐ OCR text extraction
- ⭐ Image optimization settings
- ⭐ Safari support
- ⭐ Mobile app (if technically possible)

---

## 13. Risks & Contingencies

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| Can't find input field | Medium | High | Multiple selector strategies |
| CSP blocks base64 | Low | High | Use blob URLs instead |
| Claude ignores injected image | Medium | Critical | Test different injection methods |
| Anthropic blocks extension | Low | Critical | Add disclaimer, keep respectful |
| Too complex for 2-day timeline | Medium | High | Reduce scope to paste-only |

**Contingency Plan:** If injection fails, pivot to "clipboard assistant" that just shows image preview + copy-pasteable markdown

---

## 14. Approval & Sign-off

**Product Manager:** Rahul  
**Technical Lead:** Claude Sonnet 4.5  
**Timeline:** Nov 20-21, 2025  
**Budget:** $0  
**Risk Level:** Low-Medium  

**Status:** ✅ APPROVED - Proceed to Development

---

## Appendix A: Quick Start Checklist

```
□ Create project folder
□ Write manifest.json
□ Write content.js with paste handler
□ Test locally on claude.ai/code
□ Add compression logic
□ Test injection into Claude
□ Create README
□ Create icons
□ Test on Firefox/Edge
□ Push to GitHub
□ Share with community
```

**Estimated Time:** 6-8 hours (with Claude's help)  
**Complexity:** Low-Medium  
**Confidence Level:** 85%
