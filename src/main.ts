import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { gsap } from "gsap";

const scene = new THREE.Scene();

// Define the frustum size for consistent scaling
const frustumSize = 20;
const aspect = window.innerWidth / window.innerHeight;

// Replace perspective camera with orthographic camera
const camera = new THREE.OrthographicCamera(
  (frustumSize * aspect) / -2, // left
  (frustumSize * aspect) / 2, // right
  frustumSize / 2, // top
  frustumSize / -2, // bottom
  0.1, // near
  1000 // far
);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Setup raycaster for hover effects
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const interactiveObjects: THREE.Object3D[] = [];

// Update window resize handler for orthographic camera
window.addEventListener("resize", () => {
  const newAspect = window.innerWidth / window.innerHeight;

  camera.left = (frustumSize * newAspect) / -2;
  camera.right = (frustumSize * newAspect) / 2;
  camera.top = frustumSize / 2;
  camera.bottom = frustumSize / -2;

  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add mouse move listener for hover detection
window.addEventListener("mousemove", (event) => {
  // Calculate mouse position in normalized device coordinates
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Adjust orbit controls damping for smoother interaction
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.screenSpacePanning = true; // For more intuitive panning

//icosahedron
const geometry = new THREE.IcosahedronGeometry(8);
const material = new THREE.MeshStandardMaterial({ color: 0x524c65 });

const icosahedron = new THREE.Mesh(geometry, material);
icosahedron.position.set(8, -12, -7);
icosahedron.rotateZ(Math.PI / 4);
scene.add(icosahedron);
// Store original and hover colors
icosahedron.userData.originalColor = 0x524c65;
icosahedron.userData.hoverColor = 0x4a0080; // dark purple
interactiveObjects.push(icosahedron);

//cone
const coneGeometry = new THREE.ConeGeometry(2, 3.5, 32);
const coneMaterial = new THREE.MeshStandardMaterial({ color: 0x6f9457 });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.rotateX(-Math.PI / 15);
cone.rotateZ(Math.PI / 10);
cone.position.set(-5, -6, 2);
scene.add(cone);
// Store original rotation and hover state for the cone
cone.userData.originalRotationY = cone.rotation.y;
cone.userData.isRotating = false;
interactiveObjects.push(cone);

//sphere
const sphereGeometry = new THREE.SphereGeometry(4, 32, 32);
// Use MeshStandardMaterial instead of MeshBasicMaterial to get a lighter version of the color
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x3a4b6e, // Lighter version of original color (0x273148)
  metalness: 0.1,
  roughness: 0.5,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(18, -6, -5);
scene.add(sphere);

//sphere2
const sphereGeometry2 = new THREE.SphereGeometry(1.5, 32, 32);
const sphereMaterial2 = new THREE.MeshStandardMaterial({ color: 0x485bb4 });
const sphere2 = new THREE.Mesh(sphereGeometry2, sphereMaterial2);
sphere2.position.set(10, -7, 2);
scene.add(sphere2);
// Store original Y position for hover animation
sphere2.userData.originalY = sphere2.position.y;
sphere2.userData.hovering = false;
interactiveObjects.push(sphere2);

// astronaut

new GLTFLoader().load("public/models/little_astronaut.glb", (gltf) => {
  const astronaut = gltf.scene;
  astronaut.position.set(8, -2, 5);
  astronaut.scale.set(3, 3, 3);
  astronaut.rotation.y = Math.PI / 4;
  astronaut.rotation.x = Math.PI / 8;
  astronaut.rotation.z = Math.PI / 8;

  astronaut.userData.initialY = astronaut.position.y;
  astronaut.userData.waveTime = 0;

  scene.add(astronaut);

  gsap.to(astronaut.position, {
    y: astronaut.position.y + 1,
    duration: 1.5,
    ease: "power1.inOut",
    repeat: -1,
    yoyo: true,
  });

  gsap.to(astronaut.rotation, {
    z: astronaut.rotation.z + 0.1,
    duration: 2,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
});

//moon
new GLTFLoader().load("public/models/low_poly_moon.glb", (gltf) => {
  const moon = gltf.scene;

  moon.rotateY(Math.PI);
  moon.rotateX(Math.PI / 2);
  moon.position.set(13.5, 6, 2);
  moon.scale.set(0.18, 0.18, 0.18);
  scene.add(moon);
});

// light;
const light = new THREE.AmbientLight(0xffffff, 2);
scene.add(light);

const pointLight = new THREE.PointLight(0xffffff, 60);
pointLight.position.set(15, 8, 6);
scene.add(pointLight);

//light2

const pointLight2 = new THREE.PointLight(0xffffff, 60);
pointLight2.position.set(11, -4, 0);
scene.add(pointLight2);

//light3
const pointLight3 = new THREE.PointLight(0xffffff, 80);
pointLight3.position.set(-3, -10, 8);
scene.add(pointLight3);

//light4
const pointLight4 = new THREE.PointLight(0xffffff, 80);
pointLight4.position.set(-12, -4, -2);
scene.add(pointLight4);

//light5
const pointLight5 = new THREE.PointLight(0xffffff, 100);
pointLight5.position.set(3, 5, 18);
scene.add(pointLight5);

//sphere models - load each one independently
let blueSphere: THREE.Group | null = null;
let greenSphere: THREE.Group | null = null;

// Load first sphere (blue)
new GLTFLoader().load("public/models/sphere.glb", (gltf) => {
  blueSphere = gltf.scene.clone();

  // Create truly independent materials for the blue sphere
  blueSphere.traverse((child: THREE.Object3D) => {
    if (child instanceof THREE.Mesh) {
      // Create a completely new material for each mesh
      const originalMaterial = child.material;
      if (originalMaterial) {
        // Create new material of the same type
        if (originalMaterial instanceof THREE.MeshStandardMaterial) {
          const newMaterial = new THREE.MeshStandardMaterial();
          // Copy relevant properties
          newMaterial.color.set(0x454751); // base color
          newMaterial.roughness = originalMaterial.roughness;
          newMaterial.metalness = originalMaterial.metalness;
          child.material = newMaterial;
        }
      }
    }
  });

  // Configure the sphere
  blueSphere.position.set(17, 4, -14);
  blueSphere.rotation.set(-Math.PI / 4, -Math.PI / 8, 0);
  blueSphere.scale.set(4, 4, 4);
  scene.add(blueSphere);

  // Store original color and hover color in userData
  blueSphere.userData.originalColor = 0x454751;
  blueSphere.userData.hoverColor = 0x0066ff; // blue
  blueSphere.userData.isHovered = false;
  blueSphere.userData.sphereId = "blueSphere";

  // Add to interactive objects for raycasting
  interactiveObjects.push(blueSphere);
});

// Load second sphere (green) - completely separate instance
new GLTFLoader().load("public/models/sphere.glb", (gltf) => {
  greenSphere = gltf.scene.clone();

  // Create truly independent materials for the green sphere
  greenSphere.traverse((child: THREE.Object3D) => {
    if (child instanceof THREE.Mesh) {
      // Create a completely new material for each mesh
      const originalMaterial = child.material;
      if (originalMaterial) {
        // Create new material of the same type
        if (originalMaterial instanceof THREE.MeshStandardMaterial) {
          const newMaterial = new THREE.MeshStandardMaterial();
          // Copy relevant properties
          newMaterial.color.set(0x454751); // base color
          newMaterial.roughness = originalMaterial.roughness;
          newMaterial.metalness = originalMaterial.metalness;
          child.material = newMaterial;
        }
      }
    }
  });

  // Configure the sphere
  greenSphere.position.set(-16, -8, -14);
  greenSphere.rotation.set(-Math.PI / 4, Math.PI / 8, 0);
  greenSphere.scale.set(3, 3, 3);
  scene.add(greenSphere);

  // Store original color and hover color in userData
  greenSphere.userData.originalColor = 0x454751;
  greenSphere.userData.hoverColor = 0x6f9457; // green
  greenSphere.userData.isHovered = false;
  greenSphere.userData.sphereId = "greenSphere";

  // Add to interactive objects for raycasting
  interactiveObjects.push(greenSphere);
});

//grid
const gridHelper = new THREE.GridHelper(40, 20, 0x2e2f3e, 0x2e2f3e);
gridHelper.rotateX(-Math.PI / 2);
scene.add(gridHelper);

// Check intersections and handle hover effects
function checkIntersections() {
  // Update the picking ray with the camera and mouse position
  raycaster.setFromCamera(mouse, camera);

  // Calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(scene.children, true);

  // Track if each object is currently being hovered
  let blueSphereHovered = false;
  let greenSphereHovered = false;
  let icosahedronHovered = false;
  let coneHovered = false;
  let sphere2Hovered = false;

  // Check for intersections with our interactive objects
  for (const intersect of intersects) {
    const object = intersect.object;

    // Check if this intersected object is or belongs to our interactive objects
    if (blueSphere && hasParent(object, blueSphere)) {
      blueSphereHovered = true;
    }
    if (greenSphere && hasParent(object, greenSphere)) {
      greenSphereHovered = true;
    }
    if (hasParent(object, icosahedron)) {
      icosahedronHovered = true;
    }
    if (hasParent(object, cone)) {
      coneHovered = true;
    }
    if (hasParent(object, sphere2)) {
      sphere2Hovered = true;
    }
  }

  // Handle hover and non-hover states for our objects

  // Blue Sphere hover handling
  if (blueSphere) {
    if (blueSphereHovered && !blueSphere.userData.isHovered) {
      // Apply hover effect
      blueSphere.userData.isHovered = true;
      blueSphere.traverse((child: THREE.Object3D) => {
        if (
          child instanceof THREE.Mesh &&
          child.material &&
          !Array.isArray(child.material)
        ) {
          // Store the colors in local variables to satisfy TypeScript
          const hoverColor = blueSphere!.userData.hoverColor;
          gsap.to(child.material.color, {
            r: new THREE.Color(hoverColor).r,
            g: new THREE.Color(hoverColor).g,
            b: new THREE.Color(hoverColor).b,
            duration: 0.5,
          });
        }
      });
    } else if (!blueSphereHovered && blueSphere.userData.isHovered) {
      // Remove hover effect
      blueSphere.userData.isHovered = false;
      blueSphere.traverse((child: THREE.Object3D) => {
        if (
          child instanceof THREE.Mesh &&
          child.material &&
          !Array.isArray(child.material)
        ) {
          // Store the colors in local variables to satisfy TypeScript
          const originalColor = blueSphere!.userData.originalColor;
          gsap.to(child.material.color, {
            r: new THREE.Color(originalColor).r,
            g: new THREE.Color(originalColor).g,
            b: new THREE.Color(originalColor).b,
            duration: 0.5,
          });
        }
      });
    }
  }

  // Green Sphere hover handling
  if (greenSphere) {
    if (greenSphereHovered && !greenSphere.userData.isHovered) {
      // Apply hover effect
      greenSphere.userData.isHovered = true;
      greenSphere.traverse((child: THREE.Object3D) => {
        if (
          child instanceof THREE.Mesh &&
          child.material &&
          !Array.isArray(child.material)
        ) {
          // Store the colors in local variables to satisfy TypeScript
          const hoverColor = greenSphere!.userData.hoverColor;
          gsap.to(child.material.color, {
            r: new THREE.Color(hoverColor).r,
            g: new THREE.Color(hoverColor).g,
            b: new THREE.Color(hoverColor).b,
            duration: 0.5,
          });
        }
      });
    } else if (!greenSphereHovered && greenSphere.userData.isHovered) {
      // Remove hover effect
      greenSphere.userData.isHovered = false;
      greenSphere.traverse((child: THREE.Object3D) => {
        if (
          child instanceof THREE.Mesh &&
          child.material &&
          !Array.isArray(child.material)
        ) {
          // Store the colors in local variables to satisfy TypeScript
          const originalColor = greenSphere!.userData.originalColor;
          gsap.to(child.material.color, {
            r: new THREE.Color(originalColor).r,
            g: new THREE.Color(originalColor).g,
            b: new THREE.Color(originalColor).b,
            duration: 0.5,
          });
        }
      });
    }
  }

  // Icosahedron hover handling
  if (icosahedronHovered && !icosahedron.userData.isHovered) {
    icosahedron.userData.isHovered = true;
    const meshMaterial = (icosahedron as THREE.Mesh)
      .material as THREE.MeshStandardMaterial;
    gsap.to(meshMaterial.color, {
      r: new THREE.Color(icosahedron.userData.hoverColor).r,
      g: new THREE.Color(icosahedron.userData.hoverColor).g,
      b: new THREE.Color(icosahedron.userData.hoverColor).b,
      duration: 0.5,
    });
  } else if (!icosahedronHovered && icosahedron.userData.isHovered) {
    icosahedron.userData.isHovered = false;
    const meshMaterial = (icosahedron as THREE.Mesh)
      .material as THREE.MeshStandardMaterial;
    gsap.to(meshMaterial.color, {
      r: new THREE.Color(icosahedron.userData.originalColor).r,
      g: new THREE.Color(icosahedron.userData.originalColor).g,
      b: new THREE.Color(icosahedron.userData.originalColor).b,
      duration: 0.5,
    });
  }

  // Cone hover handling
  if (coneHovered && !cone.userData.isRotating) {
    cone.userData.isRotating = true;
    gsap.to(cone.rotation, {
      y: cone.rotation.y + Math.PI * 2,
      duration: 4,
      ease: "linear",
      repeat: -1,
    });
  } else if (!coneHovered && cone.userData.isRotating) {
    cone.userData.isRotating = false;
    gsap.killTweensOf(cone.rotation, "y");
    gsap.to(cone.rotation, {
      y: cone.userData.originalRotationY,
      duration: 0.5,
    });
  }

  // Sphere2 hover handling
  if (sphere2Hovered && !sphere2.userData.hovering) {
    sphere2.userData.hovering = true;
    gsap.to(sphere2.position, {
      y: sphere2.userData.originalY + 2,
      duration: 0.8,
      ease: "power2.out",
    });
  } else if (!sphere2Hovered && sphere2.userData.hovering) {
    sphere2.userData.hovering = false;
    gsap.to(sphere2.position, {
      y: sphere2.userData.originalY,
      duration: 0.5,
      ease: "power2.out",
    });
  }
}

// Helper function to check if an object is a child of a parent (or is the parent)
function hasParent(obj: THREE.Object3D, parent: THREE.Object3D): boolean {
  let current = obj;

  while (current) {
    if (current === parent) {
      return true;
    }
    current = current.parent as THREE.Object3D;
  }

  return false;
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // Check for hover interactions
  checkIntersections();

  renderer.render(scene, camera);
}

animate();
