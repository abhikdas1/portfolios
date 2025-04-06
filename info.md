# ProfileCraft Portfolio Templates

This document provides information about the portfolio templates created for ProfileCraft, including their features, customization options, and usage instructions.

## Overview

ProfileCraft offers two professional portfolio templates that showcase skills, projects, experience, and other important sections for job seekers and professionals. Both templates are built with vanilla HTML, CSS, and JavaScript without external frameworks, making them lightweight and easy to customize.

## Template 1: Classic Professional

### Description
A clean, professional portfolio template with a traditional layout. It features a fixed navigation bar at the top, a centered content structure, and a light color scheme that puts focus on content.

### Features
- Fixed top navigation
- Hero section with profile image and CTA buttons
- Section-based layout with clear visual hierarchy
- Skill bars to display proficiency levels
- Project filtering by category
- Timeline presentation for education and experience
- Testimonial slider
- Contact form with validation
- Responsive design for all devices

### Customization
1. **Colors**: Edit the CSS variables in `/template-1/css/base.css` to change the color scheme.
2. **Fonts**: The template uses Google Fonts. Change the imports in `/template-1/css/style.css`.
3. **Content**: Replace placeholder text and images in `index.html`.
4. **Sections**: Each section can be rearranged, removed, or modified in the HTML structure.
5. **Animations**: Modify animation behavior in `/template-1/js/main.js`.

## Template 2: Modern Dark Theme

### Description
A modern, sleek portfolio template with a side navigation and dark theme option. It features animated transitions, card-based components, and a more contemporary design language.

### Features
- Side navigation with profile quick-view
- Dark/light theme toggle
- Modern card-based UI components
- Animated section transitions
- Typing effect on hero section
- Badge-style skill presentation
- Project overlay effect
- Timeline presentation for education and experience
- Testimonial grid/slider
- Contact form with enhanced validation and effects
- Responsive design with mobile-first approach

### Customization
1. **Colors**: Edit the CSS variables in `/template-2/css/base.css` to change both light and dark themes.
2. **Fonts**: The template uses Google Fonts. Change the imports in `/template-2/css/style.css`.
3. **Content**: Replace placeholder text and images in `index.html`.
4. **Layout**: The side navigation can be customized or switched to top navigation by modifying the CSS.
5. **Effects**: Animations and transitions can be adjusted in `/template-2/js/main.js`.
6. **Theme**: The default theme (light/dark) can be changed in the JavaScript file.

## Common Features

Both templates include:
- Semantic HTML5 markup
- CSS variables for easy customization
- Responsive design for all screen sizes
- Animated scroll effects
- Project filtering functionality
- Form validation
- Testimonial sliders
- Social media links
- Back to top button
- Mobile-friendly navigation

## File Structure

Each template follows this organization:
- `index.html` - Main HTML file with all sections
- `css/` folder:
  - `base.css` - Reset, variables, and typography
  - `layout.css` - Grid system and section layouts
  - `components.css` - UI component styles
  - `responsive.css` - Media queries for different screen sizes
  - `style.css` - Imports all other CSS files and contains additional custom styles
- `js/` folder:
  - `main.js` - Core functionality (navigation, animations, filtering)
  - `form.js` - Form validation and submission handling
- `assets/` folder - Contains all images and other media files

## How to Use

1. Choose the template that best fits your needs (Template 1 or Template 2).
2. Replace placeholder content with your personal information.
3. Add your own images to the `assets` folder.
4. Customize colors, fonts, and other styles to match your personal brand.
5. Test all interactive features to ensure they work as expected.
6. Deploy to your hosting service of choice.

## Browser Compatibility

Both templates are compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Opera (latest)

## Credits

- Font Awesome for icons
- Google Fonts for typography
- Placeholder images are for demonstration only and should be replaced

---

Created by ProfileCraft | A professional portfolio template service
