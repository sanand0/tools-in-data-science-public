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
      <div class="ai-mode-destination-options">
        <label class="ai-destination-option" title="Rewrite and transform this guide directly inside this browser tab.">
          <input type="radio" name="ai-destination" value="inline" ${savedDest === 'inline' ? 'checked' : ''}>
          <span>✨ In-Page Inline (Usual)</span>
        </label>
        <label class="ai-destination-option" title="Open an external AI website (e.g. ChatGPT, Claude) with the rewritten prompt and code automatically copied.">
          <input type="radio" name="ai-destination" value="external" ${savedDest === 'external' ? 'checked' : ''}>
          <span>🚀 Send to External AI Chat</span>
        </label>
      </div>
      <div class="ai-external-provider-select-group ${savedDest === 'external' ? '' : 'hidden'}" id="aiExternalProviderSelectGroup">
        <label for="aiExternalProvider">Select Website:</label>
        <select id="aiExternalProvider">
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

  // Safe JSON extraction helper
  function extractJSON(str) {
    try {
      const match = str.match(/```json\s*([\s\S]*?)\s*```/) || str.match(/```\s*([\s\S]*?)\s*```/);
      const jsonStr = match ? match[1] : str;
      return JSON.parse(jsonStr.trim());
    } catch (e) {
      console.warn('JSON direct parse failed, trying regex cleanup...', e);
      try {
        const clean = str.replace(/^[^{\[]+/g, '').replace(/[^}\]]+$/g, '');
        return JSON.parse(clean);
      } catch (err) {
        throw new Error('Failed to parse JSON explanation from video model.');
      }
    }
  }

  // Presentation slide deck player with high-quality AI/Hybrid voiceover
  function setupPresentationPlayer(presData) {
    const container = document.getElementById('pres-player');
    if (!container) return;

    const slides = presData.slides || [];
    if (!slides.length) return;

    let currentSlide = 0;
    let isPlaying = false;
    let voiceOn = true;
    let synth = window.speechSynthesis;
    let currentAudio = null; // Standard HTML5 Audio element
    let autoTimer = null; // Timeout reference for auto-advancing

    const slideArea = container.querySelector('.pres-slide-area');
    const prevBtn = container.querySelector('#pres-prev');
    const nextBtn = container.querySelector('#pres-next');
    const playBtn = container.querySelector('#pres-play');
    const voiceBtn = container.querySelector('#pres-voice');
    const slideCounter = container.querySelector('#pres-counter');
    const progressBar = container.querySelector('#pres-progress-fill');
    const thumbStrip = container.querySelector('.pres-thumb-strip');

    // Gradient palette for slide backgrounds
    const gradients = [
      'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)',
      'linear-gradient(135deg, #0d1117, #161b22, #21262d)',
      'linear-gradient(135deg, #1b1b2f, #162447, #1f4068)',
      'linear-gradient(135deg, #0a0a23, #1b1b32, #2a2a4a)',
      'linear-gradient(135deg, #141e30, #243b55, #141e30)',
      'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
      'linear-gradient(135deg, #1c1c3c, #2d2d5e, #1c1c3c)'
    ];

    // Build thumbnail strip
    slides.forEach((s, i) => {
      const thumb = document.createElement('button');
      thumb.className = 'pres-thumb' + (i === 0 ? ' active' : '');
      thumb.textContent = s.icon || (i + 1);
      thumb.title = s.heading;
      thumb.addEventListener('click', () => goToSlide(i));
      thumbStrip.appendChild(thumb);
    });

    // Helper: Split text into chunks to respect Translate limits
    function chunkText(text, maxLength) {
      const words = text.split(' ');
      const chunks = [];
      let currentChunk = '';

      words.forEach(word => {
        if ((currentChunk + ' ' + word).length > maxLength) {
          chunks.push(currentChunk.trim());
          currentChunk = word;
        } else {
          currentChunk += ' ' + word;
        }
      });
      if (currentChunk) {
        chunks.push(currentChunk.trim());
      }
      return chunks.filter(c => c.length > 0);
    }

    // Helper: Stop all current narration (both HTML5 Audio and browser speechSynthesis)
    function stopNarration() {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.src = '';
        currentAudio = null;
      }
      if (synth && synth.speaking) {
        synth.cancel();
      }
      const narrationBar = slideArea.querySelector('.pres-narration-bar');
      if (narrationBar) {
        narrationBar.classList.remove('speaking');
      }
    }

    // Play browser built-in fallback speech
    function playBrowserSpeech(text, onEnded) {
      if (!voiceOn || !synth) {
        if (onEnded) onEnded();
        return;
      }
      synth.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      const voices = synth.getVoices();
      const eng = voices.find(v => v.lang.startsWith('en'));
      if (eng) utter.voice = eng;
      utter.rate = 0.95;
      utter.pitch = 1.0;
      utter.addEventListener('end', () => {
        if (onEnded) onEnded();
      });
      utter.addEventListener('error', () => {
        if (onEnded) onEnded();
      });
      synth.speak(utter);
    }

    // Play high quality Google Translate TTS in sequential chunks
    function playFallbackTTS(text, onEnded) {
      if (!voiceOn) {
        if (onEnded) onEnded();
        return;
      }

      try {
        const chunks = chunkText(text, 160);
        let chunkIndex = 0;

        function playNextChunk() {
          if (!voiceOn) return;
          if (chunkIndex >= chunks.length) {
            if (onEnded) onEnded();
            return;
          }

          const chunkTextStr = chunks[chunkIndex++];
          const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encodeURIComponent(chunkTextStr)}`;

          currentAudio = new Audio(ttsUrl);
          currentAudio.addEventListener('ended', playNextChunk);
          currentAudio.addEventListener('error', (e) => {
            console.warn('Google Translate TTS chunk failed, falling back to browser Speech...', e);
            // Fall back immediately to browser speech for the remainder of the sentence
            const remainingText = chunks.slice(chunkIndex - 1).join(' ');
            playBrowserSpeech(remainingText, onEnded);
          });

          currentAudio.play().catch(err => {
            console.warn('Audio play blocked/failed, trying browser Speech...', err);
            const remainingText = chunks.slice(chunkIndex - 1).join(' ');
            playBrowserSpeech(remainingText, onEnded);
          });
        }

        playNextChunk();

      } catch (e) {
        console.warn('Fallback TTS failed, using browser Speech...', e);
        playBrowserSpeech(text, onEnded);
      }
    }

    // Play slide narration: try API provider first, then high-quality Google fallback, then local speech
    async function playSlideNarration(text, onEnded) {
      if (!voiceOn) {
        if (onEnded) onEnded();
        return;
      }

      const creds = getCredentials();
      // We skip AIPipe's chat completions endpoint as it fails for raw binary audio (returns pricing unknown)
      const isAIPipe = creds.provider === 'aipipe';
      const hasKey = !!creds.apiKey;

      if (hasKey && !isAIPipe) {
        try {
          let url = creds.baseUrl;
          if (url.endsWith('/chat/completions')) {
            url = url.replace(/\/chat\/completions$/, '/audio/speech');
          } else {
            url = url.replace(/\/$/, '') + '/audio/speech';
          }

          const model = creds.provider === 'openai' ? 'tts-1' : 'openai/tts-1';

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${creds.apiKey}`
            },
            body: JSON.stringify({
              model: model,
              input: text,
              voice: 'alloy'
            })
          });

          if (response.ok) {
            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            currentAudio = new Audio(audioUrl);
            currentAudio.addEventListener('ended', () => {
              URL.revokeObjectURL(audioUrl);
              if (onEnded) onEnded();
            });
            currentAudio.addEventListener('error', (e) => {
              URL.revokeObjectURL(audioUrl);
              console.warn('API TTS loaded but failed to play, trying fallback...', e);
              playFallbackTTS(text, onEnded);
            });
            await currentAudio.play();
            return;
          } else {
            const errText = await response.text();
            console.warn(`AI Provider TTS returned status ${response.status}: ${errText}`);
          }
        } catch (e) {
          console.warn('AI Provider TTS failed, trying high-quality fallback...', e);
        }
      }

      // If AI provider is not openrouter/openai, or failed, use high quality Google Translate fallback
      playFallbackTTS(text, onEnded);
    }

    function renderSlide(idx) {
      const slide = slides[idx];
      const grad = gradients[idx % gradients.length];
      const bulletsHTML = (slide.bullets || []).map((b, bi) =>
        `<li class="pres-bullet" style="animation-delay: ${0.3 + bi * 0.15}s">${b}</li>`
      ).join('');

      slideArea.innerHTML = `
        <div class="pres-slide" style="background: ${grad}">
          <div class="pres-slide-number">SLIDE ${idx + 1} / ${slides.length}</div>
          <div class="pres-slide-icon">${slide.icon || '📌'}</div>
          <h2 class="pres-slide-heading">${slide.heading || ''}</h2>
          <ul class="pres-bullet-list">${bulletsHTML}</ul>
          <div class="pres-narration-bar">
            <span class="pres-narration-icon">🎙️</span>
            <span class="pres-narration-text">${slide.narration || ''}</span>
          </div>
        </div>
      `;

      // Update counter and progress
      slideCounter.textContent = `${idx + 1} / ${slides.length}`;
      progressBar.style.width = `${((idx + 1) / slides.length) * 100}%`;

      // Update thumbnails
      thumbStrip.querySelectorAll('.pres-thumb').forEach((t, i) => {
        t.classList.toggle('active', i === idx);
      });

      // Update button states
      prevBtn.disabled = idx === 0;
      nextBtn.disabled = idx === slides.length - 1;

      // Stop any existing timers & speech
      clearTimeout(autoTimer);
      stopNarration();

      // Trigger high-quality speech narration
      if (voiceOn && slide.narration) {
        const narrationBar = slideArea.querySelector('.pres-narration-bar');
        if (narrationBar) {
          narrationBar.classList.add('speaking');
        }

        playSlideNarration(slide.narration, () => {
          if (narrationBar) {
            narrationBar.classList.remove('speaking');
          }
          // Narration completed! If Auto Play is enabled, wait 1.5 seconds, then auto-advance
          if (isPlaying) {
            autoTimer = setTimeout(autoAdvance, 1500);
          }
        });
      } else {
        // If Voice is disabled and Auto Play is enabled, use standard 8-second timer
        if (isPlaying) {
          autoTimer = setTimeout(autoAdvance, 8000);
        }
      }
    }

    function goToSlide(idx) {
      if (idx < 0 || idx >= slides.length) return;
      currentSlide = idx;
      renderSlide(idx);
    }

    function autoAdvance() {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        renderSlide(currentSlide);
      } else {
        stopAutoPlay();
      }
    }

    function startAutoPlay() {
      isPlaying = true;
      playBtn.textContent = '⏸ Pause';
      playBtn.classList.add('playing');

      if (currentSlide >= slides.length - 1) {
        currentSlide = 0;
        renderSlide(0);
      } else {
        renderSlide(currentSlide);
      }
    }

    function stopAutoPlay() {
      isPlaying = false;
      playBtn.textContent = '▶ Auto Play';
      playBtn.classList.remove('playing');
      clearTimeout(autoTimer);
      stopNarration();
    }

    prevBtn.addEventListener('click', () => {
      stopAutoPlay();
      goToSlide(currentSlide - 1);
    });

    nextBtn.addEventListener('click', () => {
      stopAutoPlay();
      goToSlide(currentSlide + 1);
    });

    playBtn.addEventListener('click', () => {
      if (isPlaying) stopAutoPlay();
      else startAutoPlay();
    });

    voiceBtn.addEventListener('click', () => {
      voiceOn = !voiceOn;
      voiceBtn.textContent = voiceOn ? '🔊 Voice On' : '🔇 Voice Off';
      if (!voiceOn) {
        stopNarration();
        // If auto play is running, reset timer to standard 8-second interval since narration stopped
        if (isPlaying) {
          clearTimeout(autoTimer);
          autoTimer = setTimeout(autoAdvance, 8000);
        }
      } else {
        // Voice turned back on, trigger narration for current slide
        renderSlide(currentSlide);
      }
    });

    // Keyboard navigation
    const keyHandler = (e) => {
      if (!container.closest('article')) return;
      if (e.key === 'ArrowRight') { stopAutoPlay(); goToSlide(currentSlide + 1); }
      if (e.key === 'ArrowLeft') { stopAutoPlay(); goToSlide(currentSlide - 1); }
      if (e.key === ' ') { e.preventDefault(); isPlaying ? stopAutoPlay() : startAutoPlay(); }
    };
    document.addEventListener('keydown', keyHandler);

    // Clean up event listener when player is removed from DOM
    const observer = new MutationObserver((mutations, obs) => {
      if (!document.getElementById('pres-player')) {
        document.removeEventListener('keydown', keyHandler);
        stopNarration();
        clearTimeout(autoTimer);
        obs.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Render first slide
    renderSlide(0);
  }

  async function fetchCurrentPageMarkdown() {
    try {
      const hash = window.location.hash || '#/';
      let path = hash.replace(/^#/, '');
      if (path === '/' || path === '') {
        path = '/README';
      }

      // Construct the absolute path to the local markdown file
      const mdUrl = window.location.origin + window.location.pathname.replace(/\/$/, '') + path + '.md';

      const response = await fetch(mdUrl);
      if (response.ok) {
        return await response.text();
      }
    } catch (e) {
      console.warn('Failed to fetch raw markdown via path, using fallback', e);
    }

    // Fallback: use DOM text
    const article = document.querySelector('article.markdown-section');
    return article ? article.innerText : '';
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

        const GITHUB_REPO_BASE = 'https://raw.githubusercontent.com/sanand0/tools-in-data-science-public/t2-26';
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

