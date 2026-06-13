# Joel's Portfolio - React + Tailwind CSS Edition

A modern, responsive portfolio website built with **React**, **Tailwind CSS**, and **Vite**.

## Features

- ⚡ **Lightning Fast** - Built with Vite for instant HMR and optimized builds
- 🎨 **Modern Design** - Custom Tailwind theme with purple primary colors
- 📱 **Fully Responsive** - Mobile-first design that looks great on all devices
- ✨ **Smooth Animations** - Powered by Framer Motion
- 🧩 **Modular Components** - Reusable, maintainable React components
- 🔍 **Project Filtering** - Filter projects by category (Games, Graphics, Tools, Animation, Film)
- 📊 **Skills Showcase** - Interactive skill progress bars
- 🎯 **Smooth Scrolling** - Navigation with smooth scroll behavior

## Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS 3
- **Animations**: Framer Motion 10
- **Icons**: Lucide React
- **Routing**: React Router DOM

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navbar.jsx      # Navigation bar
│   ├── Footer.jsx      # Footer with links
│   └── BackToTop.jsx   # Scroll to top button
├── pages/              # Page sections
│   ├── Hero.jsx        # Hero/home section
│   ├── About.jsx       # About me section
│   ├── Publications.jsx # Publications section
│   ├── Projects.jsx    # Projects section
│   └── Skills.jsx      # Skills section
├── App.jsx             # Main app component
├── main.jsx            # Entry point
└── index.css           # Global styles
```

## Color Palette

- **Primary**: Purple (#6f42c1)
- **Secondary**: Slate (various shades)
- **Accent**: Red, Blue, Green, Orange

## Customization

### Adding New Projects

Edit `src/pages/Projects.jsx` and add to the `projects` array:

```jsx
{
  id: 21,
  title: 'Your Project',
  image: '/assets/img/...',
  description: 'Project description',
  tech: 'Technologies used',
  category: 'games', // games, graphics, tools, animation, film
  links: [
    { text: 'Link Name', url: 'https://...' }
  ]
}
```

### Modifying Colors

Edit `tailwind.config.js` to customize the color palette.

## Performance

- Optimized image loading with lazy loading
- Code splitting with Vite
- Minimal bundle size
- Fast initial page load

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this as a template for your own portfolio

## Contact

📧 joelcastro@berkeley.edu
🔗 [LinkedIn](https://linkedin.com/in/joel-castro-)
🐙 [GitHub](https://github.com/Joel-CA)
