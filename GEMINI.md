# Three.js Room-Based Health Game

## Project Overview
A first-person POV game with fixed 3D scenes where players interact with objects in different rooms of a house. No character movement - player clicks objects to affect their health bar, which gradually decreases over time. Simple, light aesthetic similar to Escape Simulator.

## Core Mechanics
- **Fixed camera perspective** in each room (first-person POV, no movement)
- **Click-based interaction** with 3D objects (bed, chair, fridge, etc.)
- **Health system**: bar gradually decreases over time, increases when interacting with certain objects
- **Room navigation**: map UI to switch between 3-4 rooms (bedroom, kitchen, living room, bathroom)
- **Light, clean visual style**: low-poly models, simple colors, user-friendly interface

## Technical Stack
- **Three.js** for 3D rendering and scene management
- **Vanilla JavaScript** for game logic
- **HTML/CSS** for UI elements (health bar, map overlay)
- **GLTF/GLB** format for 3D models

## Asset Management
- Use low-poly 3D models (under 10k polygons per object)
- Organize by room: `/models/bedroom/`, `/models/kitchen/`, etc.
- Keep textures small (512x512 or 1024x1024 max)
- Alternative: Use Three.js primitive geometries (BoxGeometry, CylinderGeometry) for prototyping

## Architecture Guidelines

### Scene Structure
- One Three.js scene per room
- Fixed camera position and rotation (no OrbitControls)
- Raycaster for click detection on interactive objects
- Store object metadata (health effect, interaction type) in userData

### Game State
```javascript
{
  currentRoom: 'bedroom',
  health: 100,
  maxHealth: 100,
  healthDecayRate: 1, // per second
  rooms: ['bedroom', 'kitchen', 'living_room', 'bathroom'],
  interactableObjects: [
    { id: 'bed', room: 'bedroom', healthEffect: +20, cooldown: 5000 },
    { id: 'fridge', room: 'kitchen', healthEffect: +10, cooldown: 3000 }
  ]
}
```

### Key Systems to Implement
1. **Health System**: Gradual decay over time, clamped between 0-100
2. **Object Interaction**: Click detection → health modification → visual/audio feedback
3. **Room Switching**: Unload current scene, load new room scene from map UI
4. **UI Layer**: Health bar (HTML overlay), map modal (click to switch rooms)
5. **Save/Load**: Optional - persist health and room state

## Performance Considerations
- Dispose of geometries/materials when switching rooms to prevent memory leaks
- Use object pooling if reusing similar objects across rooms
- Implement basic frustum culling (Three.js does this by default)
- Load models asynchronously with loading screen

## Visual Style Guidelines
- **Lighting**: Soft ambient light + one directional light per room
- **Colors**: Pastel or muted palette, high contrast for interactive objects
- **Models**: Low-poly aesthetic, avoid excessive detail
- **UI**: Minimalist, non-intrusive (health bar at top, map button in corner)

## File Structure Suggestion
```
/project
  /models
    /bedroom
    /kitchen
    /living_room
  /textures
  /sounds (optional)
  index.html
  main.js
  game-state.js
  scene-manager.js
  ui-manager.js
  styles.css
```

## Important Notes for AI Assistance
- **No localStorage/sessionStorage** - Use in-memory storage or the window.storage API if persistence is needed
- **Three.js version**: Use r128 or compatible (Cloudflare CDN limitation)
- **No npm packages** - Must work with CDN imports only
- **Browser compatibility**: Target modern browsers (Chrome, Firefox, Safari, Edge)
- Prioritize **functionality over visual flair** for initial prototype
- Keep code modular - separate scene logic, game state, and UI management

## Development Phases
1. **Phase 1**: Single room with primitive shapes, basic click detection, health bar
2. **Phase 2**: Add health decay system, multiple interactable objects with different effects
3. **Phase 3**: Implement room switching with map UI
4. **Phase 4**: Add 3D models, improve visuals, sound effects (optional)
5. **Phase 5**: Polish UI, add cooldowns, win/lose conditions

## Win/Lose Conditions (Optional)
- **Lose**: Health reaches 0 → game over screen
- **Win**: Survive for X minutes or complete specific objectives
- **Endless mode**: Keep health above 0 as long as possible

## Future Enhancements (Post-MVP)
- Sound effects for interactions
- Day/night cycle affecting health decay rate
- Item inventory system
- Multiple save slots
- Mobile touch support
- Room customization/unlocks

---

**Priority**: Build a working prototype with basic mechanics first, then iterate on visuals and features. Focus on solid game loop: health decay → player must interact → room navigation → repeat.

Phase 1: Core Mechanics & Single Room
   * Objective: Establish the fundamental gameplay loop in a singl,
      controlled environment.
   * Features:
       * Set up one room with a fixed first-person camera.
       * Use primitive shapes (cubes, spheres) as placeholders for 
         interactive objects.
       * Implement click-to-interact functionality using a
         raycaster.
       * Create the basic health bar UI and implement the gradual  
         health decay.
       * Link object interaction to increase the player's health.  

  Phase 2: Expanding Interactions
   * Objective: Introduce variety and constraints to the core      
     mechanics.
   * Features:
       * Add several new objects with different health-restoring   
         values.
       * Implement a cooldown system to prevent spamming
         interactions.
       * Add simple visual feedback for interactions (e.g., object 
         highlighting).

  Phase 3: Multi-Room Navigation (Completed)
   * Objective: Implement the full scope of the game world.        
   * Features:
       * Create the remaining room scenes (kitchen, living room,   
         bathroom).
       * Build a map UI that allows the player to switch between te
          different rooms.
       * Ensure the health state is persistent when moving between 
         rooms.
       * Manage scene loading and unloading to conserve resources. 

  Phase 4: Visual Polish & Asset Integration (Current)
   * Objective: Replace placeholder assets and define the game's   
     aesthetic.
   * Features:
       * Source or create low-poly 3D models for all interactive   
         objects.
       * Replace the primitive shapes with the final 3D models.    
       * Implement a lighting scheme that matches your desired     
         "light, clean" visual style.
       * Refine the UI to be more polished and user-friendly.      

  Phase 5: Game Finalization
   * Objective: Complete the game loop by adding win/loss conditios
      and final polish.
   * Features:
       * Implement a "Game Over" state for when health reaches zer.
       * Define and implement a win condition (e.g., surviving fora
          set amount of time).
       * Add a simple start screen and a way to restart the game.  
       * (Optional) Add sound effects and a basic save/load featur.
