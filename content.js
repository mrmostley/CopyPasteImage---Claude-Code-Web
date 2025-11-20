/**
 * Claude Code Image Paste Extension
 * Mobile-First Image Paste Support for claude.ai/code
 * 
 * Features:
 * - Mobile & Desktop Firefox compatible
 * - ClipboardAPI image detection
 * - Multi-format support (PNG, JPEG, WebP, AVIF, HEIC)
 * - Smart compression (4-tier strategy)
 * - Mobile-optimized toast notifications
 */

// ============================================================================
// CONFIGURATION
// ============================================================================

const CONFIG = {
  MAX_SIZE_MB: 5,
  COMPRESSION_TIERS: {
    NONE: 500 * 1024,      // < 500KB: no compression
    LIGHT: 1024 * 1024,    // < 1MB: light (quality 0.85)
    MODERATE: 2 * 1024 * 1024,  // < 2MB: moderate (quality 0.75)
    AGGRESSIVE: 5 * 1024 * 1024 // < 5MB: aggressive (quality 0.6)
  },
  SUPPORTED_FORMATS: ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/heic', 'image/gif', 'image/bmp'],
  CDN_URL: 'https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.2/dist/browser-image-compression.js'
};

// ============================================================================
// TOAST NOTIFICATION SYSTEM
// ============================================================================

class ToastManager {
  constructor() {
    this.container = null;
    this.toasts = [];
    this.maxToasts = 3;
    this.init();
  }

  init() {
    // Create toast container
    this.container = document.createElement('div');
    this.container.id = 'claude-paste-toast-container';
    this.container.style.cssText = `
      position: fixed;
      z-index: 999999;
      pointer-events: none;
    `;
    
    // Mobile: bottom-center, Desktop: top-right
    if (this.isMobile()) {
      this.container.style.cssText += `
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 400px;
      `;
    } else {
      this.container.style.cssText += `
        top: 20px;
        right: 20px;
        min-width: 320px;
        max-width: 400px;
      `;
    }
    
    document.body.appendChild(this.container);
  }

  isMobile() {
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
  }

  show(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `claude-toast claude-toast-${type}`;
    toast.style.cssText = `
      background: white;
      padding: 16px 20px;
      margin-bottom: 10px;
      border-radius: 12px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      font-family: -apple-system, system-ui, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      pointer-events: auto;
      animation: slideIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      ${this.getBorderColor(type)}
    `;
    
    toast.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <span style="font-size: 20px;">${this.getIcon(type)}</span>
        <span style="flex: 1; ${this.getTextColor(type)}">${message}</span>
      </div>
    `;
    
    // Add close button for errors
    if (type === 'error') {
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '×';
      closeBtn.style.cssText = `
        position: absolute;
        top: 8px;
        right: 8px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #991b1b;
      `;
      closeBtn.onclick = () => this.remove(toast);
      toast.appendChild(closeBtn);
      duration = 5000; // Longer for errors
    }
    
    // Manage toast stack
    if (this.toasts.length >= this.maxToasts) {
      this.remove(this.toasts[0]);
    }
    
    this.container.appendChild(toast);
    this.toasts.push(toast);
    
    // Auto-remove
    if (duration > 0) {
      setTimeout(() => this.remove(toast), duration);
    }
    
    return toast;
  }

  remove(toast) {
    if (toast && toast.parentNode) {
      toast.style.animation = 'slideOut 0.3s ease-in';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
          this.toasts = this.toasts.filter(t => t !== toast);
        }
      }, 300);
    }
  }

  getBorderColor(type) {
    const colors = {
      success: '4px solid #10b981',
      error: '4px solid #ef4444',
      warning: '4px solid #f59e0b',
      info: '4px solid #3b82f6'
    };
    return `border-left: ${colors[type] || colors.info};`;
  }

  getTextColor(type) {
    const colors = {
      success: 'color: #065f46;',
      error: 'color: #991b1b;',
      warning: 'color: #92400e;',
      info: 'color: #1e40af;'
    };
    return colors[type] || colors.info;
  }

  getIcon(type) {
    const icons = {
      success: '✓',
      error: '✗',
      warning: '⚠️',
      info: 'ℹ️'
    };
    return icons[type] || icons.info;
  }
}

// ============================================================================
// IMAGE COMPRESSION
// ============================================================================

class ImageCompressor {
  constructor() {
    this.compressionLib = null;
    this.loadCompressionLibrary();
  }

  async loadCompressionLibrary() {
    try {
      // Check if already loaded
      if (window.imageCompression) {
        this.compressionLib = window.imageCompression;
        return;
      }

      // Load from CDN
      const script = document.createElement('script');
      script.src = CONFIG.CDN_URL;
      script.onload = () => {
        this.compressionLib = window.imageCompression;
        console.log('[Claude Paste] Compression library loaded');
      };
      script.onerror = () => {
        console.warn('[Claude Paste] Failed to load compression library, using fallback');
      };
      document.head.appendChild(script);
    } catch (error) {
      console.error('[Claude Paste] Compression library error:', error);
    }
  }

  async compress(file) {
    const originalSize = file.size;
    
    // Check size limit
    if (originalSize > CONFIG.MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`Image too large (${(originalSize / 1024 / 1024).toFixed(1)}MB). Maximum: ${CONFIG.MAX_SIZE_MB}MB`);
    }

    // Determine compression tier
    let quality, maxWidth;
    if (originalSize < CONFIG.COMPRESSION_TIERS.NONE) {
      // No compression needed
      return { file, compressed: false, originalSize, newSize: originalSize };
    } else if (originalSize < CONFIG.COMPRESSION_TIERS.LIGHT) {
      quality = 0.85;
      maxWidth = 2560;
    } else if (originalSize < CONFIG.COMPRESSION_TIERS.MODERATE) {
      quality = 0.75;
      maxWidth = 1920;
    } else {
      quality = 0.6;
      maxWidth = 1280;
    }

    // Use compression library if available
    if (this.compressionLib) {
      try {
        const options = {
          maxSizeMB: quality * originalSize / 1024 / 1024,
          maxWidthOrHeight: maxWidth,
          useWebWorker: true,
          fileType: file.type
        };
        
        const compressedFile = await this.compressionLib(file, options);
        return {
          file: compressedFile,
          compressed: true,
          originalSize,
          newSize: compressedFile.size
        };
      } catch (error) {
        console.warn('[Claude Paste] Compression failed, using original', error);
        return { file, compressed: false, originalSize, newSize: originalSize };
      }
    }

    // Fallback: no compression
    return { file, compressed: false, originalSize, newSize: originalSize };
  }
}

// ============================================================================
// MAIN EXTENSION LOGIC
// ============================================================================

class ClaudeImagePaste {
  constructor() {
    this.toast = new ToastManager();
    this.compressor = new ImageCompressor();
    this.init();
  }

  init() {
    console.log('[Claude Paste] Extension initialized');
    
    // Add paste event listener
    document.addEventListener('paste', this.handlePaste.bind(this), true);
    
    // Add CSS animations
    this.injectStyles();
    
    // Set global flag for debugging
    window.claudeImagePaste = true;
  }

  injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes slideIn {
        from { 
          transform: translateX(400px); 
          opacity: 0; 
        }
        to { 
          transform: translateX(0); 
          opacity: 1; 
        }
      }
      
      @keyframes slideOut {
        from { 
          transform: translateX(0); 
          opacity: 1; 
        }
        to { 
          transform: translateX(400px); 
          opacity: 0; 
        }
      }
      
      .claude-toast {
        cursor: pointer;
      }
      
      .claude-toast:hover {
        box-shadow: 0 12px 32px rgba(0,0,0,0.18);
      }
    `;
    document.head.appendChild(style);
  }

  async handlePaste(event) {
    console.log('[Claude Paste] Paste event detected');
    
    // Get clipboard items
    const clipboardData = event.clipboardData || window.clipboardData;
    if (!clipboardData) {
      console.warn('[Claude Paste] No clipboard data');
      return;
    }

    // Find image in clipboard
    let imageFile = null;
    for (const item of clipboardData.items) {
      if (item.type.startsWith('image/')) {
        imageFile = item.getAsFile();
        break;
      }
    }

    if (!imageFile) {
      console.log('[Claude Paste] No image in clipboard');
      return;
    }

    // Prevent default paste behavior
    event.preventDefault();
    event.stopPropagation();

    console.log('[Claude Paste] Image detected:', imageFile.type, imageFile.size);
    
    // Process image
    await this.processImage(imageFile);
  }

  async processImage(file) {
    try {
      // Show processing toast
      const processingToast = this.toast.show('⏳ Processing image...', 'info', 0);

      // Compress if needed
      const { file: processedFile, compressed, originalSize, newSize } = await this.compressor.compress(file);

      // Convert to base64
      const base64 = await this.fileToBase64(processedFile);

      // Inject into Claude Code
      await this.injectImage(base64);

      // Remove processing toast
      this.toast.remove(processingToast);

      // Show success toast
      const sizeInfo = compressed 
        ? `📊 Compressed: ${this.formatSize(originalSize)} → ${this.formatSize(newSize)} (${Math.round((1 - newSize/originalSize) * 100)}% smaller)`
        : `📊 Size: ${this.formatSize(originalSize)}`;
      
      this.toast.show(`✓ Image pasted!
${sizeInfo}`, 'success', 3000);

    } catch (error) {
      console.error('[Claude Paste] Error:', error);
      this.toast.show(`✗ ${error.message}`, 'error', 5000);
    }
  }

  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(new Error('Failed to read image'));
      reader.readAsDataURL(file);
    });
  }

  async injectImage(base64Data) {
    // Multi-strategy injection for Claude Code
    // Tries multiple methods to find and inject into the input field

    const markdown = `![pasted-image](${base64Data})`;

    // Strategy 1: ContentEditable div (most likely for modern React apps)
    const contentEditable = this.findInputElement();

    if (contentEditable) {
      const success = await this.injectIntoContentEditable(contentEditable, markdown);
      if (success) {
        console.log('[Claude Paste] Image injected via contentEditable');
        return;
      }
    }

    // Strategy 2: Textarea fallback
    const textarea = document.querySelector('textarea');
    if (textarea) {
      const success = await this.injectIntoTextarea(textarea, markdown);
      if (success) {
        console.log('[Claude Paste] Image injected via textarea');
        return;
      }
    }

    // Strategy 3: Clipboard fallback
    console.warn('[Claude Paste] Input element not found, copying markdown to clipboard');
    await navigator.clipboard.writeText(markdown);
    throw new Error('Input not found. Markdown copied to clipboard - paste manually (Ctrl+V).');
  }

  findInputElement() {
    // Try multiple selectors for Claude Code's input field
    const selectors = [
      '[contenteditable="true"]',
      '[role="textbox"]',
      'div[contenteditable]',
      '.ProseMirror',  // Common rich text editor
      '[data-slate-editor]',  // Slate editor
      'div.editor',
      'div[class*="input"]',
      'div[class*="editor"]'
    ];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const el of elements) {
        // Check if element is visible and editable
        if (this.isElementVisible(el) && !el.disabled && !el.readOnly) {
          return el;
        }
      }
    }

    return null;
  }

  isElementVisible(el) {
    if (!el) return false;
    const style = window.getComputedStyle(el);
    return style.display !== 'none'
        && style.visibility !== 'hidden'
        && style.opacity !== '0'
        && el.offsetWidth > 0
        && el.offsetHeight > 0;
  }

  async injectIntoContentEditable(element, markdown) {
    try {
      element.focus();

      // Method 1: execCommand (deprecated but widely supported)
      if (document.execCommand) {
        const success = document.execCommand('insertHTML', false, markdown);
        if (success) {
          this.triggerReactChange(element);
          return true;
        }
      }

      // Method 2: Selection API
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();

        const textNode = document.createTextNode(markdown);
        range.insertNode(textNode);

        // Move cursor after inserted text
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        selection.removeAllRanges();
        selection.addRange(range);

        this.triggerReactChange(element);
        return true;
      }

      // Method 3: Direct innerHTML manipulation (last resort)
      element.innerHTML += markdown;
      this.triggerReactChange(element);
      return true;

    } catch (error) {
      console.warn('[Claude Paste] ContentEditable injection failed:', error);
      return false;
    }
  }

  async injectIntoTextarea(element, markdown) {
    try {
      element.focus();

      const start = element.selectionStart;
      const end = element.selectionEnd;
      const text = element.value;

      // Insert at cursor position
      element.value = text.substring(0, start) + markdown + text.substring(end);

      // Move cursor after inserted text
      element.selectionStart = element.selectionEnd = start + markdown.length;

      // Trigger React/input events
      this.triggerReactChange(element);
      return true;

    } catch (error) {
      console.warn('[Claude Paste] Textarea injection failed:', error);
      return false;
    }
  }

  triggerReactChange(element) {
    // Trigger multiple events to ensure React picks up the change
    const events = [
      new Event('input', { bubbles: true, cancelable: true }),
      new Event('change', { bubbles: true, cancelable: true }),
      new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key: ' ' }),
      new KeyboardEvent('keyup', { bubbles: true, cancelable: true, key: ' ' })
    ];

    events.forEach(event => element.dispatchEvent(event));

    // Also try to trigger React's internal event system
    const reactKey = Object.keys(element).find(key =>
      key.startsWith('__reactProps') || key.startsWith('__reactEventHandlers')
    );

    if (reactKey) {
      console.log('[Claude Paste] React fiber detected, triggering synthetic events');
    }
  }

  formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  }
}

// ============================================================================
// INITIALIZE
// ============================================================================

// Wait for page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new ClaudeImagePaste();
  });
} else {
  new ClaudeImagePaste();
}

console.log('[Claude Paste] Content script loaded - mobile & desktop ready! 🚀');
