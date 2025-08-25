# Temporary Mail Generator Chrome Extension by Marij Maryam

A lightweight, free Chrome browser extension that generates disposable email addresses instantly. Protect your privacy and keep your main inbox clean with temporary emails powered by the Mail.tm API.

## 🚀 Features

- **One-Click Email Generation**: Generate unique temporary email addresses instantly
- **Automatic Clipboard Copy**: Generated emails are automatically copied to your clipboard
- **Real-time Inbox**: View incoming messages directly in the extension popup
- **Privacy-First**: No data collection, completely client-side operation
- **Free Forever**: Uses the free Mail.tm API, no premium features or ads
- **Clean Interface**: Modern, intuitive design optimized for Chrome extension popup

## 📋 Installation

### From Source (Developer Mode)

1. **Download or Clone** this repository to your local machine
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** by toggling the switch in the top-right corner
4. **Click "Load unpacked"** and select the extension folder
5. **Pin the extension** to your toolbar for easy access

### Icon Setup (Required for Chrome Web Store)

⚠️ **Action Required**: The extension is configured for PNG icons, but you need to create them:

1. **Quick Method**: Open `convert-icons-to-png.html` → Click "Generate & Download All PNG Icons"
2. **Verification**: Open `verify-icons.html` to check if icons are properly set up
3. **Manual Method**: See `icons/README.md` for detailed conversion instructions

The extension will work in developer mode with SVG icons, but Chrome Web Store requires PNG format.

## 🎯 How to Use

### Generating a Temporary Email

1. **Click the extension icon** in your Chrome toolbar
2. **Click "Generate New Email"** button
3. **Email is automatically copied** to your clipboard
4. **Paste the email** into any website form

### Checking Your Inbox

1. **Open the extension popup** after generating an email
2. **View incoming messages** in the inbox section
3. **Click any message** to read its full content
4. **Use the refresh button** to manually check for new messages

### Managing Your Email

- **Copy Email**: Click the copy icon next to your current email
- **Refresh Inbox**: Click the refresh button to check for new messages  
- **Clear Email**: Click "Clear Email" to remove current email and start fresh
- **Auto-Refresh**: Inbox automatically refreshes every 30 seconds

## 🛠️ Technical Details

### Architecture

- **Manifest V3**: Uses the latest Chrome extension standards
- **Service Worker**: Handles Mail.tm API communication and background tasks
- **Client-Side Only**: No external servers, all processing happens locally
- **Session Storage**: Temporary email data is stored only for the browser session

### API Integration

- **Mail.tm API**: Official temporary email service API (https://docs.mail.tm/)
- **Rate Limiting**: Complies with 8 requests per second limit
- **Authentication**: Uses Bearer token authentication
- **Error Handling**: Comprehensive handling of API status codes (400-429)
- **Domain Selection**: Automatically selects active, non-private domains

### Security & Privacy

- **No Data Collection**: Extension doesn't collect or transmit user data
- **Session-Only Storage**: Email data is cleared when browser session ends
- **Content Sanitization**: All email content is sanitized before display
- **HTTPS Only**: All API communications use secure HTTPS

## 📁 File Structure

```
Temporary Mail Generator By Marij Maryam/
├── manifest.json           # Extension configuration
├── background.js            # Service worker for API communication
├── popup.html               # Extension popup interface
├── popup.css                # Styling for the popup
├── popup.js                 # Popup JavaScript logic
├── icons/                   # Extension icons
│   ├── icon16.svg          # 16x16 icon
│   ├── icon32.svg          # 32x32 icon
│   ├── icon48.svg          # 48x48 icon
│   ├── icon128.svg         # 128x128 icon
│   └── README.md           # Icon conversion instructions
├── icon-generator.html      # Tool for generating PNG icons
├── generate-icons.js        # Icon generation script
└── README.md               # This file
```

## 🎨 Customization

### Modifying the UI

- **Colors**: Edit CSS custom properties in `popup.css`
- **Layout**: Modify the HTML structure in `popup.html`
- **Animations**: Adjust CSS animations and transitions
- **Icons**: Replace SVG icons with custom designs

### API Configuration

- **Refresh Interval**: Change auto-refresh timing in `background.js`
- **Domain Selection**: Modify domain preference logic
- **Error Messages**: Customize user-facing error messages

## 🔧 Development

### Prerequisites

- Chrome browser (version 88+)
- Basic knowledge of HTML, CSS, and JavaScript
- Understanding of Chrome Extension Manifest V3

### Local Development

1. Make changes to the source files
2. Go to `chrome://extensions/`
3. Click the refresh button on your extension
4. Test changes in the popup

### Debugging

- **Service Worker**: Check `chrome://extensions/` → Details → Service Worker → Console
- **Popup**: Right-click extension popup → Inspect
- **Background**: Use Chrome DevTools for background script debugging

### Troubleshooting

For common issues like "Too many requests" errors, see **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** for detailed solutions.

## 🌟 Chrome Web Store Submission

### Before Submission

1. **Convert icons** from SVG to PNG format
2. **Update manifest.json** to reference PNG icons
3. **Test thoroughly** on different Chrome versions
4. **Prepare store assets** (screenshots, descriptions)

### Store Requirements

- ✅ Manifest V3 compliance
- ✅ Minimum required permissions
- ✅ Content Security Policy
- ✅ Clear privacy policy (no data collection)
- ✅ Proper icon sizes and formats

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for:

- Bug fixes
- Feature enhancements
- UI/UX improvements
- Documentation updates

## 📞 Support

For support, bug reports, or feature requests:

1. **Check existing issues** on the project repository
2. **Create a new issue** with detailed information
3. **Include steps to reproduce** any bugs
4. **Attach screenshots** if applicable

## 🎯 Roadmap

### Planned Features

- [ ] Desktop notifications for new emails
- [ ] Multiple domain selection
- [ ] Email forwarding capabilities
- [ ] Auto-delete rules
- [ ] QR code generation for mobile sharing
- [ ] Dark mode support

### Future Enhancements

- [ ] Multiple active emails simultaneously
- [ ] Custom email aliases
- [ ] Enhanced security features
- [ ] Integration with other temporary email services

## ⚠️ Important Notes

### API Dependency

This extension relies on the Mail.tm API. If the service experiences downtime:
- Email generation will fail
- Existing emails may become temporarily inaccessible
- The extension will show appropriate error messages

### Browser Limitations

- **Chrome Only**: Designed specifically for Chrome (Chromium-based browsers may work)
- **Internet Required**: Requires active internet connection for API access
- **Session-Based**: Email data is lost when browser session ends

### Privacy Considerations

- **Temporary Nature**: Emails expire based on Mail.tm policies
- **Public API**: Uses a third-party service for email generation
- **No Encryption**: Email content is not encrypted (use for non-sensitive purposes)

---

**Created by Marij Maryam** | Version 1.0.0 | Last Updated: August 2025