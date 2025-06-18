# Interview Coder - Setup and Run Guide

## Prerequisites

Before running the application, ensure you have:

1. **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
2. **npm** (comes with Node.js)
3. **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Clean Previous Builds (Recommended)
```bash
npm run clean
```

### 3. Run the Application

#### For Windows:
```bash
# Run the batch file
stealth-run.bat
```

#### For macOS/Linux:
```bash
# Make the script executable
chmod +x stealth-run.sh

# Run the script
./stealth-run.sh
```

#### Alternative Method (Cross-platform):
```bash
# Development mode
npm run dev

# Or production mode
npm run build
npm run run-prod
```

## Important Notes

### Invisibility Feature
- **The application starts INVISIBLE by default!**
- Use **Ctrl+B** (Windows/Linux) or **Cmd+B** (macOS) to toggle visibility
- If you don't see the window, press the toggle shortcut multiple times

### Essential Keyboard Shortcuts
- **Toggle Visibility**: Ctrl+B / Cmd+B
- **Take Screenshot**: Ctrl+H / Cmd+H
- **Process Screenshots**: Ctrl+Enter / Cmd+Enter
- **Reset View**: Ctrl+R / Cmd+R
- **Quit Application**: Ctrl+Q / Cmd+Q
- **Move Window**: Ctrl+Arrow Keys / Cmd+Arrow Keys
- **Adjust Opacity**: Ctrl+[ and Ctrl+] / Cmd+[ and Cmd+]

### First-Time Setup
1. When you first run the app, it will prompt you to enter your OpenAI API Key
2. Go to Settings and configure your API key
3. Choose your preferred AI model (GPT-4o recommended)
4. Select your programming language

## Troubleshooting

### Common Issues

#### 1. "App doesn't appear to start"
- The app is running invisibly - press **Ctrl+B** or **Cmd+B** to make it visible
- Check Task Manager (Windows) or Activity Monitor (macOS) for "Interview Coder" process

#### 2. "Permission errors on macOS"
- Go to System Preferences > Security & Privacy > Privacy > Screen Recording
- Enable screen recording permission for Terminal or your IDE
- Restart the application

#### 3. "Build errors"
```bash
# Clean everything and reinstall
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 4. "API key not working"
- Ensure your OpenAI API key starts with "sk-"
- Check that you have sufficient credits in your OpenAI account
- Verify the key in Settings dialog

#### 5. "Screenshots not working"
- On macOS: Grant screen recording permissions
- On Windows: Run as administrator if needed
- Try taking a screenshot manually first with Ctrl+H

### Development Mode Issues
If running in development mode (`npm run dev`):
- Wait for both Vite and Electron to fully start
- The dev server runs on port 54321
- Hot reload may cause the window to become invisible - use Ctrl+B to show it

## Usage Workflow

1. **Start the app** using one of the run methods above
2. **Make it visible** with Ctrl+B / Cmd+B
3. **Configure API key** in Settings (gear icon)
4. **Take screenshots** of coding problems with Ctrl+H / Cmd+H
5. **Process screenshots** with Ctrl+Enter / Cmd+Enter
6. **View solutions** and debug as needed
7. **Reset** for new problems with Ctrl+R / Cmd+R

## Features

- **99% Invisibility**: Undetectable in most screen sharing applications
- **AI-Powered Analysis**: Uses GPT-4o to analyze coding problems
- **Multi-Language Support**: Python, JavaScript, Java, C++, Go, and more
- **Real-time Debugging**: Debug your code with AI assistance
- **No Subscription Required**: Use your own OpenAI API key

## Support

If you continue having issues:
1. Check the console output for error messages
2. Ensure all prerequisites are installed
3. Try running in development mode for more detailed logs
4. Check the GitHub repository for known issues

Remember: The app is designed to be invisible for interview scenarios, so always use Ctrl+B / Cmd+B to toggle visibility!