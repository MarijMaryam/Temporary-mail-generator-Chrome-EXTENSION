# activeTab Permission Justification

## Chrome Web Store Submission - Temporary Mail Generator by Marij Maryam

### Permission Request: `activeTab`

**Status:** ❌ **NOT REQUESTED** - This extension does NOT use the activeTab permission

---

## Current Permissions Used

Our extension uses only the following minimal permissions:

### ✅ **clipboardWrite**
- **Purpose:** Automatically copy generated temporary email addresses to user's clipboard
- **User Benefit:** Seamless workflow - users can immediately paste the email into forms
- **Usage:** When user clicks "Generate New Email", the address is copied for instant use

### ✅ **alarms** 
- **Purpose:** Schedule automatic inbox refresh every 30 seconds
- **User Benefit:** Real-time message notifications without manual refresh
- **Usage:** Background service worker sets periodic alarms to check for new messages

### ✅ **storage**
- **Purpose:** Store temporary email session data (email address, authentication token)
- **User Benefit:** Maintains email session across popup opens/closes
- **Usage:** Session-only storage that clears when browser closes (privacy-first approach)

### ✅ **host_permissions: https://api.mail.tm/***
- **Purpose:** API communication with Mail.tm service for email generation and inbox access
- **User Benefit:** Core functionality - generates emails and retrieves messages
- **Usage:** All API calls to create accounts, get domains, fetch messages

---

## Why activeTab is NOT Needed

Our extension operates as a **standalone popup interface** and does NOT:

- ❌ Inject content scripts into web pages
- ❌ Read or modify webpage content
- ❌ Interact with form fields on websites
- ❌ Access user's browsing data
- ❌ Monitor or track user activity on websites

### Workflow Without activeTab:

1. **User opens extension popup** → No web page interaction needed
2. **Clicks "Generate New Email"** → API call to Mail.tm (not web page)
3. **Email copied to clipboard** → Uses clipboardWrite permission
4. **User manually pastes** → User action, not extension automation
5. **Checks inbox in popup** → API calls only, no web page access

---

## Privacy-First Design

By **NOT using activeTab**, our extension provides:

- **🛡️ Enhanced Privacy:** Cannot access any website content or user data
- **🔒 Minimal Permissions:** Only requests what's absolutely necessary
- **👤 User Control:** Users manually paste emails where needed
- **🚫 No Tracking:** Cannot monitor user browsing or form submissions
- **✅ Transparency:** Clear, limited permission scope

---

## Alternative Implementation Considered

We deliberately chose **NOT to implement** automatic form filling features that would require activeTab because:

1. **Privacy Concerns:** Would require access to sensitive form data
2. **Security Risks:** Could potentially be misused by malicious actors  
3. **User Preference:** Many users prefer manual control over automatic form filling
4. **Simplicity:** Keeps extension focused and lightweight
5. **Trust:** Builds user confidence with minimal permissions

---

## Summary

**Temporary Mail Generator by Marij Maryam does NOT request activeTab permission.**

Our extension provides full functionality through:
- Popup-only interface
- Direct API integration
- Clipboard copying for user convenience
- Manual paste workflow (user-controlled)

This approach ensures maximum privacy protection while delivering a seamless temporary email experience.

---

**Extension Permissions Summary:**
- ✅ clipboardWrite (copy emails)
- ✅ alarms (auto-refresh)  
- ✅ storage (session data)
- ✅ host_permissions (API access)
- ❌ activeTab (NOT USED)

**Result:** Minimal attack surface, maximum user privacy, full functionality.