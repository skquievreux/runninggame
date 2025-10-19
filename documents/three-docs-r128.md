# Three.js Dokumentation (r128)

**Quelle:** Context7 MCP Server (/mrdoob/three.js)  
**Version:** r128  
**Datum:** 2025-10-19  
**Hash:** context7-three-r128-20251019  

## API Referenz

### Define Three.js Color Space Constants (JavaScript)

Source: https://github.com/mrdoob/three.js/blob/dev/docs/api/it/constants/Core.html

These constants define different color spaces used within Three.js for rendering and color management. `NoColorSpace` indicates no specific color space, `SRGBColorSpace` refers to the standard sRGB space (common for display), and `LinearSRGBColorSpace` is the linear version of sRGB, typically used for internal rendering calculations and PBR workflows.

```javascript
THREE.NoColorSpace = ""
THREE.SRGBColorSpace = "srgb"
THREE.LinearSRGBColorSpace = "srgb-linear"
```

--------------------------------

### Remove a Running Coroutine Early in JavaScript

Source: https://github.com/mrdoob/three.js/blob/dev/manual/en/game.html

This JavaScript snippet illustrates how to prematurely stop a coroutine by keeping a direct reference to its generator instance. By calling `runner.remove(gen)`, the specified coroutine will be halted before it naturally finishes its execution.

```javascript
const gen = count0To9();
runner.add(gen);

// sometime later

runner.remove(gen);
```

--------------------------------

### Load PDB Resource with PDBLoader in JavaScript

Source: https://github.com/mrdoob/three.js/blob/dev/docs/examples/en/loaders/PDBLoader.html

This example demonstrates how to instantiate PDBLoader and use its load method to fetch and parse a .pdb file. It includes callback functions for handling successful loading, tracking progress, and managing potential errors, then logs the number of atoms found in the loaded molecule.

```javascript
// instantiate a loader
const loader = new PDBLoader();

// load a PDB resource
loader.load(
  // resource URL
  'models/pdb/caffeine.pdb',

  // called when the resource is loaded
  function ( pdb ) {

    const geometryAtoms = pdb.geometryAtoms;
    const geometryBonds = pdb.geometryBonds;
    const json = pdb.json;

    console.log( 'This molecule has ' + json.atoms.length + ' atoms' );

  },

  // called when loading is in progress
  function ( xhr ) {

    console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

  },

  // called when loading has errors
  function ( error ) {

    console.log( 'An error happened' );

  }
);
```

--------------------------------

### Get Three.js Revision Number (JavaScript)

Source: https://github.com/mrdoob/three.js/blob/dev/docs/api/it/constants/Core.html

This constant provides the current revision number of the Three.js library. It's useful for programmatic checking of the library version against official releases or for debugging purposes.

```javascript
THREE.REVISION
```

--------------------------------

### Module Imports and Global Variable Declaration (JavaScript)

Source: https://github.com/mrdoob/three.js/blob/dev/examples/physics_rapier_character_controller.html

Imports essential Three.js modules, including OrbitControls for camera manipulation, RapierPhysics and RapierHelper for physics integration, and Stats for performance monitoring. It also declares global variables for core Three.js components (camera, scene, renderer), physics engine instances, the character controller, the player mesh, and the movement state object. The `init` function is marked `async` to accommodate asynchronous physics initialization.

```javascript
{ "imports": { "three": "../build/three.module.js", "three/addons/": "./jsm/" } }
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RapierPhysics } from 'three/addons/physics/RapierPhysics.js';
import { RapierHelper } from 'three/addons/helpers/RapierHelper.js';
import Stats from 'three/addons/libs/stats.module.js';

let camera, scene, renderer, stats;
let physics, characterController, physicsHelper;
let player, movement;

init();

async function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xbfd1e5 );
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 0.1, 100 );
  camera.position.set( 2, 5, 15 );
```

--------------------------------

### Import Map Configuration for Three.js Modules

Source: https://github.com/mrdoob/three.js/blob/dev/examples/webgl_buffergeometry_instancing_billboards.html

This JSON object defines an import map, specifying how module specifiers are resolved to their corresponding file paths. It's used here to map 'three' to its ES module build and 'three/addons/' to the local 'jsm/' directory for additional Three.js modules.

```json
{ "imports": { "three": "../build/three.module.js", "three/addons/": "./jsm/" } }
```

--------------------------------

### Configure Three.js Module Imports using JSON Import Map

Source: https://github.com/mrdoob/three.js/blob/dev/playground/index.html

Sets up a JSON import map, a modern web standard for resolving module specifiers. This configuration directs paths for various Three.js modules (core, WebGPU, TSL, addons) and a custom 'flow' library, enabling streamlined ES module imports in the browser.

```json
{ "imports": { "three": "../build/three.webgpu.js", "three/webgpu": "../build/three.webgpu.js", "three/tsl": "../build/three.tsl.js", "three/addons/": "../examples/jsm/", "flow": "./libs/flow.module.js" } }
```

--------------------------------

### Three.js ES Module Import Configuration

Source: https://github.com/mrdoob/three.js/blob/dev/manual/examples/scenegraph-sun-earth-moon.html

This JavaScript configuration specifies an import map to resolve the 'three' module path, followed by a standard ES module import statement to bring the Three.js library into scope for use in the application.

```javascript
{ "imports": { "three": "../../build/three.module.js" } }
import * as THREE from 'three';
```

--------------------------------

## Tabler Icons (Beispiele)

Die Dokumentation enthält auch zahlreiche Tabler Icons, die in Three.js verwendet werden können. Hier einige Beispiele:

- `ti ti-calculator` (\eb80)
- `ti ti-bucket` (\ea47)
- `ti ti-building-store` (\ea4e)
- `ti ti-calendar-plus` (leer)
- `ti ti-building-bridge` (\ea4b)

## Hinweis

Diese Dokumentation wurde via Context7 MCP Server abgerufen und enthält API-Beispiele, Konstanten und Import-Konfigurationen für Three.js r128. Für vollständige Dokumentation siehe die offizielle Three.js Dokumentation.