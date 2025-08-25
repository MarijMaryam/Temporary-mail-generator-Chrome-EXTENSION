// Service Worker for Temporary Mail Generator Chrome Extension
// Handles Mail.tm API communication, clipboard operations, and background tasks
// API Documentation: https://docs.mail.tm/

class MailTmAPI {
  constructor() {
    this.baseURL = 'https://api.mail.tm';
    this.token = null;
    this.currentEmail = null;
    this.accountId = null;
    this.lastRequestTime = 0;
    this.requestDelay = 500; // Very conservative: 2 requests per second
    this.requestQueue = [];
    this.processingQueue = false;
  }

  // Queue-based rate limiting to ensure strict compliance
  async queueRequest(requestFunc) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ requestFunc, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processingQueue || this.requestQueue.length === 0) {
      return;
    }
    
    this.processingQueue = true;
    
    while (this.requestQueue.length > 0) {
      const { requestFunc, resolve, reject } = this.requestQueue.shift();
      
      try {
        // Ensure minimum delay between requests
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.requestDelay) {
          const waitTime = this.requestDelay - timeSinceLastRequest;
          await new Promise(r => setTimeout(r, waitTime));
        }
        
        const result = await requestFunc();
        this.lastRequestTime = Date.now();
        resolve(result);
      } catch (error) {
        reject(error);
      }
      
      // Additional safety delay between queue items
      await new Promise(r => setTimeout(r, 100));
    }
    
    this.processingQueue = false;
  }

  // Rate limiting helper - now uses queue system
  async waitForRateLimit() {
    // This method is now handled by the queue system
    // Keep it for backward compatibility but it doesn't need to do anything
    return;
  }

  // Retry helper with exponential backoff for rate limit errors
  async retryWithBackoff(apiCall, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error) {
        if (error.message.includes('429') || error.message.includes('Too many requests')) {
          if (attempt === maxRetries) {
            throw new Error('Rate limit exceeded. Please wait a few minutes and try again.');
          }
          
          // Exponential backoff: 1s, 2s, 4s
          const backoffTime = Math.pow(2, attempt) * 1000;
          console.log(`Rate limit hit, waiting ${backoffTime}ms before retry ${attempt}/${maxRetries}`);
          await new Promise(resolve => setTimeout(resolve, backoffTime));
        } else {
          throw error;
        }
      }
    }
  }

  // Get available domains
  async getDomains() {
    return await this.queueRequest(async () => {
      try {
        const response = await fetch(`${this.baseURL}/domains`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        // Filter for active, non-private domains
        const domains = data['hydra:member'] || [];
        return domains.filter(domain => domain.isActive && !domain.isPrivate);
      } catch (error) {
        console.error('Error fetching domains:', error);
        throw error;
      }
    });
  }

  // Create a new account with temporary email
  async createAccount() {
    try {
      // Step 1: Get domains with better error handling
      console.log('Step 1: Getting available domains...');
      const domains = await this.getDomains();
      
      if (domains.length === 0) {
        throw new Error('No active domains available. Please try again later.');
      }

      // Use first available active domain
      const domain = domains[0].domain;
      const username = this.generateRandomUsername();
      const email = `${username}@${domain}`;
      const password = this.generateRandomPassword();
      
      console.log(`Step 2: Creating account for ${email}...`);

      // Step 2: Create account with queue system and longer delay
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      
      const accountData = await this.queueRequest(async () => {
        const response = await fetch(`${this.baseURL}/accounts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: email,
            password: password
          })
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          if (response.status === 422) {
            throw new Error('Invalid email format or domain');
          } else if (response.status === 429) {
            throw new Error('Too many requests. Please wait a moment.');
          }
          throw new Error(`Failed to create account: ${response.status} - ${errorData.message || response.statusText}`);
        }

        return await response.json();
      });
      
      this.currentEmail = email;
      this.accountId = accountData.id;
      
      console.log('Step 3: Getting authentication token...');

      // Step 3: Get token with queue system and longer delay
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 second delay
      
      await this.queueRequest(async () => {
        const response = await fetch(`${this.baseURL}/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: email,
            password: password
          })
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Invalid email or password');
          } else if (response.status === 429) {
            throw new Error('Too many requests. Please wait a moment.');
          }
          throw new Error(`Failed to get token: ${response.status} - ${response.statusText}`);
        }

        const tokenData = await response.json();
        this.token = tokenData.token;
        return this.token;
      });

      // Store in session storage
      await chrome.storage.session.set({
        currentEmail: email,
        accountId: this.accountId,
        token: this.token,
        password: password,
        createdAt: Date.now()
      });
      
      console.log('Account creation completed successfully');
      return email;
    } catch (error) {
      console.error('Error creating account:', error);
      throw error;
    }
  }

  // Get authentication token
  async getToken(email, password) {
    return await this.queueRequest(async () => {
      try {
        const response = await fetch(`${this.baseURL}/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: email,
            password: password
          })
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Invalid email or password');
          } else if (response.status === 429) {
            throw new Error('Too many requests. Please wait a moment.');
          }
          throw new Error(`Failed to get token: ${response.status} - ${response.statusText}`);
        }

        const tokenData = await response.json();
        this.token = tokenData.token;
        return this.token;
      } catch (error) {
        console.error('Error getting token:', error);
        throw error;
      }
    });
  }

  // Get messages for current account
  async getMessages() {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    return await this.queueRequest(async () => {
      try {
        const response = await fetch(`${this.baseURL}/messages`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication token expired or invalid');
          } else if (response.status === 429) {
            throw new Error('Too many requests. Please wait a moment.');
          }
          throw new Error(`Failed to fetch messages: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        return data['hydra:member'] || [];
      } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
      }
    });
  }

  // Get specific message content
  async getMessage(messageId) {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    return await this.queueRequest(async () => {
      try {
        const response = await fetch(`${this.baseURL}/messages/${messageId}`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication token expired or invalid');
          } else if (response.status === 404) {
            throw new Error('Message not found');
          } else if (response.status === 429) {
            throw new Error('Too many requests. Please wait a moment.');
          }
          throw new Error(`Failed to fetch message: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error fetching message:', error);
        throw error;
      }
    });
  }

  // Get account information using /me endpoint
  async getAccountInfo() {
    if (!this.token) {
      throw new Error('No authentication token available');
    }

    return await this.queueRequest(async () => {
      try {
        const response = await fetch(`${this.baseURL}/me`, {
          headers: {
            'Authorization': `Bearer ${this.token}`
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication token expired or invalid');
          }
          throw new Error(`Failed to fetch account info: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        console.error('Error fetching account info:', error);
        throw error;
      }
    });
  }

  // Generate random username (minimum 3 characters as per API requirements)
  generateRandomUsername() {
    const adjectives = ['quick', 'bright', 'calm', 'bold', 'smart', 'cool', 'fast', 'safe', 'blue', 'red'];
    const nouns = ['fox', 'cat', 'dog', 'bird', 'fish', 'bear', 'wolf', 'lion', 'star', 'moon'];
    const numbers = Math.floor(Math.random() * 9999);
    
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    
    // Ensure username is at least 3 characters and follows email username conventions
    const username = `${adjective}${noun}${numbers}`;
    return username.toLowerCase();
  }

  // Generate random password (minimum 8 characters for security)
  generateRandomPassword() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 16; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  // Load stored session data
  async loadSession() {
    try {
      const data = await chrome.storage.session.get(['currentEmail', 'accountId', 'token', 'password']);
      if (data.currentEmail && data.token) {
        this.currentEmail = data.currentEmail;
        this.accountId = data.accountId;
        this.token = data.token;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error loading session:', error);
      return false;
    }
  }

  // Clear current session
  async clearSession() {
    try {
      await chrome.storage.session.clear();
      this.currentEmail = null;
      this.accountId = null;
      this.token = null;
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  }
}

// Global instance
const mailAPI = new MailTmAPI();

// Cooldown tracking for user actions
const actionCooldowns = {
  generateEmail: 0,
  getMessages: 0
};

const COOLDOWN_PERIODS = {
  generateEmail: 3000, // 3 seconds between email generations
  getMessages: 1000    // 1 second between message fetches
};

// Message handler for popup communication
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  (async () => {
    try {
      switch (request.action) {
        case 'generateEmail':
          // Check cooldown
          const now = Date.now();
          if (now - actionCooldowns.generateEmail < COOLDOWN_PERIODS.generateEmail) {
            const remainingTime = Math.ceil((COOLDOWN_PERIODS.generateEmail - (now - actionCooldowns.generateEmail)) / 1000);
            throw new Error(`Please wait ${remainingTime} seconds before generating another email.`);
          }
          
          actionCooldowns.generateEmail = now;
          await mailAPI.clearSession(); // Clear any existing session
          const email = await mailAPI.createAccount();
          
          // Copy to clipboard
          try {
            await chrome.action.getPopup({}).then(() => {
              // We'll handle clipboard in popup since service workers have limitations
            });
          } catch (clipboardError) {
            console.log('Clipboard will be handled by popup');
          }
          
          sendResponse({ success: true, email: email });
          break;

        case 'getCurrentEmail':
          const hasSession = await mailAPI.loadSession();
          if (hasSession) {
            sendResponse({ success: true, email: mailAPI.currentEmail });
          } else {
            sendResponse({ success: false, email: null });
          }
          break;

        case 'getAccountInfo':
          await mailAPI.loadSession();
          const accountInfo = await mailAPI.getAccountInfo();
          sendResponse({ success: true, accountInfo: accountInfo });
          break;

        case 'getMessages':
          // Check cooldown
          const messagesNow = Date.now();
          if (messagesNow - actionCooldowns.getMessages < COOLDOWN_PERIODS.getMessages) {
            // Use cached data if within cooldown
            const cachedData = await chrome.storage.session.get(['cachedMessages', 'lastMessageCheck']);
            if (cachedData.cachedMessages && (messagesNow - cachedData.lastMessageCheck) < 30000) {
              sendResponse({ success: true, messages: cachedData.cachedMessages });
              break;
            }
          }
          
          actionCooldowns.getMessages = messagesNow;
          await mailAPI.loadSession();
          const messages = await mailAPI.getMessages();
          
          // Cache the results
          await chrome.storage.session.set({
            cachedMessages: messages,
            lastMessageCheck: messagesNow
          });
          
          sendResponse({ success: true, messages: messages });
          break;

        case 'getMessage':
          await mailAPI.loadSession();
          const message = await mailAPI.getMessage(request.messageId);
          sendResponse({ success: true, message: message });
          break;

        case 'clearEmail':
          await mailAPI.clearSession();
          sendResponse({ success: true });
          break;

        default:
          sendResponse({ success: false, error: 'Unknown action' });
      }
    } catch (error) {
      console.error('Background script error:', error);
      
      // Provide user-friendly error messages
      let userMessage = error.message;
      if (error.message.includes('429') || error.message.includes('Too many requests')) {
        userMessage = 'Too many requests. Please wait a moment and try again.';
      } else if (error.message.includes('401') || error.message.includes('Authentication token')) {
        userMessage = 'Session expired. Please generate a new email.';
      } else if (error.message.includes('No active domains')) {
        userMessage = 'No email domains available. Please try again later.';
      } else if (error.message.includes('Invalid email format')) {
        userMessage = 'Could not create email address. Please try again.';
      }
      
      sendResponse({ success: false, error: userMessage });
    }
  })();
  
  return true; // Keep message channel open for async response
});

// Set up periodic message checking alarm
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkMessages') {
    try {
      const hasSession = await mailAPI.loadSession();
      if (hasSession) {
        // Use queue system for background message checking
        const messages = await mailAPI.getMessages();
        
        // Store message count for badge update
        await chrome.storage.session.set({ 
          messageCount: messages.length,
          lastChecked: Date.now()
        });
        
        // Update badge with message count
        const unreadCount = messages.filter(msg => !msg.seen).length;
        if (unreadCount > 0) {
          chrome.action.setBadgeText({ text: unreadCount.toString() });
          chrome.action.setBadgeBackgroundColor({ color: '#FF4444' });
        } else {
          chrome.action.setBadgeText({ text: '' });
        }
      }
    } catch (error) {
      console.error('Error checking messages (background):', error);
      // Don't show error to user for background checks, just log it
    }
  }
});

// Create alarm for periodic message checking - less frequent to avoid rate limits
chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create('checkMessages', { delayInMinutes: 2, periodInMinutes: 5 }); // Changed from 1min/2min to 2min/5min
});

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('checkMessages', { delayInMinutes: 2, periodInMinutes: 5 }); // Changed from 1min/2min to 2min/5min
});

// Clean up expired sessions on startup
chrome.runtime.onStartup.addListener(async () => {
  try {
    const data = await chrome.storage.session.get(['createdAt']);
    if (data.createdAt) {
      const hoursSinceCreation = (Date.now() - data.createdAt) / (1000 * 60 * 60);
      if (hoursSinceCreation > 24) { // Clear sessions older than 24 hours
        await mailAPI.clearSession();
      }
    }
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
  }
});