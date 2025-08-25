// Popup JavaScript for Temporary Mail Generator Chrome Extension
// Handles UI interactions, event handling, and communication with service worker

class PopupManager {
    constructor() {
        this.currentEmail = null;
        this.messages = [];
        this.isLoading = false;
        this.autoRefreshInterval = null;
        
        this.initializeElements();
        this.attachEventListeners();
        this.loadCurrentState();
    }

    initializeElements() {
        // Email section elements
        this.emailContainer = document.getElementById('emailContainer');
        this.noEmail = document.getElementById('noEmail');
        this.currentEmailDiv = document.getElementById('currentEmail');
        this.emailAddress = document.getElementById('emailAddress');
        this.messageCount = document.getElementById('messageCount');
        
        // Button elements
        this.generateBtn = document.getElementById('generateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
        this.refreshBtn = document.getElementById('refreshBtn');
        this.refreshInboxBtn = document.getElementById('refreshInboxBtn');
        
        // Inbox elements
        this.inboxSection = document.getElementById('inboxSection');
        this.inboxContent = document.getElementById('inboxContent');
        this.inboxLoading = document.getElementById('inboxLoading');
        this.noMessages = document.getElementById('noMessages');
        this.messagesList = document.getElementById('messagesList');
        
        // Modal elements
        this.messageModal = document.getElementById('messageModal');
        this.modalSubject = document.getElementById('modalSubject');
        this.modalSender = document.getElementById('modalSender');
        this.modalDate = document.getElementById('modalDate');
        this.modalContent = document.getElementById('modalContent');
        this.closeModal = document.getElementById('closeModal');
        
        // Loading and toast elements
        this.loadingOverlay = document.getElementById('loadingOverlay');
        this.toast = document.getElementById('toast');
        this.toastMessage = document.getElementById('toastMessage');
    }

    attachEventListeners() {
        // Button event listeners
        this.generateBtn.addEventListener('click', () => this.generateNewEmail());
        this.clearBtn.addEventListener('click', () => this.clearEmail());
        this.copyBtn.addEventListener('click', () => this.copyEmailToClipboard());
        this.refreshBtn.addEventListener('click', () => this.refreshInbox());
        this.refreshInboxBtn.addEventListener('click', () => this.refreshInbox());
        
        // Modal event listeners
        this.closeModal.addEventListener('click', () => this.closeMessageModal());
        this.messageModal.addEventListener('click', (e) => {
            if (e.target === this.messageModal) {
                this.closeMessageModal();
            }
        });
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.messageModal.style.display !== 'none') {
                this.closeMessageModal();
            }
            if (e.ctrlKey && e.key === 'c' && this.currentEmail) {
                this.copyEmailToClipboard();
            }
            if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
                e.preventDefault();
                this.refreshInbox();
            }
        });
    }

    async loadCurrentState() {
        try {
            const response = await this.sendMessage({ action: 'getCurrentEmail' });
            if (response.success && response.email) {
                this.currentEmail = response.email;
                this.showCurrentEmail();
                await this.loadMessages();
                this.startAutoRefresh();
            } else {
                this.showNoEmail();
            }
        } catch (error) {
            console.error('Error loading current state:', error);
            this.showNoEmail();
        }
    }

    async generateNewEmail() {
        if (this.isLoading) return;
        
        this.setLoading(true);
        this.showLoadingOverlay('Generating email...');
        
        try {
            const response = await this.sendMessage({ action: 'generateEmail' });
            
            if (response.success) {
                this.currentEmail = response.email;
                this.showCurrentEmail();
                await this.copyEmailToClipboard();
                this.showToast('Email generated and copied to clipboard!', 'success');
                
                // Load initial inbox state
                this.messages = [];
                this.updateMessagesList();
                this.startAutoRefresh();
            } else {
                throw new Error(response.error || 'Failed to generate email');
            }
        } catch (error) {
            console.error('Error generating email:', error);
            
            // Special handling for rate limit and cooldown errors
            if (error.message.includes('wait') && error.message.includes('seconds')) {
                this.showToast(error.message, 'warning');
            } else if (error.message.includes('Rate limit') || error.message.includes('Too many requests')) {
                this.showToast('Rate limit reached. Please wait a moment and try again.', 'warning');
            } else {
                this.showToast('Failed to generate email. Please try again.', 'error');
            }
        } finally {
            this.setLoading(false);
            this.hideLoadingOverlay();
        }
    }

    async clearEmail() {
        if (this.isLoading) return;
        
        try {
            await this.sendMessage({ action: 'clearEmail' });
            this.currentEmail = null;
            this.messages = [];
            this.showNoEmail();
            this.stopAutoRefresh();
            this.showToast('Email cleared successfully', 'success');
        } catch (error) {
            console.error('Error clearing email:', error);
            this.showToast('Failed to clear email', 'error');
        }
    }

    async copyEmailToClipboard() {
        if (!this.currentEmail) return;
        
        try {
            await navigator.clipboard.writeText(this.currentEmail);
            this.emailAddress.classList.add('copied');
            setTimeout(() => {
                this.emailAddress.classList.remove('copied');
            }, 600);
            this.showToast('Email copied to clipboard!', 'success');
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            // Fallback for older browsers
            this.fallbackCopyToClipboard(this.currentEmail);
        }
    }

    fallbackCopyToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showToast('Email copied to clipboard!', 'success');
        } catch (error) {
            this.showToast('Failed to copy email', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    async loadMessages() {
        if (!this.currentEmail) return;
        
        try {
            const response = await this.sendMessage({ action: 'getMessages' });
            if (response.success) {
                this.messages = response.messages || [];
                this.updateMessagesList();
                this.updateMessageCount();
            }
        } catch (error) {
            console.error('Error loading messages:', error);
        }
    }

    async refreshInbox() {
        if (this.isLoading || !this.currentEmail) return;
        
        this.showInboxLoading(true);
        
        try {
            await this.loadMessages();
            this.showToast('Inbox refreshed', 'success');
        } catch (error) {
            console.error('Error refreshing inbox:', error);
            this.showToast('Failed to refresh inbox', 'error');
        } finally {
            this.showInboxLoading(false);
        }
    }

    async openMessage(messageId) {
        try {
            const response = await this.sendMessage({ 
                action: 'getMessage', 
                messageId: messageId 
            });
            
            if (response.success) {
                this.showMessageModal(response.message);
            } else {
                this.showToast('Failed to load message', 'error');
            }
        } catch (error) {
            console.error('Error opening message:', error);
            this.showToast('Failed to load message', 'error');
        }
    }

    showCurrentEmail() {
        this.noEmail.style.display = 'none';
        this.currentEmailDiv.style.display = 'block';
        this.clearBtn.style.display = 'block';
        this.inboxSection.style.display = 'block';
        
        this.emailAddress.textContent = this.currentEmail;
        this.updateMessageCount();
    }

    showNoEmail() {
        this.noEmail.style.display = 'block';
        this.currentEmailDiv.style.display = 'none';
        this.clearBtn.style.display = 'none';
        this.inboxSection.style.display = 'none';
    }

    updateMessageCount() {
        const count = this.messages.length;
        this.messageCount.textContent = count === 1 ? '1 message' : `${count} messages`;
    }

    updateMessagesList() {
        if (this.messages.length === 0) {
            this.noMessages.style.display = 'block';
            this.messagesList.style.display = 'none';
            this.messagesList.innerHTML = '';
            return;
        }

        this.noMessages.style.display = 'none';
        this.messagesList.style.display = 'block';
        
        this.messagesList.innerHTML = '';
        
        // Sort messages by date (newest first)
        const sortedMessages = [...this.messages].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        sortedMessages.forEach(message => {
            const messageElement = this.createMessageElement(message);
            this.messagesList.appendChild(messageElement);
        });
    }

    createMessageElement(message) {
        const div = document.createElement('div');
        div.className = `message-item ${!message.seen ? 'unread' : ''}`;
        div.tabIndex = 0;
        
        const date = new Date(message.createdAt);
        const timeString = this.formatMessageTime(date);
        
        // Extract text content from HTML
        const textContent = this.extractTextFromHtml(message.intro || '');
        
        div.innerHTML = `
            <div class="message-header">
                <div class="message-sender">${this.escapeHtml(message.from.name || message.from.address)}</div>
                <div class="message-time">${timeString}</div>
            </div>
            <div class="message-subject">${this.escapeHtml(message.subject || 'No Subject')}</div>
            <div class="message-preview">${this.escapeHtml(textContent)}</div>
        `;
        
        div.addEventListener('click', () => this.openMessage(message.id));
        div.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.openMessage(message.id);
            }
        });
        
        return div;
    }

    showMessageModal(message) {
        const date = new Date(message.createdAt);
        const dateString = date.toLocaleString();
        
        this.modalSubject.textContent = message.subject || 'No Subject';
        this.modalSender.textContent = `From: ${message.from.name || message.from.address}`;
        this.modalDate.textContent = dateString;
        
        // Extract and display text content safely
        const textContent = this.extractTextFromHtml(message.text || message.intro || 'No content available');
        this.modalContent.textContent = textContent;
        
        this.messageModal.style.display = 'flex';
        this.closeModal.focus();
    }

    closeMessageModal() {
        this.messageModal.style.display = 'none';
    }

    startAutoRefresh() {
        this.stopAutoRefresh();
        this.autoRefreshInterval = setInterval(() => {
            this.loadMessages();
        }, 30000); // Refresh every 30 seconds
    }

    stopAutoRefresh() {
        if (this.autoRefreshInterval) {
            clearInterval(this.autoRefreshInterval);
            this.autoRefreshInterval = null;
        }
    }

    setLoading(loading) {
        this.isLoading = loading;
        this.generateBtn.disabled = loading;
        this.clearBtn.disabled = loading;
    }

    showLoadingOverlay(message) {
        this.loadingOverlay.querySelector('span').textContent = message;
        this.loadingOverlay.style.display = 'flex';
    }

    hideLoadingOverlay() {
        this.loadingOverlay.style.display = 'none';
    }

    showInboxLoading(show) {
        this.inboxLoading.style.display = show ? 'flex' : 'none';
    }

    showToast(message, type = 'info') {
        this.toastMessage.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.style.display = 'block';
        
        setTimeout(() => {
            this.toast.style.display = 'none';
        }, 3000);
    }

    formatMessageTime(date) {
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    }

    extractTextFromHtml(html) {
        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    sendMessage(message) {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(message, response => {
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                } else {
                    resolve(response);
                }
            });
        });
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        new PopupManager();
    } catch (error) {
        console.error('Error initializing popup:', error);
        
        // Show basic error message to user
        const container = document.querySelector('.container');
        if (container) {
            container.innerHTML = `
                <div style="padding: 20px; text-align: center; color: #ea4335;">
                    <h3>Error</h3>
                    <p>Failed to initialize extension. Please try refreshing.</p>
                    <button onclick="window.location.reload()" style="margin-top: 10px; padding: 8px 16px; background: #4285f4; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Refresh
                    </button>
                </div>
            `;
        }
    }
});

// Handle extension unload
window.addEventListener('beforeunload', () => {
    // Clean up any intervals or timeouts
    if (window.popupManager && window.popupManager.autoRefreshInterval) {
        clearInterval(window.popupManager.autoRefreshInterval);
    }
});