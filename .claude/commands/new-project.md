Customize this base template for a new project called $ARGUMENTS:

1. Update .claude/CLAUDE.md:
   - Change project name to $ARGUMENTS
   - Keep all architecture docs, just update the description

2. Ask me about the project:
   - What is the website for? (portfolio, agency, product, art, etc.)
   - What's the color scheme? (dark/light, specific colors)
   - What's the mood? (minimal, dramatic, playful, luxury, etc.)
   - How many sections? What are they?
   - Any specific 3D effects wanted?

3. After I answer, update:
   - CSS variables in main.css (colors, fonts)
   - Section content in index.html
   - Meta tags (title, description, OG tags)
   - Components in world.js
   - Scroll timeline in animations.js

4. Commit with message "Initialize [project name] from 3d-base template"
