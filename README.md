# Link-Report

A dynamic reporting system with support for different build targets.

## Building for Different Targets

This project is configured to build different versions based on the configuration in `src/config/index.ts`.

### Default LVR Build

To build the application for LVR, run:

```bash
npm run build:lvr
```

This will:

1. Use the LVR-specific primary and secondary colors from the config
2. Build with the correct allowed domains for LVR
3. Output the build to the `dist/lvr` directory
4. Create a `build-config.json` file with the configuration used for the build

### Adding New Build Targets

To add a new target:

1. Update `src/config/index.ts` to include your new target:

```typescript
const config = {
  lvr: {
    // Existing LVR config
  },
  newTarget: {
    colors: {
      primary: "#ff0000",
      secondary: "#333333",
    },
    domains: ["example.com", "test.example.com"],
  },
};
```

2. Add a new build script in `package.json`:

```json
"scripts": {
  "build:newTarget": "cross-env BUILD_TARGET=newTarget vite build"
}
```

3. Run the build for your new target:

```bash
npm run build:newTarget
```

## How It Works

The build system:

1. Uses the primary and secondary colors from the config file to generate a complete color palette
2. Builds with the correct allowed domains for each target
3. Outputs each build to its own directory (`dist/[target]`)
4. Creates a build-specific config file for reference

## Development

During development, the application defaults to using LVR configuration.

To start the development server:

```bash
npm run dev
```
