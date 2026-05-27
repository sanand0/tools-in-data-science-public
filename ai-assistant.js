/**
 * Docsify AI Assistant Plugin
 * Highly interactive, premium AI integration for Docsify.
 * Includes sidebar configuration panel and inline markdown widgets.
 */


// Inject CSS styles dynamically
(function() {
  const css = '/** * Docsify AI Assistant CSS * Premium, polished styles matching both dark and light modes. */:root { --ai-primary: #dc3545; --ai-primary-hover: #b02a37; --ai-primary-rgb: 220, 53, 69; /* Light theme colors */ --ai-sidebar-bg: rgba(248, 249, 250, 0.95); --ai-sidebar-border: rgba(0, 0, 0, 0.08); --ai-card-bg: rgba(255, 255, 255, 0.7); --ai-card-border: rgba(0, 0, 0, 0.06); --ai-text: #212529; --ai-text-muted: #6c757d; --ai-input-bg: #ffffff; --ai-input-border: #ced4da; --ai-input-focus: rgba(220, 53, 69, 0.25); --ai-success: #198754; --ai-error: #ea868f; --ai-error-text: #842029; --ai-error-bg: #f8d7da; --ai-code-bg: #f8f9fa;}@media (prefers-color-scheme: dark) { :root { /* Dark theme overrides */ --ai-sidebar-bg: rgba(30, 30, 30, 0.95); --ai-sidebar-border: rgba(255, 255, 255, 0.08); --ai-card-bg: rgba(38, 38, 38, 0.7); --ai-card-border: rgba(255, 255, 255, 0.05); --ai-text: #f8f9fa; --ai-text-muted: #a6a6a6; --ai-input-bg: #2d2d2d; --ai-input-border: #404040; --ai-input-focus: rgba(220, 53, 69, 0.4); --ai-success: #2ea44f; --ai-error: #f85149; --ai-error-text: #f85149; --ai-error-bg: rgba(248, 81, 73, 0.1); --ai-code-bg: #1e1e1e; }}/* 1. Sidebar credentials card */.ai-sidebar-container { order: 100 !important; flex-shrink: 0 !important; margin-top: auto !important; margin: 1rem 1rem 1.5rem 1rem; border-radius: 12px; border: 1px solid var(--ai-sidebar-border); background: var(--ai-sidebar-bg); box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);}.ai-sidebar-toggle { display: flex; align-items: center; width: 100%; padding: 0.8rem 1rem; background: transparent; border: none; color: var(--ai-text); font-weight: 600; font-size: 0.95rem; cursor: pointer; text-align: left; outline: none; transition: background-color 0.2s ease;}.ai-sidebar-toggle:hover { background-color: rgba(220, 53, 69, 0.05);}.ai-sparkles-icon { margin-right: 8px; font-size: 1.1rem; animation: float-sparkle 3s ease-in-out infinite;}@keyframes float-sparkle { 0%, 100% { transform: translateY(0) scale(1); } 50% { transform: translateY(-2px) scale(1.1); }}.ai-toggle-text { flex-grow: 1;}/* Status Dot */.ai-status-indicator { width: 8px; height: 8px; border-radius: 50%; margin-right: 12px; display: inline-block; position: relative;}.ai-status-indicator.active { background-color: var(--ai-success); box-shadow: 0 0 8px var(--ai-success); animation: pulse-green 2s infinite;}.ai-status-indicator.inactive { background-color: var(--ai-text-muted);}@keyframes pulse-green { 0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 164, 79, 0.7); } 70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(46, 164, 79, 0); } 100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(46, 164, 79, 0); }}.ai-toggle-chevron { font-size: 0.75rem; color: var(--ai-text-muted); transition: transform 0.3s ease;}.ai-toggle-chevron.expanded { transform: rotate(180deg);}/* Credentials Panel */.ai-sidebar-panel { padding: 1rem; border-top: 1px solid var(--ai-sidebar-border); animation: slide-down 0.25s ease-out;}@keyframes slide-down { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); }}.ai-form-group { margin-bottom: 0.9rem;}.ai-form-group label { display: block; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; color: var(--ai-text-muted);}.ai-select,.ai-input { width: 100%; padding: 0.5rem 0.75rem; font-size: 0.85rem; border-radius: 6px; border: 1px solid var(--ai-input-border); background-color: var(--ai-input-bg); color: var(--ai-text); box-sizing: border-box; outline: none; transition: all 0.2s ease;}.ai-select:focus,.ai-input:focus { border-color: var(--ai-primary); box-shadow: 0 0 0 3px var(--ai-input-focus);}/* Input password wrapper */.ai-input-wrapper { position: relative; display: flex; align-items: center;}.ai-input-wrapper .ai-input { padding-right: 2.2rem;}.ai-key-visibility { position: absolute; right: 6px; background: transparent; border: none; color: var(--ai-text-muted); cursor: pointer; padding: 4px; font-size: 0.9rem; outline: none; user-select: none;}.ai-key-visibility:hover { color: var(--ai-text);}/* Buttons */.ai-btn-save { display: block; width: 100%; padding: 0.6rem; font-size: 0.85rem; font-weight: 600; border-radius: 6px; border: none; background: linear-gradient(135deg, var(--ai-primary), #b02a37); color: white; cursor: pointer; box-shadow: 0 2px 6px rgba(220, 53, 69, 0.2); transition: all 0.2s ease;}.ai-btn-save:hover { transform: translateY(-1px); box-shadow: 0 4px 10px rgba(220, 53, 69, 0.3);}.ai-btn-save:active { transform: translateY(1px);}.ai-save-feedback { font-size: 0.75rem; color: var(--ai-success); font-weight: 600; margin-top: 6px; text-align: center; animation: fade-in-out 2s forwards;}@keyframes fade-in-out { 0% { opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { opacity: 0; }}/* 2. Embedded AI Questions Widgets */.ai-widget-container { margin: 2rem 0; padding: 1.5rem; border-radius: 14px; border: 1px solid var(--ai-card-border); background: linear-gradient(135deg, rgba(var(--ai-primary-rgb), 0.04), rgba(var(--ai-primary-rgb), 0.01)); box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);}.ai-widget-container:hover { box-shadow: 0 8px 28px rgba(0, 0, 0, 0.04); border-color: rgba(var(--ai-primary-rgb), 0.15);}.ai-widget-header { display: flex; align-items: center; margin-bottom: 1rem;}.ai-widget-logo { font-size: 1.3rem; margin-right: 10px;}.ai-widget-title { font-weight: 700; font-size: 0.95rem; color: var(--ai-text); letter-spacing: 0.2px;}.ai-widget-body { display: flex; flex-direction: column; gap: 0.8rem;}.ai-prompt-preview { font-size: 0.85rem; color: var(--ai-text-muted); background: var(--ai-card-bg); padding: 0.6rem 0.9rem; border-radius: 8px; border: 1px dashed rgba(var(--ai-primary-rgb), 0.15); line-height: 1.4;}.ai-input-row { display: flex; gap: 10px; width: 100%;}.ai-widget-input { flex-grow: 1; padding: 0.75rem 1rem; font-size: 0.9rem; border-radius: 8px; border: 1px solid var(--ai-input-border); background-color: var(--ai-input-bg); color: var(--ai-text); box-sizing: border-box; outline: none; transition: all 0.25s ease;}.ai-widget-input:focus { border-color: var(--ai-primary); box-shadow: 0 0 0 3px var(--ai-input-focus);}.ai-widget-btn { padding: 0.75rem 1.4rem; font-size: 0.9rem; font-weight: 600; border-radius: 8px; border: none; background: linear-gradient(135deg, var(--ai-primary), #b02a37); color: white; cursor: pointer; white-space: nowrap; box-shadow: 0 2px 6px rgba(220, 53, 69, 0.2); transition: all 0.2s ease;}.ai-widget-btn:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);}.ai-widget-btn:active:not(:disabled) { transform: translateY(1px);}.ai-widget-btn:disabled { background: var(--ai-text-muted); opacity: 0.6; cursor: not-allowed; box-shadow: none;}/* Loading animations */.ai-widget-loader { padding: 1rem; display: flex; flex-direction: column; gap: 10px; background: var(--ai-card-bg); border-radius: 8px; border: 1px solid var(--ai-sidebar-border);}.ai-loading-sparkles { font-size: 0.85rem; font-weight: 600; color: var(--ai-primary); animation: pulse-loading 1.5s ease-in-out infinite;}@keyframes pulse-loading { 0%, 100% { opacity: 0.6; } 50% { opacity: 1; }}.ai-shimmer-bar { height: 6px; background: var(--ai-sidebar-border); border-radius: 3px; overflow: hidden; position: relative;}.ai-shimmer-fill { height: 100%; width: 40%; background: linear-gradient(90deg, transparent, var(--ai-primary), transparent); position: absolute; top: 0; left: 0; animation: shimmy 1.8s infinite ease-in-out;}@keyframes shimmy { 0% { left: -40%; } 100% { left: 100%; }}/* Error messages */.ai-widget-error { padding: 0.8rem 1rem; font-size: 0.85rem; font-weight: 600; border-radius: 8px; color: var(--ai-error-text); background-color: var(--ai-error-bg); border: 1px solid rgba(var(--ai-primary-rgb), 0.15); animation: shake 0.4s ease-in-out;}@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); }}/* Response Area */.ai-widget-response { padding: 1.5rem; border-radius: 10px; background-color: var(--ai-card-bg); border: 1px solid var(--ai-sidebar-border); color: var(--ai-text); line-height: 1.6; font-size: 0.95rem; overflow-x: auto; animation: pop-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1);}@keyframes pop-fade { from { opacity: 0; transform: translateY(10px) scale(0.99); } to { opacity: 1; transform: translateY(0) scale(1); }}/* Response inside-markdown styling */.ai-widget-response h1,.ai-widget-response h2,.ai-widget-response h3,.ai-widget-response h4 { margin-top: 1.2rem; margin-bottom: 0.6rem; color: var(--ai-text); font-weight: 700;}.ai-widget-response h1 { font-size: 1.3rem; border-bottom: 1px solid var(--ai-sidebar-border); padding-bottom: 0.3rem; }.ai-widget-response h2 { font-size: 1.15rem; }.ai-widget-response h3 { font-size: 1.05rem; }.ai-widget-response p { margin: 0.6rem 0;}.ai-widget-response ul,.ai-widget-response ol { margin: 0.6rem 0; padding-left: 1.5rem;}.ai-widget-response li { margin: 0.3rem 0;}.ai-widget-response code { background: var(--ai-code-bg); color: var(--ai-primary); padding: 0.15rem 0.35rem; border-radius: 4px; font-family: "Courier New", Courier, monospace; font-size: 0.85em;}.ai-widget-response pre { background: var(--ai-code-bg); border-radius: 8px; padding: 1rem; margin: 0.8rem 0; overflow-x: auto; border: 1px solid var(--ai-sidebar-border);}.ai-widget-response pre code { background: transparent; color: inherit; padding: 0; border-radius: 0; font-size: 0.85rem;}.ai-widget-response blockquote { margin: 0.8rem 0; padding-left: 1rem; border-left: 4px solid var(--ai-primary); color: var(--ai-text-muted); font-style: italic;}/* Global utility classes */.hidden { display: none !important;}/* ─── Reading Mode Toolbar ─────────────────────────────────────────────── */.ai-mode-toolbar { margin: 1.5rem 0 2rem 0; padding: 1rem; background: var(--ai-card-bg); border: 1px solid var(--ai-sidebar-border); border-radius: 12px; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; animation: pop-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1);}.ai-mode-toolbar-label { font-size: 0.95rem; font-weight: 700; color: var(--ai-text); margin-bottom: 0.8rem; display: flex; align-items: center; gap: 6px;}.ai-mode-label-icon { color: var(--ai-primary);}.ai-mode-btn-row { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 1rem;}.ai-mode-btn { display: inline-flex; align-items: center; gap: 6px; padding: 0.5rem 0.8rem; font-size: 0.85rem; font-weight: 600; color: var(--ai-text); background: var(--ai-sidebar-bg); border: 1px solid var(--ai-sidebar-border); border-radius: 20px; cursor: pointer; transition: all 0.2s ease; white-space: nowrap;}.ai-mode-btn:hover:not(:disabled) { border-color: var(--ai-primary); color: var(--ai-primary); transform: translateY(-1px); box-shadow: 0 2px 8px rgba(var(--ai-primary-rgb), 0.15);}.ai-mode-btn.active { background: linear-gradient(135deg, var(--ai-primary), #b02a37); color: white; border-color: transparent; box-shadow: 0 2px 8px rgba(220, 53, 69, 0.3);}.ai-mode-btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none;}.ai-mode-custom-row { display: flex; gap: 8px;}.ai-mode-custom-input { flex-grow: 1; padding: 0.6rem 1rem; font-size: 0.9rem; border-radius: 20px; border: 1px solid var(--ai-input-border); background-color: var(--ai-input-bg); color: var(--ai-text); outline: none; transition: all 0.2s ease;}.ai-mode-custom-input:focus { border-color: var(--ai-primary); box-shadow: 0 0 0 3px var(--ai-input-focus);}.ai-mode-custom-btn { padding: 0.6rem 1.2rem; font-size: 0.9rem; font-weight: 600; border-radius: 20px; border: none; background: var(--ai-sidebar-border); color: var(--ai-text); cursor: pointer; transition: all 0.2s ease;}.ai-mode-custom-btn:hover:not(:disabled) { background: var(--ai-primary); color: white;}.ai-mode-error { margin-top: 1rem; padding: 0.8rem; border-radius: 8px; background: var(--ai-error-bg); color: var(--ai-error-text); font-size: 0.85rem; font-weight: 600; border: 1px solid rgba(248, 81, 73, 0.2); animation: shake 0.4s ease-in-out;}.ai-mode-restore-bar { margin: 1.5rem 0 2rem 0; padding: 1rem; background: rgba(var(--ai-primary-rgb), 0.05); border: 1px dashed var(--ai-primary); border-radius: 12px; display: flex; justify-content: space-between; align-items: center; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; animation: pop-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1);}.ai-mode-restore-bar span { font-size: 0.95rem; color: var(--ai-text);}.ai-mode-restore-btn { padding: 0.5rem 1rem; font-size: 0.85rem; font-weight: 600; color: var(--ai-primary); background: transparent; border: 1px solid var(--ai-primary); border-radius: 20px; cursor: pointer; transition: all 0.2s ease;}.ai-mode-restore-btn:hover { background: var(--ai-primary); color: white;}/* Full-page Overlay */.ai-mode-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); z-index: 1000; display: flex; justify-content: center; align-items: flex-start; padding-top: 20vh; border-radius: 8px; animation: fade-in 0.3s ease;}[data-theme="dark"] .ai-mode-overlay,body.dark .ai-mode-overlay { background: rgba(13, 17, 23, 0.85);}.ai-mode-overlay-inner { background: var(--ai-card-bg); padding: 2rem; border-radius: 16px; border: 1px solid var(--ai-sidebar-border); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1); text-align: center; min-width: 300px; animation: pop-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1);}.ai-mode-overlay-icon { font-size: 3rem; margin-bottom: 1rem; animation: bounce 2s infinite ease-in-out;}.ai-mode-overlay-title { font-size: 1.1rem; font-weight: 600; color: var(--ai-text); margin-bottom: 1.5rem; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;}@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); }}@keyframes fade-in { from { opacity: 0; } to { opacity: 1; }}';
  const style = document.createElement('style');
  style.type = 'text/css';
  style.appendChild(document.createTextNode(css));
  document.head.appendChild(style);
})();

(function () {
  // Config presets for providers
  const PROVIDERS = {
    aipipe: {
      name: 'AIPipe',
      baseUrl: 'https://aipipe.org/openrouter/v1',
      model: 'google/gemini-3.1-flash-lite',
      isNativeGemini: false
    },
    gemini: {
      name: 'Google Gemini (Native)',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      model: 'gemini-1.5-flash',
      isNativeGemini: true
    },
    openai: {
      name: 'OpenAI',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o-mini',
      isNativeGemini: false
    },
    groq: {
      name: 'Groq',
      baseUrl: 'https://api.groq.com/openai/v1',
      model: 'llama-3.3-70b-versatile',
      isNativeGemini: false
    },
    openrouter: {
      name: 'OpenRouter',
      baseUrl: 'https://openrouter.ai/api/v1',
      model: 'google/gemini-2.5-flash',
      isNativeGemini: false
    },
    custom: {
      name: 'Custom / OpenAI-Compatible',
      baseUrl: '',
      model: '',
      isNativeGemini: false
    }
  };

  // Models list management
  function getModelsList() {
    const saved = localStorage.getItem('docsify_ai_models_list');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { }
    }
    return [
      'google/veo-3.1-fast',
      'google/gemini-3.1-flash-lite',
      'google/gemini-3.5-flash',
      'openai/gpt-5.4-nano',
      'z-ai/glm-5.1',
      'gpt-5.3-codex',
      'gpt-5.3-codex-mini'
    ];
  }

  function addModelToList(newModel) {
    if (!newModel) return;
    const list = getModelsList();
    if (!list.includes(newModel)) {
      list.push(newModel);
      localStorage.setItem('docsify_ai_models_list', JSON.stringify(list));
    }
  }

  // Retrieve saved credentials
  function getCredentials() {
    const provider = localStorage.getItem('docsify_ai_provider') || 'aipipe';
    const apiKey = localStorage.getItem('docsify_ai_apikey') || '';
    const baseUrl = localStorage.getItem('docsify_ai_baseurl') || PROVIDERS.aipipe.baseUrl;
    const model = localStorage.getItem('docsify_ai_model') || PROVIDERS.aipipe.model;

    if (model) {
      addModelToList(model);
    }

    return { provider, apiKey, baseUrl, model };
  }

  // Save credentials to localStorage
  function saveCredentials(credentials) {
    localStorage.setItem('docsify_ai_provider', credentials.provider);
    localStorage.setItem('docsify_ai_apikey', credentials.apiKey);
    localStorage.setItem('docsify_ai_baseurl', credentials.baseUrl);
    localStorage.setItem('docsify_ai_model', credentials.model);
  }

  // Safe markdown compiler fallback
  function compileMarkdown(markdown) {
    if (window.marked) {
      const markedOpts = { breaks: true, gfm: true };
      if (typeof window.marked.parse === 'function') {
        return window.marked.parse(markdown, markedOpts);
      } else if (typeof window.marked === 'function') {
        return window.marked(markdown, markedOpts);
      }
    }

    // Minimal fallback renderer
    return markdown
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br>')
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code>$1</code>');
  }

  // Inject Sidebar UI
  function injectSidebarUI() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar || sidebar.querySelector('.ai-sidebar-container')) return;

    // We want to insert it above the search element.
    const searchContainer = sidebar.querySelector('.search');

    const container = document.createElement('div');
    container.className = 'ai-sidebar-container';

    const creds = getCredentials();
    const hasKey = !!creds.apiKey;

    container.innerHTML = `
      <button class="ai-sidebar-toggle" id="aiSidebarToggle">
        <span class="ai-sparkles-icon">✨</span>
        <span class="ai-toggle-text">AI Assistant</span>
        <span class="ai-status-indicator ${hasKey ? 'active' : 'inactive'}" id="aiStatusIndicator"></span>
        <span class="ai-toggle-chevron">▼</span>
      </button>
      <div class="ai-sidebar-panel hidden" id="aiSidebarPanel">
        <div class="ai-form-group">
          <label for="aiProvider">Provider</label>
          <select id="aiProvider" class="ai-select">
            ${Object.keys(PROVIDERS).map(key => `
              <option value="${key}" ${creds.provider === key ? 'selected' : ''}>${PROVIDERS[key].name}</option>
            `).join('')}
          </select>
        </div>
        <div class="ai-form-group">
          <label for="aiApiKey">API Key</label>
          <div class="ai-input-wrapper">
            <input type="password" id="aiApiKey" class="ai-input" placeholder="Paste your API key..." value="${creds.apiKey}">
            <button type="button" class="ai-key-visibility" id="aiKeyVisibility" title="Toggle visibility">👁️</button>
          </div>
        </div>
        <div class="ai-form-group" id="aiBaseUrlGroup">
          <label for="aiBaseUrl">Base URL</label>
          <input type="text" id="aiBaseUrl" class="ai-input" placeholder="Base API URL" value="${creds.baseUrl}">
        </div>
        <div class="ai-form-group">
          <label for="aiModelSelect">Model</label>
          <select id="aiModelSelect" class="ai-select"></select>
        </div>
        <div class="ai-form-group hidden" id="aiCustomModelGroup">
          <label for="aiCustomModel">Custom Model Name</label>
          <input type="text" id="aiCustomModel" class="ai-input" placeholder="Enter custom model (e.g. my-model)...">
        </div>
        <button type="button" class="ai-btn-save" id="aiSaveBtn">Save Credentials</button>
        <div class="ai-save-feedback hidden" id="aiSaveFeedback">Saved successfully!</div>
      </div>
    `;

    sidebar.appendChild(container);

    // Toggle Panel
    const toggleBtn = container.querySelector('#aiSidebarToggle');
    const panel = container.querySelector('#aiSidebarPanel');
    const chevron = container.querySelector('.ai-toggle-chevron');

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('hidden');
      chevron.classList.toggle('expanded');
    });

    // Close panel when clicking outside
    document.addEventListener('click', (e) => {
      if (!container.contains(e.target) && !panel.classList.contains('hidden')) {
        panel.classList.add('hidden');
        chevron.classList.remove('expanded');
      }
    });

    // Prevent closing when interacting with the panel
    panel.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Toggle Password Visibility
    const visibilityBtn = container.querySelector('#aiKeyVisibility');
    const apiKeyInput = container.querySelector('#aiApiKey');
    visibilityBtn.addEventListener('click', () => {
      if (apiKeyInput.type === 'password') {
        apiKeyInput.type = 'text';
        visibilityBtn.textContent = '🔒';
      } else {
        apiKeyInput.type = 'password';
        visibilityBtn.textContent = '👁️';
      }
    });

    // Provider Presets Handler
    const providerSelect = container.querySelector('#aiProvider');
    const baseUrlInput = container.querySelector('#aiBaseUrl');
    const baseUrlGroup = container.querySelector('#aiBaseUrlGroup');
    const modelSelect = container.querySelector('#aiModelSelect');
    const customModelGroup = container.querySelector('#aiCustomModelGroup');
    const customModelInput = container.querySelector('#aiCustomModel');

    // Helper to render model options
    function renderModelOptions(selectedModel) {
      const list = getModelsList();
      modelSelect.innerHTML = list.map(m => `
        <option value="${m}" ${m === selectedModel ? 'selected' : ''}>${m}</option>
      `).join('') + '<option value="custom_input">+ Add Custom Model...</option>';

      if (selectedModel && !list.includes(selectedModel)) {
        const opt = document.createElement('option');
        opt.value = selectedModel;
        opt.textContent = selectedModel;
        opt.selected = true;
        modelSelect.insertBefore(opt, modelSelect.lastChild);
      }

      if (modelSelect.value === 'custom_input') {
        customModelGroup.classList.remove('hidden');
      } else {
        customModelGroup.classList.add('hidden');
      }
    }

    // Initialize model options
    renderModelOptions(creds.model);

    modelSelect.addEventListener('change', (e) => {
      if (e.target.value === 'custom_input') {
        customModelGroup.classList.remove('hidden');
        customModelInput.value = '';
        customModelInput.focus();
      } else {
        customModelGroup.classList.add('hidden');
      }
    });

    function updatePresetVisibility(provider) {
      if (provider === 'gemini') {
        baseUrlGroup.style.display = 'none';
      } else {
        baseUrlGroup.style.display = 'block';
      }
    }

    // Run initially
    updatePresetVisibility(providerSelect.value);

    providerSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      updatePresetVisibility(selected);
      const preset = PROVIDERS[selected];
      baseUrlInput.value = preset.baseUrl;

      if (preset.model) {
        addModelToList(preset.model);
        renderModelOptions(preset.model);
      }
    });

    // Save Action
    const saveBtn = container.querySelector('#aiSaveBtn');
    const feedback = container.querySelector('#aiSaveFeedback');
    const statusIndicator = container.querySelector('#aiStatusIndicator');

    saveBtn.addEventListener('click', () => {
      let finalModel = modelSelect.value;
      if (finalModel === 'custom_input') {
        finalModel = customModelInput.value.trim();
        if (!finalModel) {
          alert('Please enter a custom model name or select one from the list.');
          return;
        }
        addModelToList(finalModel);
        renderModelOptions(finalModel);
      }

      const newCreds = {
        provider: providerSelect.value,
        apiKey: apiKeyInput.value.trim(),
        baseUrl: baseUrlInput.value.trim(),
        model: finalModel
      };

      saveCredentials(newCreds);

      // Pulse success feedback
      feedback.classList.remove('hidden');
      setTimeout(() => {
        feedback.classList.add('hidden');
      }, 2000);

      // Update active indicator
      if (newCreds.apiKey) {
        statusIndicator.classList.remove('inactive');
        statusIndicator.classList.add('active');
      } else {
        statusIndicator.classList.remove('active');
        statusIndicator.classList.add('inactive');
      }
    });
  }

  // Handle AI Call
  async function callLLM(userPrompt, systemPrompt) {
    const creds = getCredentials();
    if (!creds.apiKey) {
      throw new Error('API Key missing. Please click "AI Assistant" at the top of the sidebar to configure your credentials.');
    }

    const providerConfig = PROVIDERS[creds.provider] || PROVIDERS.custom;

    if (providerConfig.isNativeGemini) {
      // Gemini Native API payload
      const url = `${creds.baseUrl}/models/${creds.model}:generateContent?key=${creds.apiKey}`;
      const payload = {
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: `${systemPrompt}\n\nUser Question:\n${userPrompt}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2
        }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `Gemini API returned status ${response.status}`);
      }

      const data = await response.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!answer) {
        throw new Error('Gemini did not return any answer text.');
      }
      return answer;

    } else {
      // OpenAI-compatible Chat Completions payload
      let url = creds.baseUrl;
      if (!url.endsWith('/chat/completions')) {
        url = url.replace(/\/$/, '') + '/chat/completions';
      }

      const payload = {
        model: creds.model,
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: userPrompt
          }
        ],
        temperature: 0.2
      };

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${creds.apiKey}`
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData?.error?.message || `LLM API returned status ${response.status}`);
      }

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content;
      if (!answer) {
        throw new Error('LLM did not return any completion message content.');
      }
      return answer;
    }
  }

  // Render & setup widgets inside content
  function mountWidgets() {
    // Find all custom tags
    const widgets = document.querySelectorAll('ai-widget, .ai-question-widget');

    widgets.forEach((widget) => {
      // Prevent double mounting
      if (widget.querySelector('.ai-widget-container')) return;

      const promptAttr = widget.getAttribute('prompt') || widget.getAttribute('data-prompt') || 'Summarize the core takeaways.';
      const buttonLabel = widget.getAttribute('button') || widget.getAttribute('data-button') || '✨ Ask AI';
      const placeholder = widget.getAttribute('placeholder') || widget.getAttribute('data-placeholder') || 'Ask a follow-up question about this guide...';
      const includeContext = widget.getAttribute('include-context') !== 'false' && widget.getAttribute('data-include-context') !== 'false';

      // Create pristine UI wrapper
      const widgetContainer = document.createElement('div');
      widgetContainer.className = 'ai-widget-container';

      widgetContainer.innerHTML = `
        <div class="ai-widget-header">
          <span class="ai-widget-logo">✨</span>
          <span class="ai-widget-title">AI Assistant Smart Widget</span>
        </div>
        <div class="ai-widget-body">
          <div class="ai-prompt-preview">
            <strong>Action:</strong> ${promptAttr}
          </div>
          
          <div class="ai-input-row">
            <input type="text" class="ai-widget-input" placeholder="${placeholder}">
            <button class="ai-widget-btn">${buttonLabel}</button>
          </div>
          
          <div class="ai-widget-loader hidden">
            <div class="ai-loading-sparkles">⚡ Synthesizing response...</div>
            <div class="ai-shimmer-bar">
              <div class="ai-shimmer-fill"></div>
            </div>
          </div>
          
          <div class="ai-widget-error hidden"></div>
          <div class="ai-widget-response hidden"></div>
        </div>
      `;

      // Replace original children/inner HTML or just append
      widget.innerHTML = '';
      widget.appendChild(widgetContainer);

      // Elements
      const inputEl = widgetContainer.querySelector('.ai-widget-input');
      const btnEl = widgetContainer.querySelector('.ai-widget-btn');
      const loaderEl = widgetContainer.querySelector('.ai-widget-loader');
      const errorEl = widgetContainer.querySelector('.ai-widget-error');
      const responseEl = widgetContainer.querySelector('.ai-widget-response');

      async function handleAsk() {
        const userCustomText = inputEl.value.trim();

        // Hide previous errors/responses
        errorEl.classList.add('hidden');
        responseEl.classList.add('hidden');

        // Show loading state
        loaderEl.classList.remove('hidden');
        btnEl.disabled = true;

        try {
          // Gather page context
          let pageContext = '';
          if (includeContext) {
            const article = document.querySelector('article');
            pageContext = article ? article.innerText : '';
          }

          // Build prompts
          const systemPrompt = `You are a helpful Teaching Assistant for "Tools in Data Science".
Here is the text content of the page the student is currently viewing:
---
${pageContext}
---
Always ground your answer in this page context if relevant. Present your answer in extremely clear, professionally formatted Markdown with proper headers, lists, and code blocks as appropriate.`;

          const finalUserPrompt = `Predefined prompt instruction: ${promptAttr}
${userCustomText ? `\nUser's specific follow-up question: ${userCustomText}` : ''}`;

          // Invoke API
          const responseMarkdown = await callLLM(finalUserPrompt, systemPrompt);

          // Render output
          responseEl.innerHTML = compileMarkdown(responseMarkdown);

          // Apply Prism syntax highlighting if available
          if (window.Prism) {
            window.Prism.highlightAllUnder(responseEl);
          }

          responseEl.classList.remove('hidden');

          // Clear input on successful answer
          inputEl.value = '';

        } catch (err) {
          errorEl.textContent = `❌ Error: ${err.message}`;
          errorEl.classList.remove('hidden');
        } finally {
          loaderEl.classList.add('hidden');
          btnEl.disabled = false;
        }
      }

      // Hook events
      btnEl.addEventListener('click', handleAsk);
      inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          handleAsk();
        }
      });
    });
  }

  // ─── Reading Mode Toolbar ─────────────────────────────────────────────────

  const READING_MODES = [
    {
      icon: '🔬',
      label: 'Much Deeper',
      prompt: 'Rewrite this entire guide with MUCH MORE DEPTH. Add detailed explanations for every concept, expand every step with more sub-steps, add diagrams (in ASCII or markdown table form), edge cases, gotchas, common mistakes, and advanced tips. Make it 3x longer and educational.'
    },
    {
      icon: '⚡',
      label: 'Ultra Concise',
      prompt: 'Rewrite this guide as an ultra-concise cheatsheet. Remove all fluff. Keep only the essential commands, key concepts, and critical warnings. Use bullet points and short code snippets. Target: 30% of the original length.'
    },
    {
      icon: '🏆',
      label: 'MCQ Practice(Prepare for Exam)',
      prompt: 'Transform this entire guide into a rich MCQ (Multiple Choice Question) practice set. Generate 15-20 high-quality, tricky questions that test deep understanding. Each question should have 4 options (A, B, C, D) with one correct answer. Use collapsible <details><summary>Answer</summary>...</details> for answers. Group by topic with headers.'
    },
    {
      icon: '⚽',
      label: 'Football Style',
      prompt: 'Rewrite this entire technical guide using football (soccer) analogies and metaphors throughout. Map every technical concept to a football concept. For example: a function is like a set piece play, a variable is like a player position, debugging is like reviewing match footage. Keep it educational but make it feel like reading a football tactics book.'
    },
    {
      icon: '👶',
      label: 'ELI5',
      prompt: 'Rewrite this guide as if explaining to a 12-year-old who is completely new to computers and programming. Use extremely simple words, fun analogies from everyday life (pizza, legos, books), avoid jargon, and be encouraging and enthusiastic. Add "What does this mean in real life?" sections.'
    },
    {
      icon: '🎮',
      label: 'Game Quest Style',
      prompt: 'Rewrite this guide as a video game quest walkthrough. Frame it as an RPG adventure: the reader is the hero, concepts are obstacles/enemies, commands are spells, successfully running code means winning battles. Use quest-log formatting, XP rewards, achievement badges, boss fights, and level-up moments. Make learning feel like gaming.'
    },
    {
      icon: '💻',
      label: 'Code-Heavy',
      prompt: 'Rewrite this guide with maximum code examples. For every concept mentioned, add 2-3 code examples showing it in action. Add "What happens if you do X wrong?" examples with error outputs and fixes. Include real-world use cases in code. Minimize prose, maximize runnable examples.'
    },
    {
      icon: '📖',
      label: 'Story Mode',
      prompt: 'Rewrite this guide as an engaging narrative story. Introduce characters (e.g., "Alice is a data science student who just joined the course..."). Let the story walk through the concepts naturally as the characters encounter problems and solve them. Make it feel like reading a novel about learning tech.'
    },
    {
      icon: '📖',
      label: 'CheatSheet',
      prompt: 'Rewrite this guide as an engaging Cheatsheet. Maximum important points, no unnecessary explanations. At end add short notes and important interview q&a. Use mermaid diagram to create simple flowcharts to understand things better.'
    }
  ];

  // Store original article HTML so we can restore it
  let _originalArticleHTML = null;
  let _toolbarMounted = false;

  function mountReadingToolbar() {
    const article = document.querySelector('article.markdown-section');
    if (!article) return;

    // Remove any previous toolbar
    const oldToolbar = article.querySelector('.ai-mode-toolbar');
    if (oldToolbar) oldToolbar.remove();
    _toolbarMounted = false;

    // Snapshot original HTML on first mount per page
    _originalArticleHTML = article.innerHTML;

    // Find the h1 to insert after
    const h1 = article.querySelector('h1');
    if (!h1) return;

    const toolbar = document.createElement('div');
    toolbar.className = 'ai-mode-toolbar';
    toolbar.setAttribute('data-mounted', '1');

    const label = document.createElement('div');
    label.className = 'ai-mode-toolbar-label';
    label.innerHTML = '<span class="ai-mode-label-icon">✨</span> Reading Mode:';

    // Destination selector container (In-Page vs External AI Chat)
    const savedDest = localStorage.getItem('docsify_ai_mode_dest') || 'inline';
    const savedProvider = localStorage.getItem('docsify_ai_mode_ext_prov') || 'chatgpt';

    const destContainer = document.createElement('div');
    destContainer.className = 'ai-mode-destination-container';
    destContainer.innerHTML = `
      <div class="ai-mode-destination-options" style="display: flex; gap: 20px; margin-bottom: 15px; flex-wrap: wrap; padding: 10px; background: var(--ai-sidebar-bg); border-radius: 8px; border: 1px solid var(--ai-sidebar-border);">
        <label class="ai-destination-option" title="Rewrite and transform this guide directly inside this browser tab." style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 0.9rem; color: var(--ai-text);">
          <input type="radio" name="ai-destination" value="inline" ${savedDest === 'inline' ? 'checked' : ''}>
          <span>✨ In-Page Inline (Usual)</span>
        </label>
        <label class="ai-destination-option" title="Open an external AI website (e.g. ChatGPT, Claude) with the rewritten prompt and code automatically copied." style="display: flex; align-items: center; gap: 6px; cursor: pointer; font-size: 0.9rem; color: var(--ai-text);">
          <input type="radio" name="ai-destination" value="external" ${savedDest === 'external' ? 'checked' : ''}>
          <span>🚀 Send to External AI Chat</span>
        </label>
      </div>
      <div class="ai-external-provider-select-group ${savedDest === 'external' ? '' : 'hidden'}" id="aiExternalProviderSelectGroup" style="margin-bottom: 15px; background: var(--ai-sidebar-bg); padding: 12px 15px; border-radius: 8px; border: 1px solid var(--ai-sidebar-border);">
        <label for="aiExternalProvider" style="display: block; font-size: 0.8rem; font-weight: 600; text-transform: uppercase; color: var(--ai-text-muted); margin-bottom: 8px;">Select Website:</label>
        <select id="aiExternalProvider" class="ai-select" style="max-width: 350px; cursor: pointer; font-weight: 500;">
          <option value="chatgpt" ${savedProvider === 'chatgpt' ? 'selected' : ''}>ChatGPT (chatgpt.com)</option>
          <option value="gemini" ${savedProvider === 'gemini' ? 'selected' : ''}>Google Gemini (gemini.google.com)</option>
          <option value="claude" ${savedProvider === 'claude' ? 'selected' : ''}>Anthropic Claude (claude.ai)</option>
          <option value="notebooklm" ${savedProvider === 'notebooklm' ? 'selected' : ''}>Google NotebookLM (notebooklm.google.com)</option>
          <option value="minimax" ${savedProvider === 'minimax' ? 'selected' : ''}>MiniMax M2 (hailuoai.com)</option>
          <option value="kimi" ${savedProvider === 'kimi' ? 'selected' : ''}>Moonshot Kimi (kimi.moonshot.cn)</option>
          <option value="qwen" ${savedProvider === 'qwen' ? 'selected' : ''}>Alibaba Qwen (chat.qwenlm.ai)</option>
          <option value="perplexity" ${savedProvider === 'perplexity' ? 'selected' : ''}>Perplexity AI (perplexity.ai)</option>
        </select>
      </div>
    `;

    // Hook listeners for Destination Selector state change
    const radioOptions = destContainer.querySelectorAll('input[name="ai-destination"]');
    const selectGroup = destContainer.querySelector('#aiExternalProviderSelectGroup');
    const providerSelect = destContainer.querySelector('#aiExternalProvider');

    radioOptions.forEach(radio => {
      radio.addEventListener('change', (e) => {
        const value = e.target.value;
        localStorage.setItem('docsify_ai_mode_dest', value);
        if (value === 'external') {
          selectGroup.classList.remove('hidden');
        } else {
          selectGroup.classList.add('hidden');
        }
      });
    });

    providerSelect.addEventListener('change', (e) => {
      localStorage.setItem('docsify_ai_mode_ext_prov', e.target.value);
    });

    const btnRow = document.createElement('div');
    btnRow.className = 'ai-mode-btn-row';

    READING_MODES.forEach((mode) => {
      const btn = document.createElement('button');
      btn.className = 'ai-mode-btn';
      btn.dataset.mode = mode.label;
      btn.innerHTML = `${mode.icon} <span>${mode.label}</span>`;
      btn.title = mode.prompt.substring(0, 100) + '...';

      btn.addEventListener('click', () => handleModeTransform(mode, toolbar));
      btnRow.appendChild(btn);
    });

    // Custom prompt input row
    const customRow = document.createElement('div');
    customRow.className = 'ai-mode-custom-row';
    customRow.innerHTML = `
      <input type="text" class="ai-mode-custom-input" placeholder="✏️ Custom instruction... (e.g. 'Explain with chemistry analogies')">
      <button class="ai-mode-custom-btn">Go ✨</button>
    `;

    const customInput = customRow.querySelector('.ai-mode-custom-input');
    const customBtn = customRow.querySelector('.ai-mode-custom-btn');

    const customMode = { icon: '✏️', label: 'Custom' };
    customBtn.addEventListener('click', () => {
      const text = customInput.value.trim();
      if (!text) return;
      customMode.prompt = `Rewrite the entire guide based on this instruction: "${text}". Produce a complete, well-structured Markdown document that fulfils this instruction using the guide's content as source material.`;
      handleModeTransform(customMode, toolbar);
    });
    customInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') customBtn.click();
    });

    toolbar.appendChild(label);
    toolbar.appendChild(destContainer);
    toolbar.appendChild(btnRow);
    toolbar.appendChild(customRow);

    // Insert after h1
    h1.after(toolbar);
    _toolbarMounted = true;
  }


  function copyToClipboard(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    // Fallback using legacy document.execCommand
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    } finally {
      document.body.removeChild(textarea);
    }
  }

  async function handleModeTransform(mode, toolbar) {
    const article = document.querySelector('article.markdown-section');
    if (!article) return;

    // Check if the user selected to send to an external AI site
    const dest = localStorage.getItem('docsify_ai_mode_dest') || 'inline';
    if (dest === 'external') {
      try {
        // Option 3: Use Raw GitHub URL instead of raw markdown text to completely bypass HTTP 414 length limits
        const hash = window.location.hash || '#/';
        let path = hash.replace(/^#/, '');
        if (path === '/' || path === '') {
          path = '/README';
        }

        const GITHUB_BRANCH = 't2-26';
        const GITHUB_REPO_BASE = `https://raw.githubusercontent.com/sanand0/tools-in-data-science-public/${GITHUB_BRANCH}`;
        const githubFileUrl = `${GITHUB_REPO_BASE}${path}.md`;

        // Build the consolidated unified prompt combining the instructions and the GitHub link
        const unifiedPrompt = `${mode.prompt}

First please read the source document available at raw github url below:
${githubFileUrl}

Please perform the transformation as described in the instructions above.`;

        // Copy the entire unified prompt to the user's clipboard!
        await copyToClipboard(unifiedPrompt);

        // Get provider info and pre-fill URL parameters
        const providerKey = localStorage.getItem('docsify_ai_mode_ext_prov') || 'chatgpt';
        const PROVIDER_INFO = {
          chatgpt: { name: 'ChatGPT', url: 'https://chatgpt.com' },
          gemini: { name: 'Google Gemini', url: 'https://gemini.google.com/app' },
          claude: { name: 'Anthropic Claude', url: 'https://claude.ai/new' },
          notebooklm: { name: 'Google NotebookLM', url: 'https://notebooklm.google.com' },
          minimax: { name: 'MiniMax M2', url: 'https://test.hailuoai.com' },
          kimi: { name: 'Moonshot Kimi', url: 'https://kimi.moonshot.cn' },
          qwen: { name: 'Alibaba Qwen', url: 'https://chat.qwenlm.ai' },
          perplexity: { name: 'Perplexity AI', url: 'https://www.perplexity.ai' }
        };

        const info = PROVIDER_INFO[providerKey] || PROVIDER_INFO.chatgpt;

        // Auto pre-fill the prompt query parameters for the selected provider
        // Since we are using the GitHub URL, it is incredibly short and completely safe from HTTP 414 limits!
        const separator = info.url.includes('?') ? '&' : '?';
        const targetUrl = `${info.url}${separator}q=${encodeURIComponent(unifiedPrompt)}`;

        // Display the premium toast notification
        const toast = document.createElement('div');
        toast.className = 'ai-external-toast';
        toast.innerHTML = `
          <div class="ai-external-toast-header">
            <span class="ai-toast-success-icon">🚀</span>
            <span>Sending to ${info.name}!</span>
          </div>
          <div class="ai-external-toast-body">
            📋 Prompt & GitHub Link copied to clipboard.<br>
            Opening <strong>${info.name}</strong> now...<br>
            <div style="margin-top: 8px; font-weight: bold; color: var(--ai-primary);">
              ⚡ <strong>Prompt is auto-filled and running automatically!</strong>
            </div>
          </div>
        `;
        document.body.appendChild(toast);

        // Animate out and remove after 3.8s
        setTimeout(() => {
          toast.classList.add('hide');
          setTimeout(() => toast.remove(), 300);
        }, 3800);

        // Open website in new tab after 1.2s
        setTimeout(() => {
          window.open(targetUrl, '_blank');
        }, 1200);

      } catch (err) {
        showModeError(toolbar, '⚠️ Failed to prepare external redirect. Please allow clipboard permissions.');
        console.error('External redirect failed:', err);
      }
      return;
    }

    const creds = getCredentials();
    if (!creds.apiKey) {
      showModeError(toolbar, '⚠️ Please configure your API key first via the ✨ AI Assistant panel at the bottom of the sidebar.');
      return;
    }

    // Disable all mode buttons during loading
    toolbar.querySelectorAll('.ai-mode-btn, .ai-mode-custom-btn').forEach(b => {
      b.disabled = true;
      b.classList.remove('active');
    });

    const clickedBtn = toolbar.querySelector(`.ai-mode-btn[data-mode="${mode.label}"]`);
    if (clickedBtn) {
      clickedBtn.classList.add('active', 'loading');
      clickedBtn.innerHTML = `⚡ <span>Rewriting...</span>`;
    }

    // Show full-page overlay
    const overlay = document.createElement('div');
    overlay.className = 'ai-mode-overlay';
    overlay.innerHTML = `
      <div class="ai-mode-overlay-inner">
        <div class="ai-mode-overlay-icon">${mode.icon}</div>
        <div class="ai-mode-overlay-title">Rewriting in <em>${mode.label}</em> mode…</div>
        <div class="ai-shimmer-bar"><div class="ai-shimmer-fill"></div></div>
      </div>
    `;
    article.appendChild(overlay);

    try {
      const pageText = _originalArticleHTML
        ? new DOMParser().parseFromString(_originalArticleHTML, 'text/html').body.innerText
        : article.innerText;

      const systemPrompt = `You are an expert educator and content rewriter for the "Tools in Data Science" course.
You will receive the full text of a documentation page and a rewriting instruction.
Produce a COMPLETE rewritten version as a single, well-structured Markdown document.
Rules:
- Start with the original page title as a # heading
- Do NOT include any preamble like "Here is the rewritten version" — just output the Markdown
- Always maintain technical accuracy
- Use proper Markdown formatting: headers, bullet lists, code blocks with language hints, bold, etc.
- Keep all code examples accurate and runnable`;

      const userPrompt = `${mode.prompt}

Original page content:
---
${pageText}
---

Now produce the complete rewritten Markdown:`;

      const newMarkdown = await callLLM(userPrompt, systemPrompt);
      let newHTML = compileMarkdown(newMarkdown);

      // Always append the Virtual TA widget at the end of the newly rewritten content
      newHTML += `
<hr>
<h2 id="ask-the-ai-assistant">💬 Ask the AI Assistant</h2>
<p>Have questions about this newly rewritten guide? Ask our virtual Teaching Assistant below!</p>
<ai-widget prompt="Explain key concepts or solve questions related to the rewritten guide above." button="✨ Ask Virtual TA" placeholder="Ask a question about this guide..."></ai-widget>
      `;

      // Preserve toolbar HTML
      const toolbarHTML = toolbar.outerHTML;

      // Replace article content
      article.innerHTML = newHTML;

      // Re-inject toolbar (since innerHTML was replaced)
      const newH1 = article.querySelector('h1');
      const newToolbar = document.createElement('div');
      newToolbar.className = 'ai-mode-toolbar';
      newToolbar.setAttribute('data-mounted', '1');
      newToolbar.innerHTML = toolbarHTML;

      // Re-build toolbar from scratch to re-attach events
      mountReadingToolbar();
      mountWidgets();
      renderMermaidBlocks();

      // Show restore bar
      const restoreBar = document.createElement('div');
      restoreBar.className = 'ai-mode-restore-bar';
      restoreBar.innerHTML = `
        <span>📄 Showing <strong>${mode.icon} ${mode.label}</strong> version</span>
        <button class="ai-mode-restore-btn">↩ Restore Original</button>
      `;

      const restoreBtn = restoreBar.querySelector('.ai-mode-restore-btn');
      restoreBtn.addEventListener('click', () => {
        article.innerHTML = _originalArticleHTML;
        mountReadingToolbar();
        mountWidgets();
        renderMermaidBlocks();
        if (window.Prism) window.Prism.highlightAllUnder(article);
      });

      const finalH1 = article.querySelector('h1');
      if (finalH1) finalH1.after(restoreBar);

      // Apply Prism syntax highlighting
      if (window.Prism) window.Prism.highlightAllUnder(article);

    } catch (err) {
      overlay.remove();
      // Re-enable toolbar
      const currentToolbar = article.querySelector('.ai-mode-toolbar');
      if (currentToolbar) {
        currentToolbar.querySelectorAll('.ai-mode-btn, .ai-mode-custom-btn').forEach(b => {
          b.disabled = false;
          b.classList.remove('loading', 'active');
        });
        READING_MODES.forEach((m) => {
          const b = currentToolbar.querySelector(`.ai-mode-btn[data-mode="${m.label}"]`);
          if (b) b.innerHTML = `${m.icon} <span>${m.label}</span>`;
        });
        showModeError(currentToolbar, `❌ ${err.message}`);
      }
    }
  }

  function showModeError(toolbar, msg) {
    let errEl = toolbar.querySelector('.ai-mode-error');
    if (!errEl) {
      errEl = document.createElement('div');
      errEl.className = 'ai-mode-error';
      toolbar.appendChild(errEl);
    }
    errEl.textContent = msg;
    errEl.classList.remove('hidden');
    setTimeout(() => errEl.classList.add('hidden'), 6000);
  }

  // Render mermaid blocks to diagrams
  function renderMermaidBlocks() {
    if (typeof mermaid === 'undefined') return;

    // Find pre elements containing mermaid class/data or inner code elements with mermaid
    const blocks = document.querySelectorAll('pre[data-lang="mermaid"], pre code.language-mermaid, pre code.lang-mermaid');

    let renderedAny = false;
    blocks.forEach((block) => {
      const preEl = block.tagName === 'PRE' ? block : block.closest('pre');
      if (!preEl || preEl.classList.contains('mermaid-rendered')) return;

      const code = preEl.textContent.trim();
      if (!code) return;

      // Create rendering target container
      const div = document.createElement('div');
      div.className = 'mermaid';
      div.textContent = code;

      preEl.classList.add('mermaid-rendered');
      preEl.replaceWith(div);
      renderedAny = true;
    });

    if (renderedAny) {
      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: document.body.classList.contains('dark') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'default',
          securityLevel: 'loose'
        });
        mermaid.init(undefined, document.querySelectorAll('.mermaid:not([data-processed="true"])'));
      } catch (err) {
        console.error('Mermaid render error:', err);
      }
    }
  }

  // ─── Register Docsify Plugin ──────────────────────────────────────────────

  window.resizableSidebar = window.resizableSidebar || function () { }; // preserve existing

  function docsifyAIPlugin(hook, vm) {
    hook.doneEach(() => {
      injectSidebarUI();
      mountWidgets();
      mountReadingToolbar();
      renderMermaidBlocks();
    });
  }

  // Append plugin safely to existing window.$docsify.plugins array
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], [docsifyAIPlugin]);

})();

