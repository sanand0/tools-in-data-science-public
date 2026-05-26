/**
 * Docsify AI Assistant Plugin
 * Highly interactive, premium AI integration for Docsify.
 * Includes sidebar configuration panel and inline markdown widgets.
 */

(function () {
  // Config presets for providers
  const PROVIDERS = {
    aipipe: {
      name: 'AIPipe',
      baseUrl: 'https://aipipe.org/openrouter/v1',
      model: 'google/gemini-3.5-flash',
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
      } catch (e) {}
    }
    return [
      'google/gemini-3.5-flash',
      'google/gemini-3.1-flash-lite',
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
      if (typeof window.marked === 'function') {
        return window.marked(markdown);
      } else if (window.marked.parse) {
        return window.marked.parse(markdown);
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

  // Register Docsify plugin
  window.resizableSidebar = window.resizableSidebar || function () { }; // preserve existing

  function docsifyAIPlugin(hook, vm) {
    // Inject sidebar UI on ready/doneEach to ensure elements are fully painted
    hook.doneEach(() => {
      // Injects Sidebar controls
      injectSidebarUI();
      // Setup markdown widgets
      mountWidgets();
    });
  }

  // Append plugin safely to existing window.$docsify.plugins array
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], [docsifyAIPlugin]);

})();
