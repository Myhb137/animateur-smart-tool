# Animateur Smart Tool 🎭

An AI-powered activity planning tool designed for animators and youth activity organizers. This intelligent assistant generates personalized songs, games, team-building activities, and entertainment content tailored to your specific needs and group context.

## Features ✨

- **AI-Powered Content Generation** - Uses Google's Generative AI to create unique, context-aware activities
- **Multiple Activity Types** - Generate:
  - 🎵 Animated songs with choreography
  - 🎮 Interactive games and competitions
  - 🏕️ Team-building activities
  - 🎪 Entertainment content
  - 🌙 Specialized activities for different settings (camps, outdoors, indoor, etc.)

- **Smart Filtering** - Customize content by:
  - Age group (babies, toddlers, kids, teens, adults)
  - Activity scale (individual, small group, large group)
  - Environment (indoors, outdoors, camping, beach, mountains)
  - Activity type and duration

- **Action Tools** - Copy, print, or save generated content
- **Beautiful UI** - Modern, animated interface with floating background elements
- **Local Storage** - Save your favorite activities and preferences

## Tech Stack 💻

- **React 19** - Modern UI framework
- **Vite** - Lightning-fast build tool
- **Lucide React** - Comprehensive icon library
- **Framer Motion** - Smooth animations
- **Google Generative AI API** - AI content generation
- **ESLint** - Code quality

## Getting Started 🚀

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager
- Google Generative AI API key (free from [Google AI Studio](https://aistudio.google.com))

### Installation

1. Clone or download the project:
```bash
cd "animateur smart tool"
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory and add your API key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

The application will open in your browser at `http://localhost:5173`

## Usage 📖

1. **Select Your Context**: Choose the activity parameters:
   - Age group of participants
   - Group size (individual, small, large)
   - Activity environment (indoor, outdoor, camping, etc.)
   - Type of activity you want (song, game, etc.)

2. **Generate Content**: Click the generate button and let AI create personalized content

3. **Manage Results**: 
   - 📋 Copy content to clipboard
   - 🖨️ Print directly
   - ❤️ Save favorites to local storage

## Project Structure 📁

```
src/
├── App.jsx              # Main application component
├── App.css              # Application styling
├── aiService.js         # Google Generative AI integration
├── mockAi.js            # Mock data for fallback/testing
├── main.jsx             # React entry point
├── index.css            # Global styles
├── hooks/
│   └── useLocalStorage.js  # Custom hook for localStorage
└── assets/              # Static assets
```

## Available Scripts 🛠️

- `npm run dev` - Start development server with hot module replacement
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint to check code quality

## Environment Variables 🔐

Create a `.env.local` file in the project root:

```env
VITE_GEMINI_API_KEY=your_google_gemini_api_key
```

**Optional:** If the API key is missing, the app will use mock data for demonstration purposes.

## Features in Detail 🎯

### Activity Generation
Generate AI-powered content including:
- Lyrics for animated songs
- Game rules and instructions
- Team-building exercises
- Icebreaker activities

### Smart Filtering
Filter activities by:
- **Age Groups**: Babies, Toddlers, Kids, Teens, Adults
- **Group Size**: Solo, Small group, Large group
- **Environments**: Indoor, Outdoor, Camping, Beach, Mountains
- **Season**: Spring, Summer, Fall, Winter
- **Duration**: Quick (5-15 min), Medium (15-30 min), Long (30+ min)

### User Experience
- Beautiful, responsive design
- Smooth animations and transitions
- Real-time content generation
- Copy and print functionality
- Favorites system with local storage

## Development 👨‍💻

### Project Setup & Customization

The project uses Vite for fast development and React for the UI. To modify or extend:

1. **Add new activity types**: Edit filters in `App.jsx`
2. **Customize prompts**: Modify `aiService.js` to change AI behavior
3. **Style changes**: Update `App.css` for look and feel
4. **Add new hooks**: Extend `hooks/` directory as needed

### ESLint Configuration

The project includes ESLint rules for React best practices. Run:
```bash
npm run lint
```

## API Integration 🔌

The tool integrates with Google's Generative AI API via the `generateActivityContent()` function. It:
- Takes user preferences and parameters
- Generates contextual, creative content
- Handles errors gracefully with mock data fallback

## Browser Support 🌐

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance ⚡

- Fast build times with Vite
- Optimized bundle size
- Smooth animations with Framer Motion
- Efficient state management with React hooks

## Troubleshooting 🔧

### API Key Issues
- Verify your Gemini API key is correctly set in `.env.local`
- Check that the key has proper permissions
- The app will automatically fall back to mock data if the API fails

### Build Issues
- Clear `node_modules` and reinstall: `npm install`
- Delete `.vite` cache directory
- Ensure Node.js version is v16+

## Future Enhancements 🌟

- [ ] Multilingual support (Arabic, French, etc.)
- [ ] Activity templates library
- [ ] Export to PDF/Word
- [ ] Collaboration features for team planning
- [ ] Video tutorials for activities
- [ ] Mobile app version

## Contributing 💡

Suggestions and improvements are welcome! Feel free to modify and extend the tool for your needs.

## License 📄

This project is provided as-is for educational and organizational use.

## Support 🤝

For questions or issues:
1. Check the `.env.local` file for proper API key configuration
2. Review the console for error messages
3. Try the development server: `npm run dev`

---

**Happy animating! 🎉** Use this tool to create amazing experiences for your groups and events.
