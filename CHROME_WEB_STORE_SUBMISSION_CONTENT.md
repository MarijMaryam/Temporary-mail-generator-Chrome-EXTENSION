# Chrome Web Store Submission Content
## Temporary Mail Generator by Marij Maryam

---

## 🔐 PERMISSION JUSTIFICATIONS

### ❌ **activeTab Justification**
**Status: NOT REQUESTED - This extension does NOT use activeTab permission**

Our extension deliberately does NOT request activeTab permission to maintain maximum user privacy and security. The extension operates entirely through its popup interface without accessing or modifying any web page content.

**Why activeTab is NOT needed:**
- Extension functions as a standalone popup tool
- No content script injection required
- No webpage interaction or form automation
- Users manually paste generated emails (maintaining control)
- Enhanced privacy by avoiding web page access
- Reduced security risks and attack surface

**User Benefit:** Complete privacy protection - the extension cannot access any website data or monitor browsing activity.

---

### ✅ **storage Justification**
**Permission Required: "storage"**

**Purpose:** Store temporary email session data including the current email address and authentication tokens required for inbox access.

**Detailed Usage:**
- Stores temporary email address to maintain session across popup opens/closes
- Stores authentication token for Mail.tm API access
- Stores inbox refresh timestamps to optimize API calls
- All data is session-based and automatically clears when browser closes

**User Benefit:** 
- Maintains email session continuity without requiring re-generation
- Provides seamless user experience across popup interactions
- Ensures inbox messages remain accessible during browser session
- No persistent data storage - complete privacy protection

**Data Stored:**
- Email address (temporary, expires automatically)
- API authentication token (session-only)
- Last refresh timestamp (for optimization)
- No personal data, browsing history, or sensitive information

**Privacy Protection:**
- Session-only storage (clears on browser close)
- No cross-site data sharing
- No persistent user tracking
- Complies with privacy-first design principles

---

### ❌ **tabs Justification**
**Status: NOT REQUESTED - This extension does NOT use tabs permission**

Our extension does NOT request tabs permission as it operates entirely within its popup interface without needing to:
- Access tab information
- Monitor tab changes
- Interact with browser tabs
- Query active tabs

**Alternative Implementation:** The extension provides clipboard copying functionality, allowing users to manually paste emails into any tab they choose, maintaining user control and privacy.

---

### ✅ **Host Permission Justification**
**Permission Required: "https://api.mail.tm/*"**

**Purpose:** Essential for core extension functionality - communication with Mail.tm API service to generate temporary emails and manage inbox.

**Detailed Usage:**
- **Account Creation:** POST requests to create temporary email accounts
- **Domain Fetching:** GET requests to retrieve available email domains
- **Authentication:** POST requests to obtain API access tokens
- **Email Generation:** API calls to generate unique email addresses
- **Inbox Management:** GET requests to retrieve incoming messages
- **Message Content:** Fetch full message content for user viewing

**API Endpoints Used:**
- `https://api.mail.tm/domains` - Fetch available email domains
- `https://api.mail.tm/accounts` - Create new email accounts
- `https://api.mail.tm/token` - Authenticate and get access tokens
- `https://api.mail.tm/messages` - Retrieve inbox messages
- `https://api.mail.tm/messages/{id}` - Get specific message content

**User Benefit:**
- Enables core temporary email generation functionality
- Provides real-time inbox access and message retrieval
- Ensures reliable communication with trusted Mail.tm service
- No alternative methods available for this functionality

**Security Measures:**
- Limited to specific Mail.tm API domain only
- HTTPS-only secure communication
- No access to other websites or services
- Rate limiting implemented to prevent abuse
- Content sanitization for displayed messages

---

## 🎯 SINGLE PURPOSE DESCRIPTION

**Primary Purpose:** Generate and manage temporary email addresses for privacy protection.

**Detailed Description:**
This extension serves one clear, focused purpose: providing users with instant temporary email address generation and inbox management to protect their privacy when interacting with online services.

**Core Functionality:**
- Generate disposable email addresses with one click
- Display incoming messages in real-time inbox
- Automatically copy generated emails to clipboard for easy use
- Manage temporary email sessions during browser usage

**User Workflow:**
1. User clicks extension to open popup
2. Clicks "Generate New Email" to create temporary address
3. Email is automatically copied to clipboard
4. User pastes email into website forms manually
5. User checks incoming messages within extension popup
6. Email session expires when browser closes

**Privacy Focus:**
The extension's single purpose directly supports user privacy by eliminating the need to use personal email addresses for temporary registrations, downloads, or service sign-ups that may result in spam or unwanted communications.

**No Secondary Functions:**
- Does not collect user data
- Does not track browsing behavior
- Does not provide unrelated utilities
- Does not access web page content
- Focuses exclusively on temporary email management

---

## 🔒 PRIVACY POLICY PAGE CONTENT

# Privacy Policy - Temporary Mail Generator

**Effective Date:** December 2024  
**Extension:** Temporary Mail Generator by Marij Maryam  
**Contact:** [Your Contact Information]

---

## Our Commitment to Privacy

The Temporary Mail Generator extension is built with privacy as our top priority. We believe in complete transparency about how we handle (or rather, don't handle) your data.

---

## Data Collection Policy

### **WE COLLECT NO DATA**

This extension operates on a strict **zero data collection** policy:

- ❌ **No Personal Information** - We don't collect names, emails, or contact details
- ❌ **No Browsing Data** - We don't track websites you visit or pages you view
- ❌ **No Usage Analytics** - We don't monitor how you use the extension
- ❌ **No Behavioral Tracking** - We don't analyze your patterns or preferences
- ❌ **No Device Information** - We don't collect device specs or identifiers
- ❌ **No Location Data** - We don't access or store location information

---

## What Information is Temporarily Stored

### **Session-Only Storage**

The extension uses Chrome's local storage API for essential functionality only:

**Temporary Data Stored:**
- Generated email address (for current session only)
- API authentication token (for Mail.tm service access)
- Inbox refresh timestamps (for optimization)

**Important Privacy Protections:**
- ✅ **Session-Only:** All data automatically deletes when you close your browser
- ✅ **Local Storage:** Data stays on your device, never transmitted to our servers
- ✅ **No Persistence:** No data carries over between browser sessions
- ✅ **No Cross-Site Access:** Data cannot be accessed by other websites

---

## Third-Party Services

### **Mail.tm API Integration**

We use the Mail.tm service to provide temporary email functionality:

**What Mail.tm Receives:**
- API requests to generate email addresses
- API requests to retrieve messages
- Standard HTTP request data (IP address, user agent)

**What We Don't Share:**
- Your personal information (we don't have any)
- Your browsing history
- Your usage patterns
- Any identifying information about you

**Mail.tm Privacy:**
Please review Mail.tm's privacy policy at: https://mail.tm/privacy

---

## Data Security

### **Security Measures**

- 🔒 **HTTPS Encryption:** All API communications use secure HTTPS
- 🛡️ **Content Sanitization:** All displayed content is sanitized for security
- 🚫 **No External Servers:** We don't operate any data collection servers
- ⚡ **Minimal Permissions:** Extension requests only necessary permissions
- 🔐 **No User Authentication:** No accounts, passwords, or login systems

---

## Your Rights and Control

### **Complete User Control**

- **Data Deletion:** Close your browser to automatically delete all session data
- **Service Termination:** Uninstall the extension to remove all stored data
- **No Opt-Out Needed:** Since we don't collect data, there's nothing to opt out of
- **Full Transparency:** View our open-source code to verify our privacy practices

---

## Compliance Statements

### **Regulatory Compliance**

**GDPR Compliance (EU):**
- No personal data processing under GDPR definitions
- No consent required as no personal data is collected
- Right to erasure satisfied by session-only storage

**CCPA Compliance (California):**
- No personal information collected or sold
- No third-party data sharing for commercial purposes
- No consumer profiles created or maintained

**Chrome Web Store Policies:**
- Complies with Chrome extension privacy requirements
- Transparent permission usage
- No deceptive data collection practices

---

## Cookies and Tracking

### **No Tracking Technology**

- ❌ **No Cookies:** Extension doesn't set or use cookies
- ❌ **No Web Beacons:** No tracking pixels or web beacons
- ❌ **No Fingerprinting:** No device or browser fingerprinting
- ❌ **No Cross-Site Tracking:** Cannot track across different websites
- ❌ **No Analytics:** No Google Analytics or similar services

---

## Children's Privacy

This extension is safe for users of all ages as it:
- Collects no personal information from anyone
- Operates with the same privacy protections for all users
- Requires no account creation or personal details
- Complies with COPPA requirements through zero data collection

---

## Changes to Privacy Policy

**Notification of Changes:**
- Privacy policy updates will be communicated through extension updates
- Material changes will be clearly highlighted
- Users will be notified before any data collection practices change
- Current privacy commitments will be maintained unless explicitly updated

**Version History:**
- Current Version: 1.0 (December 2024)
- Changes: Initial privacy policy for extension launch

---

## Contact Information

**Questions or Concerns:**
If you have any questions about this privacy policy or our practices:

- **Extension Support:** [Your Support Email]
- **Repository:** [Your GitHub Repository]
- **Response Time:** We aim to respond within 48 hours

---

## Verification

**Open Source Transparency:**
Our extension is open source, allowing you to:
- Review the complete source code
- Verify our privacy claims
- Audit data handling practices
- Contribute to development

**Independent Verification:**
- Chrome Web Store review process
- Open source community auditing
- Transparent development practices

---

## Summary

**In Simple Terms:**
The Temporary Mail Generator extension is designed to protect your privacy by:
1. Collecting absolutely no data about you
2. Storing only temporary session data that auto-deletes
3. Operating entirely locally on your device
4. Providing complete transparency about our practices

Your privacy is not just protected - it's our fundamental design principle.

---

**Last Updated:** December 2024  
**Policy Version:** 1.0  
**Extension Version:** 1.0.0

---

*This privacy policy is binding and represents our commitment to user privacy. We will never compromise on these principles.*