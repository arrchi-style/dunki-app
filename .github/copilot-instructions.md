# Angular 21 & Nx Best Practices for this Project

- **Architecture**: Use Nx patterns. Prefer libs over apps. Feature-based structure.
- **State Management**: Use ONLY Signals (`signal`, `computed`, `effect`). No Zone.js/RxJS for simple state.
- **Components**: Standalone components only. Use `changeDetection: ChangeDetectionStrategy.OnPush` (or zoneless default).
- **Styling**: Tailwind CSS classes only. No custom CSS unless necessary. Use SCSS for components.
- **Testing**: Vitest for unit tests, Playwright for E2E.
- **Logic**: Use `inject(Service)` instead of constructor injection.
- **Templates**: Use new control flow (`@if`, `@for`, `@switch`).