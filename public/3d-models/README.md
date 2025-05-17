# 3D Models

This directory contains 3D models and assets for the Retroverse Festival application.

## Purpose

While the main 3D environment is currently loaded from Spline, this directory can be used for:

1. Additional 3D models that may be dynamically loaded
2. Custom avatars for users
3. Props and interactive elements
4. Alternative stage designs

## Supported Formats

The application supports the following 3D model formats:

- GLTF/GLB (recommended)
- OBJ
- FBX
- STL

## Integration with Three.js

To use these models with Three.js:

```javascript
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const loader = new GLTFLoader();
loader.load('/3d-models/your-model.glb', (gltf) => {
  scene.add(gltf.scene);
});
```

## Optimization Guidelines

For optimal performance:

- Keep polygon counts low (aim for <50k polygons per model)
- Use texture atlases where possible
- Compress textures appropriately
- Use LOD (Level of Detail) for complex models
- Ensure models are properly scaled

## Adding Custom Models

When adding custom models:

1. Place the model files in this directory
2. Update the relevant components to reference your new models
3. Test thoroughly for performance impact

## Legal Notice

Please ensure you have the rights to use any 3D models you add to this directory. Do not include copyrighted material without proper licensing.
