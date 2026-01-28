# Forsaken Hunter

A browser-based 2D action platformer game built with HTML5 Canvas and vanilla JavaScript. Battle through a haunted castle, defeat ghostly enemies, and survive as long as possible in this thrilling adventure.

![Game Preview](https://img.shields.io/badge/Type-2D%20Platformer-blue)
![Status](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

- **Engaging Combat System**: Attack enemies with a sword, complete with cooldowns and visual feedback
- **Intelligent Enemy AI**: Ghost enemies that actively track and pursue the player
- **Platforming Mechanics**: Navigate across multiple platforms with gravity-based physics
- **Score System**: Earn points by defeating enemies and compete for the highest score
- **Persistent High Scores**: Your best scores are saved locally using localStorage
- **Animated Characters**: Smooth sprite animations for idle, running, jumping, and attacking states
- **Immersive Audio**: Background music and sound effects for attacks and damage
- **Health System**: Monitor your health bar and survive enemy encounters
- **Timer Challenge**: Complete objectives within the 300-second time limit
- **Multiple Character Colors**: Choose from blue, green, purple, or red character variants

## Game Controls

| Key       | Action                 |
| --------- | ---------------------- |
| `←` / `→` | Move Left / Right      |
| `↑`       | Jump                   |
| `Space`   | Attack with Sword      |
| Click     | Start Background Music |

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, or Edge)
- No additional dependencies required

### Installation

1. Clone or download the repository:

   ```bash
   git clone https://github.com/yourusername/forsaken-hunters.git
   cd forsaken-hunters
   ```

2. Open `Index.html` in your web browser to start the game

   Or use a local server:

   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js (with http-server installed)
   npx http-server
   ```

3. Navigate to `http://localhost:8000` in your browser

### Project Structure

```
forsaken-hunters/
├── Index.html              # Main menu page
├── Maingame.html           # Game interface
├── MaingameJS.js           # Core game logic
├── simpleGame.js           # Custom game engine library
├── generic_char_v0.2/      # Character sprite sheets
│   ├── png/
│   │   ├── blue/
│   │   ├── green/
│   │   ├── purple/
│   │   └── red/
│   └── guide.png
├── music/                  # Audio files
│   ├── backgoundSong.mp3
│   ├── hurt.mp3
│   ├── loop2.mp3
│   └── swordAttack.mp3
└── [Game Assets]           # Images and sprites
```

## Gameplay

### Objective

Survive as long as possible while defeating ghost enemies in the haunted castle. Earn points for each enemy defeated and try to beat your high score!

### Mechanics

- **Movement**: Use arrow keys to navigate the castle environment
- **Combat**: Press Space to attack enemies within range
- **Health**: Avoid enemy attacks to preserve your health bar
- **Time**: Complete your run within the 300-second limit
- **Scoring**: Each defeated enemy grants 1 point

### Enemy Behavior

Ghost enemies will:

- Detect the player within a 2000-pixel radius
- Actively pursue the player
- Deal damage on contact
- Reset to random positions when defeated

## Technical Details

### Technologies Used

- **HTML5 Canvas**: Game rendering and graphics
- **Vanilla JavaScript**: Game logic and mechanics
- **CSS3**: UI styling and animations
- **localStorage**: High score persistence
- **Web Audio API**: Sound effects and music

### Game Engine

The project uses a custom lightweight game engine (`simpleGame.js`) featuring:

- Sprite management and animation system
- Scene and camera handling
- Collision detection
- Input handling (keyboard, mouse, touch)
- Timer utilities
- Sound management

### Performance Considerations

- Game runs at approximately 20 FPS (50ms update interval)
- Optimized collision detection for sprites
- Efficient sprite rendering with canvas transformations
- Asset preloading for smooth gameplay

## Development

### Customizing the Game

**Adjust Difficulty**

```javascript
// In MaingameJS.js, modify enemy settings
var moveSpeed = 4; // Enemy movement speed
var detectionRadius = 2000; // Enemy detection range
```

**Change Time Limit**

```javascript
// In MaingameJS.js
var timeLeft = 300; // Time in seconds
```

**Modify Player Stats**

```javascript
// In MaingameJS.js, Player() function
player.health = 100; // Player health
player.maxspeed = 10; // Maximum speed
player.jumpStrength = -20; // Jump power
```

### Adding New Platforms

```javascript
// In createPlatforms() function
var newPlatform = new Sprite(scene, "platform_image.png", 100, 20);
newPlatform.setPosition(x_position, y_position);
newPlatform.setSpeed(0);
platforms.push(newPlatform);
```

## Browser Compatibility

| Browser | Version | Status          |
| ------- | ------- | --------------- |
| Chrome  | 90+     | ✅ Full Support |
| Firefox | 88+     | ✅ Full Support |
| Safari  | 14+     | ✅ Full Support |
| Edge    | 90+     | ✅ Full Support |

## Known Issues

- Audio may not autoplay in some browsers due to autoplay policies (click to start music)
- Touch controls are partially supported but not fully optimized for mobile devices

## Contributing

Contributions are welcome! Here are some ways you can help:

- Report bugs and issues
- Suggest new features
- Submit pull requests for improvements
- Add new levels or game modes
- Enhance the UI/UX
- Improve mobile responsiveness

## License

This project is open source and available under the MIT License.

## Credits

- **Game Engine**: Based on `simpleGame.js` by Andy Harris (2011-2012)
- **Animation System**: Enhanced by Tyler Mitchell
- **Design**: Forsaken Hunter development team

## Changelog

### Version 1.0.0 (Current)

- Initial release
- Core gameplay mechanics
- Enemy AI system
- Score tracking with localStorage
- Sound effects and background music
- Character animations

## Support

For questions, bug reports, or feature requests, please open an issue on GitHub.

---

**Enjoy playing Forsaken Hunter!** 🎮⚔️
