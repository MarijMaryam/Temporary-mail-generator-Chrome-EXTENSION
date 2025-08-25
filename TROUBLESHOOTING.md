# Troubleshooting Guide

## Common Issues and Solutions

### 🚫 "Too many requests" Error

**Problem**: You see "Error: Too many requests. Please wait a moment."

**Causes**:
- Clicking "Generate New Email" multiple times quickly
- API rate limit reached (8 requests per second)
- Extension making too many background requests

**Solutions**:
1. **Wait 30-60 seconds** before trying again
2. **Avoid rapid clicking** - wait for each action to complete
3. **Reload the extension** if the problem persists:
   - Go to `chrome://extensions/`
   - Find "Temporary Mail Generator"
   - Click the refresh button
4. **Clear extension data**:
   - Right-click extension icon → "Inspect popup"
   - Go to Application tab → Storage → Clear storage

### ⏱️ "Please wait X seconds" Message

**Problem**: Extension shows cooldown timer

**Solution**: This is normal rate limiting protection. Wait for the countdown to finish.

### 📧 Email Generation Fails

**Problem**: Cannot generate new email address

**Possible Solutions**:
1. **Check internet connection**
2. **Wait a few minutes** (Mail.tm may be temporarily down)
3. **Clear browser cache**
4. **Restart Chrome**
5. **Reload the extension**

### 📨 Messages Not Loading

**Problem**: Inbox shows "No messages" but you expect emails

**Solutions**:
1. **Click the refresh button** manually
2. **Wait 2-3 minutes** for emails to arrive
3. **Check if the temporary email is still active**
4. **Generate a new email** if the current one has expired

### 🔄 Extension Not Working

**Problem**: Extension popup doesn't load or shows errors

**Solutions**:
1. **Check Chrome version** (requires Chrome 88+)
2. **Disable other extensions** that might conflict
3. **Reload the extension**:
   - Go to `chrome://extensions/`
   - Find the extension
   - Click the refresh button
4. **Remove and reinstall** the extension

### 🌐 API Service Down

**Problem**: All features fail with network errors

**Solution**: Mail.tm API may be temporarily unavailable. Try again later.

## Rate Limiting Details

The extension implements the following rate limiting to comply with Mail.tm API:

- **Email Generation**: 3 second cooldown between requests
- **Message Fetching**: 1 second cooldown between requests  
- **Background Checks**: Every 5 minutes (reduced from 2 minutes)
- **API Requests**: 200ms delay between all API calls
- **Retry Logic**: Automatic retry with exponential backoff for rate limit errors

## Getting Help

If problems persist:

1. **Check the browser console**:
   - Right-click extension popup → "Inspect"
   - Look for error messages in the Console tab

2. **Verify extension files**:
   - Make sure all PNG icons exist (if converted)
   - Check that manifest.json is valid

3. **Test in incognito mode** to rule out other extensions

4. **Report the issue** with:
   - Chrome version
   - Extension version
   - Steps to reproduce
   - Console error messages (if any)

## Performance Tips

- **Don't spam-click** buttons
- **Close popup** when not in use to reduce background activity
- **Use manual refresh** instead of relying on auto-refresh for immediate updates
- **Generate new emails sparingly** - each one uses API quota

---

**Remember**: The extension uses a free API service, so some limitations are normal. Be patient and avoid rapid-fire requests!