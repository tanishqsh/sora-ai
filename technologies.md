# Technology Stack Documentation

## Frontend Technologies

### Core Framework & Libraries

-   **Next.js** (v15.2.2) - React framework for production
-   **React** (v19.0.0) - UI library
-   **TypeScript** (v5) - Type-safe JavaScript
-   **Framer Motion** (v12.5.0) - Animation library

### Styling & UI

-   **Tailwind CSS** (v4) - Utility-first CSS framework
-   **PostCSS** - CSS preprocessor
-   Custom animations and keyframes
-   Custom font configurations (Geist Sans, Geist Mono, Noto Sans Arabic)

### Development Tools

-   **ESLint** (v9) - Code linting
-   **TurboRepo** - Build system optimization (via Turbopack)

## Backend Technologies

-   **Next.js API Routes** - Server-side functionality
-   **Node.js** - JavaScript runtime

## Machine Learning & Data Processing

-   **YOLOv8** - Object detection and tracking (based on notebook presence)
-   **Jupyter Notebooks** - Data analysis and model training
    -   Object tracking
    -   Audio processing
    -   Frame extraction

## Development & Build Tools

### Package Management

-   **npm/Node.js** - Package management
-   **package.json** - Dependency management

### Development Environment

-   **TypeScript** - Type checking and compilation
-   **ESLint** - Code quality and style enforcement
-   **.gitignore** - Version control exclusions

### Utility Libraries

-   **Lodash** (v4.17.21) - JavaScript utility library

## Project Structure

```
├── app/                  # Next.js 13+ app directory
├── components/          # React components
├── public/             # Static assets
├── .next/              # Next.js build output
└── ML Notebooks/       # Machine learning and data processing
```

## Configuration Files

-   **next.config.ts** - Next.js configuration
-   **tailwind.config.ts** - Tailwind CSS configuration
-   **postcss.config.mjs** - PostCSS configuration
-   **tsconfig.json** - TypeScript configuration
-   **eslint.config.mjs** - ESLint configuration

## Additional Features

-   Support for Arabic-English translation (based on translation files)
-   Audio processing capabilities
-   Video frame extraction and analysis
-   Object tracking and coordinate processing
