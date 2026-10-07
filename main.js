/**
 * Portfolio JavaScript
 * Handles:
 * 1. Night Mode Toggle (Media Query auto-detect + localStorage manual override)
 * 2. Vertical Navigation Bar (Mobile toggle drawer, backdrop, keyboard a11y)
 * 3. Active Link Scroll-Spy (Highlights current section with pixel indicator)
 */

document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 1. THEME MANAGEMENT (NIGHT MODE)
    // ----------------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('.theme-icon') : null;
    const themeText = themeToggleBtn ? themeToggleBtn.querySelector('.theme-toggle-text') : null;

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function getSavedThemePreference() {
        return localStorage.getItem('theme-preference');
    }

    function applyTheme(theme) {
        const isDark = theme === 'dark';
        document.documentElement.setAttribute('data-theme', theme);

        if (themeIcon) themeIcon.textContent = isDark ? '☀️' : '🌙';
        if (themeText) themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        if (themeToggleBtn) {
            themeToggleBtn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Night Mode');
        }
        if (themeToggleMobile) {
            themeToggleMobile.textContent = isDark ? '☀️' : '🌙';
            themeToggleMobile.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Night Mode');
        }
    }

    // Toggle theme handler
    function toggleCurrentTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 
                             (darkModeMediaQuery.matches ? 'dark' : 'light');
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        localStorage.setItem('theme-preference', nextTheme);
        applyTheme(nextTheme);
    }

    // Init theme
    const savedTheme = getSavedThemePreference();
    if (savedTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(darkModeMediaQuery.matches ? 'dark' : 'light');
    }

    // System theme change listener
    darkModeMediaQuery.addEventListener('change', (e) => {
        if (!getSavedThemePreference()) {
            applyTheme(e.matches ? 'dark' : 'light');
        }
    });

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleCurrentTheme);
    }
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleCurrentTheme);
    }

    // ----------------------------------------------------
    // 2. RESPONSIVE VERTICAL NAVBAR DRAWER (A11Y)
    // ----------------------------------------------------
    const navbar = document.getElementById('vertical-navbar');
    const toggleBtn = document.getElementById('navbar-toggle-btn');
    const closeBtn = document.getElementById('navbar-close-btn');
    const backdrop = document.getElementById('navbar-backdrop');
    const navLinks = document.querySelectorAll('.vertical-nav-link');

    function openMobileNavbar() {
        if (navbar && backdrop && toggleBtn) {
            navbar.classList.add('open');
            backdrop.classList.add('active');
            toggleBtn.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            if (closeBtn) closeBtn.focus();
        }
    }

    function closeMobileNavbar() {
        if (navbar && backdrop && toggleBtn) {
            navbar.classList.remove('open');
            backdrop.classList.remove('active');
            toggleBtn.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    }

    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            const isOpen = navbar && navbar.classList.contains('open');
            if (isOpen) {
                closeMobileNavbar();
            } else {
                openMobileNavbar();
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeMobileNavbar();
            if (toggleBtn) toggleBtn.focus();
        });
    }

    if (backdrop) {
        backdrop.addEventListener('click', closeMobileNavbar);
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navbar && navbar.classList.contains('open')) {
            closeMobileNavbar();
            if (toggleBtn) toggleBtn.focus();
        }
    });

    // Close drawer when a nav link is clicked
    navLinks.forEach((link) => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                closeMobileNavbar();
            }
        });
    });

    // ----------------------------------------------------
    // 3. SCROLL-SPY: ACTIVE LINK TRACKING
    // ----------------------------------------------------
    const trackedSections = document.querySelectorAll('main > section[id]');

    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 180;

        trackedSections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach((link) => {
                    const linkTarget = link.getAttribute('data-nav') || link.getAttribute('href').replace('#', '');
                    if (linkTarget === sectionId) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'page');
                    } else {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink, { passive: true });
    updateActiveNavLink();

    // ----------------------------------------------------
    // 4. TIMELINE CATEGORY FILTERING
    // ----------------------------------------------------
    const timelineFilterBtns = document.querySelectorAll('.timeline-filter-btn');
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineFilterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Update active state on buttons
            timelineFilterBtns.forEach((b) => {
                b.classList.remove('active');
                b.setAttribute('aria-selected', 'false');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');

            // Filter timeline items
            timelineItems.forEach((item) => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.classList.remove('hidden');
                } else {
                    item.classList.add('hidden');
                }
            });
        });
    });

    // ----------------------------------------------------
    // 5. INTERACTIVE AI CHAT ASSISTANT
    // Simulates conversational responses with Vikranth's persona
    // Includes hook for real LLM API (OpenAI / Claude / Gemini)
    // ----------------------------------------------------
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const chatSuggestions = document.querySelectorAll('#chat-suggestions .suggestion-chip');
    const chatClearBtn = document.getElementById('chat-clear-btn');

    let isAiResponding = false;

    // Helper: Formatted time string
    function getCurrentTimeString() {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Append a message bubble to the chat container
    function appendChatMessage(sender, text, isHtml = false) {
        if (!chatMessages) return;

        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message message-${sender}`;

        const isAi = sender === 'ai';
        const avatarText = isAi ? 'AI' : 'YOU';
        const senderLabel = isAi ? 'Vikranth AI' : 'You';
        const timeString = getCurrentTimeString();

        messageDiv.innerHTML = `
            <div class="message-avatar" aria-hidden="true">
                <span>${avatarText}</span>
            </div>
            <div class="message-content-wrapper">
                <div class="message-meta">
                    <span class="sender-name">${senderLabel}</span>
                    <time class="message-time">${timeString}</time>
                </div>
                <div class="message-bubble">
                    ${isHtml ? text : `<p>${escapeHtml(text)}</p>`}
                </div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        scrollChatToBottom();
    }

    // Helper: Escape HTML to prevent injection in user input
    function escapeHtml(string) {
        const div = document.createElement('div');
        div.textContent = string;
        return div.innerHTML;
    }

    // Show temporary animated typing indicator
    function showTypingIndicator() {
        if (!chatMessages) return null;

        const indicatorDiv = document.createElement('div');
        indicatorDiv.className = 'chat-message message-ai typing-container';
        indicatorDiv.id = 'chat-typing-indicator';
        indicatorDiv.innerHTML = `
            <div class="message-avatar" aria-hidden="true">
                <span>AI</span>
            </div>
            <div class="message-content-wrapper">
                <div class="message-meta">
                    <span class="sender-name">Vikranth AI</span>
                    <span class="message-time">thinking...</span>
                </div>
                <div class="message-bubble typing-indicator">
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                    <span class="typing-dot"></span>
                </div>
            </div>
        `;

        chatMessages.appendChild(indicatorDiv);
        scrollChatToBottom();
        return indicatorDiv;
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById('chat-typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    function scrollChatToBottom() {
        if (chatMessages) {
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    /* ========================================================
     * [API INTEGRATION SPOT] - Real LLM Service (e.g. OpenAI)
     * ========================================================
     * To connect OpenAI or any backend LLM:
     * 1. Change USE_LIVE_AI_API to true.
     * 2. Configure API_ENDPOINT with your backend proxy (e.g., '/api/chat').
     * 
     * NOTE ON SECURITY & BEST PRACTICES:
     * Never store production OpenAI secret keys (sk-...) directly 
     * in public client-side JavaScript. Instead, forward requests 
     * through a lightweight backend endpoint (e.g., Next.js API route,
     * Node/Express server, or Vercel/Netlify serverless function) 
     * where process.env.OPENAI_API_KEY is stored safely.
     * ======================================================== */
    const USE_LIVE_AI_API = false; // Toggle to true when backend API is configured
    const API_ENDPOINT = '/api/chat'; // Replace with your secure backend URL

    /**
     * Live API caller example for OpenAI Chat Completions API
     * @param {string} userMessage 
     * @returns {Promise<string>}
     */
    async function fetchLiveOpenAIResponse(userMessage) {
        // System prompt defining Vikranth's AI persona & portfolio context
        const systemPrompt = `You are the interactive AI clone of Vikranth Kumar VM, a passionate Software Engineer and CS student. Answer questions concisely, accurately, and with a friendly tech enthusiast tone. Highlight his skills in Java, Python, DSA, Embedded Systems (Smart Vehicle Safety project), and web technologies.`;

        try {
            /* Direct OpenAI Fetch Pattern (for testing or via secure proxy):
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer YOUR_OPENAI_API_KEY`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    max_tokens: 300,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
            */

            // Or call your own serverless proxy:
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, context: systemPrompt })
            });

            if (!response.ok) throw new Error(`Proxy error: ${response.status}`);
            const data = await response.json();
            return data.reply;
        } catch (error) {
            console.warn('Live AI API unavailable, falling back to simulated knowledge base:', error);
            return getSimulatedKnowledgeResponse(userMessage);
        }
    }

    /**
     * Simulated knowledge engine trained on Vikranth's portfolio facts
     * @param {string} userQuery
     * @returns {string} Formatted response HTML
     */
    function getSimulatedKnowledgeResponse(userQuery) {
        const query = userQuery.toLowerCase().trim();

        // 1. Core Skills / Tech Stack
        if (query.includes('skill') || query.includes('tech') || query.includes('language') || query.includes('stack') || query.includes('python') || query.includes('java')) {
            return `<p>Vikranth specializes in high-performance software engineering and algorithmic problem-solving:</p>
            <ul>
                <li><strong>Core Languages:</strong> Java (OOP, Multi-threading), Python (Scripting, ML logic), and C/C++.</li>
                <li><strong>Core CS:</strong> Data Structures &amp; Algorithms (DSA), System Design concepts.</li>
                <li><strong>Web Development:</strong> Semantic HTML5, Vanilla CSS, Modern JavaScript (ES6+).</li>
                <li><strong>Developer Tools:</strong> Git/GitHub version control, VS Code, Linux terminal.</li>
            </ul>
            <p>You can check the full skill meters in the <a href="#skills" style="color:var(--text-accent);text-decoration:underline;">Skills section</a> above!</p>`;
        }

        // 2. Featured Projects
        if (query.includes('project') || query.includes('vehicle') || query.includes('safety') || query.includes('accident') || query.includes('portfolio') || query.includes('work')) {
            return `<p>Here are key projects Vikranth has engineered:</p>
            <ul>
                <li><strong>Smart Vehicle Safety &amp; Accident Prevention:</strong> A safety-critical embedded system utilizing smart sensor arrays on mountain roads to detect blind-curve hazards and prevent collisions. Built with Python &amp; microcontroller integration.</li>
                <li><strong>Retro Pixel Portfolio:</strong> An accessible, ultra-responsive web application featuring custom CSS themes, night mode, and interactive components.</li>
            </ul>
            <p>Explore the full showcase in the <a href="#projects" style="color:var(--text-accent);text-decoration:underline;">Projects section</a>!</p>`;
        }

        // 3. Educational Background
        if (query.includes('education') || query.includes('college') || query.includes('degree') || query.includes('school') || query.includes('study') || query.includes('university') || query.includes('cgpa')) {
            return `<p>Here is a summary of Vikranth's academic journey:</p>
            <ul>
                <li><strong>Undergraduate (2024 &ndash; 2028):</strong> Pursuing B.E. in Computer Science &amp; Engineering at AIT (Visvesvaraya Technological University).</li>
                <li><strong>Pre-University (2024):</strong> Science stream with Mathematics &amp; Physics at RP College, Kadur (69%).</li>
                <li><strong>SSLC (2022):</strong> DVM High School, Kadur (72%).</li>
            </ul>
            <p>Feel free to inspect the full interactive milestones in the <a href="#timeline" style="color:var(--text-accent);text-decoration:underline;">Timeline section</a>.</p>`;
        }

        // 4. Contact / Hire / Reach out
        if (query.includes('contact') || query.includes('email') || query.includes('reach') || query.includes('hire') || query.includes('linkedin') || query.includes('github') || query.includes('phone') || query.includes('message')) {
            return `<p>You can easily connect with Vikranth!</p>
            <ul>
                <li><strong>Email:</strong> Reach out directly via the form below.</li>
                <li><strong>LinkedIn &amp; GitHub:</strong> Linked in the Contact &amp; Footer areas.</li>
                <li><strong>Inquiry Form:</strong> Drop a message in the <a href="#contact" style="color:var(--text-accent);text-decoration:underline;">Contact section</a> right below this chat!</li>
            </ul>
            <p>He is actively open to internships, software collaborations, and exciting engineering projects.</p>`;
        }

        // 5. About / Bio / Who are you
        if (query.includes('who are you') || query.includes('about') || query.includes('bio') || query.includes('vikranth') || query.includes('background') || query.includes('experience')) {
            return `<p>Vikranth Kumar VM is a software engineer with a deep passion for building robust software architectures and intelligent systems. He approaches problem solving with a clean, pixel-perfect mindset and enjoys tackling complex data structure puzzles.</p>
            <p>Check out the <a href="#about" style="color:var(--text-accent);text-decoration:underline;">About Me section</a> for more character profile highlights!</p>`;
        }

        // 6. Greetings / Salutations
        if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('greetings') || query.includes('sup') || query.includes('good morning') || query.includes('good evening')) {
            return `<p>Hello there! Player 1 welcomes you! 🎮 How can I assist you today? You can ask about Vikranth's <strong>programming languages</strong>, <strong>embedded systems projects</strong>, or <strong>academic milestones</strong>.</p>`;
        }

        // 7. Testimonials / Mentors / Peers
        if (query.includes('testimonial') || query.includes('feedback') || query.includes('review') || query.includes('recommend') || query.includes('mentor')) {
            return `<p>Vikranth has received stellar endorsements from professors and project partners like Dr. R. Sharma (Project Mentor) and Ananya M. (Technical Club Lead). Check out the feedback cards in the <a href="#testimonials" style="color:var(--text-accent);text-decoration:underline;">Testimonials section</a>!</p>`;
        }

        // 8. Default fallback
        return `<p>That is an interesting question! As Vikranth's simulated AI companion, I am trained on his engineering portfolio.</p>
        <p>You can try asking me about:</p>
        <ul>
            <li><strong>"What programming languages do you know?"</strong></li>
            <li><strong>"Tell me about your Mountain Road Accident project."</strong></li>
            <li><strong>"Where did you study?"</strong></li>
            <li><strong>"How can I contact Vikranth?"</strong></li>
        </ul>
        <p>Or send Vikranth a custom message directly through the <a href="#contact" style="color:var(--text-accent);text-decoration:underline;">Contact form</a> below!</p>`;
    }

    // Main send message handler
    async function handleUserChatMessage(messageText) {
        if (!messageText || isAiResponding) return;

        const trimmedText = messageText.trim();
        if (!trimmedText) return;

        isAiResponding = true;

        // 1. Append User Message
        appendChatMessage('user', trimmedText);

        // Clear input field
        if (chatInput) chatInput.value = '';

        // 2. Show Typing Indicator
        showTypingIndicator();

        // 3. Process Response (Live API or Simulated Engine)
        try {
            let aiReplyHtml = '';

            if (USE_LIVE_AI_API) {
                const apiReply = await fetchLiveOpenAIResponse(trimmedText);
                aiReplyHtml = `<p>${escapeHtml(apiReply)}</p>`;
            } else {
                // Simulate authentic typing / thinking latency (600ms - 800ms)
                await new Promise((resolve) => setTimeout(resolve, 750));
                aiReplyHtml = getSimulatedKnowledgeResponse(trimmedText);
            }

            // 4. Remove Typing Indicator and Append AI Message
            removeTypingIndicator();
            appendChatMessage('ai', aiReplyHtml, true);
        } catch (err) {
            console.error('Chat error:', err);
            removeTypingIndicator();
            appendChatMessage('ai', '<p>Sorry, an unexpected glitch occurred in my neural circuits. Please try asking again!</p>', true);
        } finally {
            isAiResponding = false;
        }
    }

    // Submit handler for input form
    if (chatForm && chatInput) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            handleUserChatMessage(chatInput.value);
        });
    }

    // Suggestion chips click handler
    chatSuggestions.forEach((chip) => {
        chip.addEventListener('click', () => {
            const question = chip.getAttribute('data-question') || chip.textContent.trim();
            handleUserChatMessage(question);
        });
    });

    // Clear / Reset chat handler
    if (chatClearBtn && chatMessages) {
        chatClearBtn.addEventListener('click', () => {
            chatMessages.innerHTML = `
                <div class="chat-message message-ai">
                    <div class="message-avatar" aria-hidden="true">
                        <span>AI</span>
                    </div>
                    <div class="message-content-wrapper">
                        <div class="message-meta">
                            <span class="sender-name">Vikranth AI</span>
                            <time class="message-time">${getCurrentTimeString()}</time>
                        </div>
                        <div class="message-bubble">
                            <p>Memory buffer cleared! ↺ How can I help you explore Vikranth's software engineering background?</p>
                        </div>
                    </div>
                </div>
            `;
            if (chatInput) chatInput.focus();
        });
    }

    // ----------------------------------------------------
    // 6. FOOTER DYNAMIC YEAR
    // ----------------------------------------------------
    const currentYearEl = document.getElementById('current-year');
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
});
