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
    },
    {
      icon: '🎥',
      label: 'Video Explanation (Veo)',
      prompt: 'Create a cinematic educational video explanation concept. You MUST write your response in JSON format. Provide detailed scene visual prompt descriptions that can be sent to Google Veo, followed by a voiceover narration script. Response MUST be a single JSON object containing: \n{\n  "concept": "Core concept name",\n  "video_prompt": "Cinematic visual generation prompt for Google Veo (e.g. 3D high quality motion graphics showing...)",\n  "narration": "A highly engaging professional narration explanation in 3 to 4 clear sentences.",\n  "subtitles": [\n    "First sentence of the narration.",\n    "Second sentence of the narration.",\n    "Third sentence of the narration.",\n    "Fourth sentence of the narration."\n  ],\n  "key_points": ["First key takeaway", "Second key takeaway", "Third key takeaway"]\n}'
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

  // Interactive voice and scene animation setup for the Google Veo simulated player
  function setupVeoPlayer(subtitles, narration, veoData) {
    const playBtn = document.getElementById('veo-play-btn');
    const voiceBtn = document.getElementById('veo-voice-btn');
    const canvas = document.getElementById('veo-canvas');
    const progress = document.getElementById('veo-progress');
    const timeEl = document.getElementById('veo-time');
    const subtitlesEl = document.getElementById('veo-subtitles');
    const orbLabel = document.getElementById('veo-orb-label');

    if (!playBtn) return;

    let isPlaying = false;
    let voiceOn = true;
    let subtitleIndex = -1;
    let synth = window.speechSynthesis;
    let intervalId = null;

    voiceBtn.addEventListener('click', () => {
      voiceOn = !voiceOn;
      voiceBtn.textContent = voiceOn ? '🔊 Voice: On' : '🔇 Voice: Off';
      voiceBtn.classList.toggle('muted', !voiceOn);
      if (!voiceOn && synth && synth.speaking) {
        synth.cancel();
      }
    });

    playBtn.addEventListener('click', () => {
      if (isPlaying) {
        stopPlayback();
      } else {
        startPlayback();
      }
    });

    function stopPlayback() {
      isPlaying = false;
      playBtn.textContent = '▶ Play Video';
      playBtn.classList.remove('playing');
      canvas.className = 'ai-video-canvas';
      orbLabel.textContent = 'PAUSED';
      if (synth) synth.cancel();
      clearInterval(intervalId);
      progress.style.width = '0%';
      timeEl.textContent = '0:00 / 0:06';
    }

    function startPlayback() {
      isPlaying = true;
      playBtn.textContent = '⏸ Pause Video';
      playBtn.classList.add('playing');
      canvas.className = 'ai-video-canvas playing';
      orbLabel.textContent = 'GENERATING VEO VIDEO...';

      let durationSec = 6;
      let elapsedMs = 0;
      let tickRateMs = 100;
      subtitleIndex = -1;

      // Create high-end dynamic illustration layers inside the canvas
      canvas.innerHTML = `
        <div class="veo-scene-container" style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; overflow: hidden; width: 100%; height: 100%;">
          <svg id="veo-svg-canvas" viewBox="0 0 800 400" style="width: 100%; height: 100%; max-height: 380px;">
            <defs>
              <linearGradient id="grid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#4facfe" stop-opacity="0.2"/>
                <stop offset="100%" stop-color="#00f2fe" stop-opacity="0.0"/>
              </linearGradient>
              <linearGradient id="accent-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#ff0844"/>
                <stop offset="100%" stop-color="#ffb199"/>
              </linearGradient>
              <linearGradient id="accent-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#f12711"/>
                <stop offset="100%" stop-color="#f5af19"/>
              </linearGradient>
              <linearGradient id="node-grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stop-color="#1e3c72"/>
                <stop offset="100%" stop-color="#2a5298"/>
              </linearGradient>
            </defs>
            <!-- Animated scanlines grid background -->
            <rect width="800" height="400" fill="url(#grid-grad)" />
            <g id="veo-dynamic-shapes"></g>
          </svg>
          <div class="ai-video-orb-label" id="veo-orb-label" style="position: absolute; top: 15px; left: 20px; z-index: 10; font-size: 0.8rem; letter-spacing: 2px;">VEO CINEMATIC GENERATION</div>
        </div>
      `;

      const svgGroup = document.getElementById('veo-dynamic-shapes');
      const label = document.getElementById('veo-orb-label');

      intervalId = setInterval(() => {
        elapsedMs += tickRateMs;
        let percent = (elapsedMs / (durationSec * 1000)) * 100;
        if (percent >= 100) {
          percent = 100;
          stopPlayback();
          subtitlesEl.textContent = 'Video complete. Click Play to watch again!';
          label.textContent = 'COMPLETED';
        } else {
          progress.style.width = `${percent}%`;
          let currentSec = (elapsedMs / 1000).toFixed(0);
          timeEl.textContent = `0:0${currentSec} / 0:0${durationSec}`;

          let step = (durationSec * 1000) / subtitles.length;
          let idx = Math.floor(elapsedMs / step);
          if (idx !== subtitleIndex && idx < subtitles.length) {
            subtitleIndex = idx;
            subtitlesEl.textContent = subtitles[subtitleIndex];
            label.textContent = `SCENE ${subtitleIndex + 1}: ${veoData.concept || 'Concept'}`;
            
            // Render beautiful dynamically generated vector diagrams and scenes based on technical themes
            if (subtitleIndex === 0) {
              // Scene 1: Concept Introduction - Floating technical structures representing components
              svgGroup.innerHTML = `
                <g style="animation: float 4s infinite ease-in-out;">
                  <!-- Main Core Hub -->
                  <circle cx="400" cy="180" r="55" fill="url(#node-grad)" stroke="#00f2fe" stroke-width="3" filter="drop-shadow(0px 0px 20px rgba(0, 242, 254, 0.6))" />
                  <text x="400" y="185" fill="#fff" font-size="14" font-weight="bold" text-anchor="middle">${(veoData.concept || 'CORE').substring(0, 12)}</text>
                  
                  <!-- Satellites -->
                  <path d="M 400 180 L 260 120" stroke="#4facfe" stroke-width="2" stroke-dasharray="5 5" />
                  <path d="M 400 180 L 540 120" stroke="#4facfe" stroke-width="2" stroke-dasharray="5 5" />
                  <path d="M 400 180 L 400 280" stroke="#4facfe" stroke-width="2" stroke-dasharray="5 5" />

                  <circle cx="260" cy="120" r="28" fill="#111" stroke="#ff0844" stroke-width="2" />
                  <text x="260" y="124" fill="#ffb199" font-size="10" font-weight="bold" text-anchor="middle">INPUT</text>

                  <circle cx="540" cy="120" r="28" fill="#111" stroke="#38ef7d" stroke-width="2" />
                  <text x="540" y="124" fill="#38ef7d" font-size="10" font-weight="bold" text-anchor="middle">OUTPUT</text>

                  <circle cx="400" cy="280" r="28" fill="#111" stroke="#f5af19" stroke-width="2" />
                  <text x="400" y="284" fill="#f5af19" font-size="10" font-weight="bold" text-anchor="middle">FLOW</text>
                </g>
              `;
            } else if (subtitleIndex === 1) {
              // Scene 2: Detailed connection workflow / pipeline flow
              svgGroup.innerHTML = `
                <g>
                  <!-- Flow path -->
                  <path d="M 100 200 C 250 80, 550 320, 700 200" fill="none" stroke="#00f2fe" stroke-width="4" stroke-linecap="round" />
                  
                  <!-- Flow pulse -->
                  <circle cx="400" cy="200" r="14" fill="#fff" filter="drop-shadow(0 0 15px #00f2fe)">
                    <animate attributeName="cx" values="100;700" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="cy" values="200;120;280;200" dur="2s" repeatCount="indefinite" />
                  </circle>

                  <!-- Stage Cards -->
                  <rect x="180" y="100" width="120" height="45" rx="8" fill="#111" stroke="#4facfe" stroke-width="2" />
                  <text x="240" y="127" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">1. PROCESS</text>

                  <rect x="480" y="240" width="120" height="45" rx="8" fill="#111" stroke="#ff0844" stroke-width="2" />
                  <text x="540" y="267" fill="#fff" font-size="11" font-weight="bold" text-anchor="middle">2. VALIDATE</text>
                </g>
              `;
            } else {
              // Scene 3: Structural final state / System balance
              svgGroup.innerHTML = `
                <g style="animation: pulse-spin 12s infinite linear;">
                  <!-- Concentric circles -->
                  <circle cx="400" cy="200" r="110" fill="none" stroke="rgba(0, 242, 254, 0.2)" stroke-width="2" stroke-dasharray="10 10" />
                  <circle cx="400" cy="200" r="70" fill="none" stroke="rgba(255, 88, 88, 0.2)" stroke-width="2" />

                  <!-- Balanced Core -->
                  <circle cx="400" cy="200" r="35" fill="url(#accent-grad-1)" filter="drop-shadow(0 0 25px rgba(255, 8, 68, 0.5))" />
                  
                  <!-- Rotating nodes -->
                  <circle cx="290" cy="200" r="16" fill="#111" stroke="#38ef7d" stroke-width="2" />
                  <circle cx="510" cy="200" r="16" fill="#111" stroke="#4facfe" stroke-width="2" />
                  <circle cx="400" cy="90" r="16" fill="#111" stroke="#f5af19" stroke-width="2" />
                  <circle cx="400" cy="310" r="16" fill="#111" stroke="#fc67fa" stroke-width="2" />
                </g>
              `;
            }

            if (voiceOn && synth) {
              synth.cancel();
              const utterance = new SpeechSynthesisUtterance(subtitles[subtitleIndex]);
              const voices = synth.getVoices();
              const engVoice = voices.find(v => v.lang.includes('en'));
              if (engVoice) utterance.voice = engVoice;
              utterance.rate = 1.05;
              synth.speak(utterance);
            }
          }
        }
      }, tickRateMs);
    }
  }

  async function handleModeTransform(mode, toolbar) {
    const article = document.querySelector('article.markdown-section');
    if (!article) return;

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
      let newHTML = '';
      let veoSubtitles = [];
      let veoNarration = '';

      if (mode.label === 'Video Explanation (Veo)') {
        let veoData = {};
        try {
          veoData = extractJSON(newMarkdown);
        } catch (e) {
          veoData = {
            concept: 'Concept Overview',
            video_prompt: 'High quality cinematic 3D graphics showing technical components working together smoothly.',
            narration: 'This guide covers essential technical components. Let\'s explore how they link together to form a highly integrated developer workflow.',
            subtitles: [
              'This guide covers essential technical components.',
              'Let\'s explore how they link together to form a highly integrated developer workflow.'
            ],
            key_points: ['Core concepts mapped clearly', 'Practical step-by-step illustrations', 'Runnable examples included']
          };
        }

        const conceptTitle = veoData.concept || 'Concept Video';
        const videoPrompt = veoData.video_prompt || 'Educational 3D concept animation.';
        veoNarration = veoData.narration || '';
        veoSubtitles = veoData.subtitles || [veoNarration];
        const keyPoints = veoData.key_points || [];

        newHTML = `
          <h1>🎥 ${conceptTitle}</h1>
          <div class="ai-video-player-app">
            <h2>🎥 Google Veo Educational Video</h2>
            
            <div class="ai-video-card">
              <div class="ai-video-screen">
                <div class="ai-video-canvas" id="veo-canvas">
                  <div class="ai-video-sphere"></div>
                  <div class="ai-video-orb-label" id="veo-orb-label">READY TO GENERATE</div>
                </div>
                
                <div class="ai-video-subtitles" id="veo-subtitles">Click Play to generate explanation video with audio...</div>
              </div>
              
              <div class="ai-video-controls">
                <button class="ai-video-control-btn play-btn" id="veo-play-btn">▶ Play Video</button>
                <button class="ai-video-control-btn voice-btn" id="veo-voice-btn">🔊 Voice: On</button>
                <div class="ai-video-progress-container">
                  <div class="ai-video-progress-bar" id="veo-progress"></div>
                </div>
                <span class="ai-video-time" id="veo-time">0:00 / 0:06</span>
              </div>
            </div>

            <div class="ai-video-details">
              <h3>📝 Google Veo Visual Prompt</h3>
              <p class="ai-video-prompt-text">${videoPrompt}</p>
              
              <h3>💡 Narrator Audio Script</h3>
              <blockquote class="ai-video-script-text">${veoNarration}</blockquote>

              <h3>🔍 Key Visual Takeaways</h3>
              <ul class="ai-video-mappings-list">
                ${keyPoints.map(pt => `<li>${pt}</li>`).join('')}
              </ul>
            </div>
          </div>
        `;
      } else {
        newHTML = compileMarkdown(newMarkdown);
      }

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

      // Set up Veo video player events
      if (mode.label === 'Video Explanation (Veo)') {
        setupVeoPlayer(veoSubtitles, veoNarration, veoData);
      }

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

