# Using mockData in Development

This project is configured to exclude the `src/mockData` folder from production builds. This reduces bundle size and prevents exposing sensitive development data in production.

## How It Works

1. The Vite configuration in `vite.config.ts` is set up to:

   - Mark the mockData folder as external
   - Use tree-shaking to remove unused imports
   - Replace all mockData imports with empty modules in production

2. The `src/utils/dev-utils.ts` file provides utility functions to conditionally load mock data only in development.

## How to Use Mock Data

### Option 1: Using the dev-utils helpers

```typescript
import { getMockData, isDevelopment } from "../utils/dev-utils";

async function loadData() {
  if (isDevelopment) {
    // This code only runs in development
    const mockData = await getMockData(() => import("../mockData/data"));
    return mockData;
  } else {
    // Production code path
    return await fetchRealData();
  }
}
```

### Option 2: Conditional imports with environment checks

```typescript
import { isDevelopment } from "../utils/dev-utils";

async function getData() {
  if (isDevelopment) {
    // Dynamic import that will be excluded from production builds
    const { preferencesMock } = await import("../mockData/preferences");
    return preferencesMock;
  }

  // Production code path
  return await fetchRealPreferences();
}
```

### Option 3: Using the development callback helper

```typescript
import { runInDevelopment } from "../utils/dev-utils";

function setupMockEnvironment() {
  runInDevelopment(() => {
    // This code only executes in development
    import("../mockData/preferences").then(({ preferencesMock }) => {
      // Set up mock environment
      window.preferences = preferencesMock;
    });
  });
}
```

## Best Practices

1. Never import from mockData using static imports at the top of your files
2. Always wrap mock data usage in conditional checks using the provided utilities
3. Make sure all mockData imports are dynamic (using `import()`) rather than static
4. When adding new mock files, update `src/utils/mock-empty.ts` with empty versions of any named exports

By following these guidelines, you ensure that your mock data stays in development and does not get bundled into production builds.
