import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap";

const canvas = document.querySelector("canvas.webgl");
const scene = new THREE.Scene();
const gui = new GUI();
const debugObject = {
  color: 0x0000ff,
};

// ============================================================================== Textures

const loadingManager = new THREE.LoadingManager()
loadingManager.onStart = () =>
{
    console.log('loadingManager: loading started')
}
loadingManager.onLoad = () =>
{
    console.log('loadingManager: loading finished')
}
loadingManager.onProgress = () =>
{
    console.log('loadingManager: loading progressing')
}
loadingManager.onError = () =>
{
    console.log('loadingManager: loading error')
}

const textureLoader = new THREE.TextureLoader(loadingManager)

// const colorTexture = textureLoader.load('/textures/checkerboard-1024x1024.png')
// const colorTexture = textureLoader.load('/textures/checkerboard-2x2.png')
const colorTexture = textureLoader.load(
    '/textures/minecraft.png',
    () =>
    {
        console.log('textureLoader: loading finished')
    },
    () =>
    {
        console.log('textureLoader: loading progressing')
    },
    () =>
    {
        console.log('textureLoader: loading error')
    }
)
colorTexture.colorSpace = THREE.SRGBColorSpace
colorTexture.wrapS = THREE.MirroredRepeatWrapping
colorTexture.wrapT = THREE.MirroredRepeatWrapping
// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5
// colorTexture.rotation = Math.PI * 0.25
// colorTexture.center.x = 0.5
// colorTexture.center.y = 0.5
colorTexture.generateMipmaps = false
colorTexture.minFilter = THREE.NearestFilter
colorTexture.magFilter = THREE.NearestFilter

const alphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const heightTexture = textureLoader.load('/textures/door/height.jpg')
const normalTexture = textureLoader.load('/textures/door/normal.jpg')
const ambientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const metalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const roughnessTexture = textureLoader.load('/textures/door/roughness.jpg')

// ==============================================================================  Mesh and Geometry

const geometry = new THREE.BoxGeometry(1, 1, 1, 5, 5, 5); // Segments are the triangle of perticular sides
const material = new THREE.MeshBasicMaterial({
  map: colorTexture,
  // color: debugObject.color,
  //   wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;  // Update sizes
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height; // Update camera
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height); // Update renderer
});

// ============================================================================== Camera

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 3;
scene.add(camera);

// ============================================================================== Debug controls

gui.add(mesh.position, "y").min(-3).max(3).step(0.01).name("elevation");
gui.add(material, "wireframe");

gui.addColor(debugObject, "color").onChange(() => {
  material.color.set(debugObject.color);
});

debugObject.spin = () => {
  gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 });
};

gui.add(debugObject, "spin");

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// ==============================================================================  Renderer

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setClearColor(0xd3d3d3);

// ==============================================================================  Animate

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
