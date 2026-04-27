<!-- BEGIN:nextjs-agent-rules -->

# Development Guidelines & Technical Standards

This document outlines the mandatory architectural and design patterns for this project. Adherence to these standards is required for all code contributions.

## 1. Core Architecture & Naming

- **Strict Typing**: All development must be performed using **TypeScript**.
- **Naming Conventions**: Use `kebab-case` for all file and directory names to ensure consistency across environments.
- **Component Strategy**:
  - **Modular Sections**: Page-specific sections must be implemented directly within `page.tsx`. Local sections should not be abstracted into separate component files.
  - **Shared Components**: Global, reusable components must be organized within the `components/` directory, with each component isolated in its own dedicated sub-folder.

## 2. Styling & UI Systems

- **Primary Styling**: Utilize **CSS Modules** as the standard for component-level styling to ensure encapsulation.
- **Utility Frameworks**: Minimize the use of Tailwind CSS. Tailwind should be reserved for high-level layout adjustments only.
- **Iconography**: Implement standard UI icons using the `lucide-react` library.

## 3. Motion & Interaction Design

- **Core Animations**: All primary reveal and entrance animations must be powered by **GSAP**. Focus on high-fidelity techniques including:
  - Complex masking and reveal effects.
  - Fluid sliding transitions.
  - Sophisticated staggerness to achieve a natural, premium aesthetic.
- **Smooth Scrolling**: Integrate the **Lenis** plugin to provide a high-end, momentum-based scrolling experience.
- **Micro-interactions**: Use `framer-motion` for localized UI feedback and interactive micro-animations.

## 4. Localization

- **Default Language**: All site content, production copy, and interface labels must be authored in **Spanish** unless explicitly directed otherwise.

<!-- END:nextjs-agent-rules -->
