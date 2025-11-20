# Extension Publishing Requirements

This document outlines all requirements for publishing the Claude Code Image Paste extension to both Chrome Web Store and Firefox Add-ons (AMO).

---

## Chrome Web Store Publishing

### Prerequisites

**Developer Account:**
- Register as Chrome Web Store developer at https://chrome.google.com/webstore/devconsole
- One-time registration fee: **$5 USD**
- Email address required and must be verified
- Cannot publish items if email field is blank

### Technical Requirements

**Extension Package:**
- Maximum file size: **2 GB**
- File format: ZIP file containing manifest.json and all extension files
- Maximum published extensions: **20** (can request limit increase)
- Manifest version: **Must use Manifest V3**

**Required Assets:**

1. **Icon (Required):**
   - 128x128 pixel PNG logo
   - ✅ Already included in `/chrome/icons/icon128.png`

2. **Screenshots (Required):**
   - At least 1 screenshot required
   - Recommended: 3-5 screenshots showing key features
   - Dimensions: 1280x800 or 640x400 pixels
   - Format: PNG or JPEG

3. **Promotional Images (Optional but Recommended):**
   - Small tile: 440x280 pixels
   - Large tile: 920x680 pixels
   - Marquee: 1400x560 pixels

**Metadata:**
- Extension name (max 45 characters)
- Short description (max 132 characters)
- Detailed description (no length limit)
- Category selection
- Language(s) supported
- Privacy policy URL (if collecting user data)

### Distribution Options

1. **Public** - Everyone can see and install
2. **Unlisted** - Only users with direct link can install
3. **Private** - Only users in your domain can install

### Review Process

- **Review time:** Most extensions reviewed within **3 days**
- **Manual review:** All extensions require review by Chrome Web Store team
- **Privacy details:** May need to fill out privacy questionnaire
- **Permission justifications:** Must justify all requested permissions

### Current Status for This Extension

✅ **Ready to submit:**
- Manifest V3 compliant
- Has all required files
- Icons present
- Under 2 GB size limit

⚠️ **Before submitting:**
- Create screenshots demonstrating functionality
- Prepare detailed description
- Create promotional images (optional)
- Set up privacy policy (minimal data collection)

---

## Firefox Add-ons (AMO) Publishing

### Prerequisites

**Developer Account:**
- Register at https://addons.mozilla.org/developers/
- **FREE** (no registration fee)
- Email address required and must be verified
- Mozilla account required

### Technical Requirements

**Extension Package:**
- Maximum file size: **200 MB**
- File format: ZIP, XPI, or CRX
- ✅ Already have: `firefox/claude-code-image-paste.xpi` (6.7 KB)

**Manifest Requirements:**
- Must include `browser_specific_settings.gecko.id`
- ✅ Already set: `"claude-code-image-paste@mozilla-extension"`
- Minimum Firefox version specified
- ✅ Already set: `"strict_min_version": "120.0"`

**Required Metadata:**

1. **Icons (Required):**
   - 48x48 and 128x128 pixels
   - ✅ Already included in `/firefox/icons/`

2. **Screenshots (Optional but Recommended):**
   - Show key features
   - PNG or JPEG format

3. **Description:**
   - Summary (max 250 characters)
   - Full description (no length limit)
   - Support for multiple languages

4. **Categories:**
   - Select primary category
   - Optional secondary category

### Source Code Submission

**When Required:**
- If using minification or obfuscation
- If using compiled code
- If code is not easily readable

**Our Extension:**
- ✅ No minification - `content.js` is readable
- ✅ No obfuscation
- ✅ No compiled code
- **Source code submission: NOT REQUIRED**

### Important Policy Updates (Effective August 2025)

**Recent Changes:**
- ✅ Closed group extensions now allowed
- ✅ Privacy policies can be self-hosted (no longer required on AMO)
- ⚠️ All dependencies must be in source code or downloaded via official package managers
- ⚠️ userScripts API only allowed for user script managers (we don't use this)

### Privacy & Data Collection

**Requirements:**
- Must disclose all data collection
- Require explicit user consent for personal data
- Privacy policy recommended (link to self-hosted)

**Our Extension:**
- ✅ No data collection
- ✅ No analytics
- ✅ No external network requests
- ✅ Only accesses clipboard on user action (Ctrl+V)
- **Privacy policy: Optional but recommended**

### Signing & Review Process

**Automatic Signing:**
- All extensions must be signed by Mozilla
- Signing happens automatically after upload
- Can take up to **24 hours** (usually faster)

**Manual Review:**
- Random selection for manual code review
- All add-ons subject to review at any time
- Review criteria: https://extensionworkshop.com/documentation/publish/add-on-policies/

### Distribution Options

1. **On AMO (Recommended)**
   - Listed publicly
   - Discoverable in search
   - Gets automatic updates

2. **Self-Distribution**
   - Sign only (don't publish on AMO)
   - Distribute .xpi yourself
   - Still requires Mozilla signing

3. **Closed Group (New in 2025)**
   - Restricted access
   - Internal or private user groups
   - Published via AMO but not public

### Current Status for This Extension

✅ **Ready to submit:**
- Manifest includes `browser_specific_settings.gecko.id`
- XPI file already built
- Under 200 MB size limit
- No obfuscation/minification
- Icons present
- No data collection

⚠️ **Before submitting:**
- Create screenshots demonstrating functionality
- Prepare detailed description
- Consider adding privacy policy link (optional)
- Test in Firefox Desktop and Mobile

---

## Submission Checklist

### Both Platforms

- [ ] Create developer account
  - [ ] Chrome Web Store ($5 fee)
  - [ ] Firefox Add-ons (free)
- [ ] Create screenshots (3-5 recommended)
- [ ] Write detailed description
- [ ] Write short description/summary
- [ ] Choose categories
- [ ] Set version number (currently 1.0.0)
- [ ] Add support email/URL
- [ ] Create privacy policy (optional but recommended)

### Chrome-Specific

- [ ] Pay $5 registration fee
- [ ] Create promotional images (optional)
- [ ] Fill out privacy questionnaire
- [ ] Justify permissions:
  - `clipboardRead` - for pasting images
  - `https://claude.ai/*` - where extension works

### Firefox-Specific

- [ ] Verify `browser_specific_settings.gecko.id` is set
- [ ] Test .xpi file loads correctly
- [ ] Verify minimum Firefox version requirement
- [ ] No source code submission needed (code is readable)

---

## Testing Before Publishing

### Chrome Testing

```bash
1. Open chrome://extensions/
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the chrome/ folder
5. Test at https://claude.ai/code
```

### Firefox Testing

**Option 1: Temporary Add-on**
```bash
1. Open about:debugging#/runtime/this-firefox
2. Click "Load Temporary Add-on..."
3. Select firefox/manifest.json
4. Test at https://claude.ai/code
```

**Option 2: Install XPI**
```bash
1. Open about:addons
2. Click gear icon ⚙️ → "Install Add-on From File..."
3. Select firefox/claude-code-image-paste.xpi
4. Test at https://claude.ai/code
```

---

## Publishing URLs

**Chrome Web Store:**
- Developer Console: https://chrome.google.com/webstore/devconsole
- Documentation: https://developer.chrome.com/docs/webstore/publish

**Firefox Add-ons:**
- Developer Hub: https://addons.mozilla.org/developers/
- Submit Add-on: https://addons.mozilla.org/developers/addon/submit/
- Documentation: https://extensionworkshop.com/documentation/publish/

---

## Post-Publishing

### Updates

**Chrome:**
- Upload new version to same listing
- Review required for each update
- Users get automatic updates

**Firefox:**
- Upload new version to AMO
- Automatic signing (up to 24 hours)
- Users get automatic updates

### Monitoring

**Chrome:**
- View download statistics
- Read user reviews
- Monitor crash reports

**Firefox:**
- View download statistics
- Read user reviews and ratings
- Monitor update adoption

---

## Estimated Timeline

### Chrome Web Store

- Developer account setup: **15 minutes**
- Extension preparation: **1-2 hours** (screenshots, descriptions)
- Initial submission: **15 minutes**
- Review time: **1-3 days**
- **Total: 1-3 days from submission**

### Firefox Add-ons

- Developer account setup: **15 minutes**
- Extension preparation: **1-2 hours** (screenshots, descriptions)
- Initial submission: **15 minutes**
- Signing time: **Minutes to 24 hours**
- Manual review (if selected): **Varies**
- **Total: Hours to 1 day from submission**

---

## Cost Summary

| Platform | Registration Fee | Annual Fee | Total First Year |
|----------|------------------|------------|------------------|
| Chrome Web Store | $5 USD (one-time) | $0 | $5 |
| Firefox Add-ons | $0 | $0 | $0 |
| **Combined** | **$5** | **$0** | **$5** |

---

## Next Steps

1. **Create Screenshots:**
   - Show paste action at claude.ai/code
   - Show success notification
   - Show image in chat
   - 3-5 screenshots recommended

2. **Write Descriptions:**
   - Use existing README.md as basis
   - Adapt for each platform's character limits
   - Highlight key features

3. **Register Accounts:**
   - Chrome Web Store (pay $5)
   - Firefox Add-ons (free)

4. **Test Thoroughly:**
   - Both Chrome and Firefox
   - Multiple image formats
   - Various image sizes

5. **Submit:**
   - Chrome first (longer review time)
   - Firefox second (faster signing)

6. **Monitor:**
   - Check for review comments
   - Respond to user feedback
   - Plan for updates

---

## Questions or Issues?

- **Chrome Web Store Support:** https://support.google.com/chrome_webstore/
- **Firefox Add-ons Support:** https://discourse.mozilla.org/c/add-ons/35
- **This Extension Issues:** https://github.com/mrmostley/ClaudeWebCode_CopyPaste/issues
