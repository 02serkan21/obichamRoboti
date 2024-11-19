import * as THREE from "three";
import getLayer from "./getLayer.js";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import { GLTFLoader } from "jsm/loaders/GLTFLoader.js";

const w = window.innerWidth;
const h = window.innerHeight;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer();
renderer.setSize(w, h);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const rotationSpeed = 0.05;
let rotateX = 0;
let rotateY = 0;

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp") rotateX = 1;
  else if (event.key === "ArrowDown") rotateX = -1;
  else if (event.key === "ArrowLeft") rotateY = -1;
  else if (event.key === "ArrowRight") rotateY = 1;
});

document.addEventListener("keyup", () => {
  rotateX = 0;
  rotateY = 0;
});

let robot;

const ctrls = new OrbitControls(camera, renderer.domElement);
ctrls.enableDamping = true;

const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "/obchiam-roboti/assets/SEKO1.glb",
  (gltf) => {
    robot = gltf.scene;
    robot.traverse((child) => {
      if (child.isMesh) {
        child.geometry.center();
        child.material = new THREE.MeshStandardMaterial({
          color: 0xFFD700,
          metalness: 1,
          roughness: 0.2,
        });
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    robot.scale.multiplyScalar(0.4);
    scene.add(robot);
  },

);

const directionalLight = new THREE.DirectionalLight(0xFF4444, 200);
directionalLight.position.set(5, 4, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

const gradientBackground = getLayer({
  hue: 0.5,
  numSprites: 8,
  opacity: 0.2,
  radius: 10,
  size: 24,
  z: -15.5,
});
scene.add(gradientBackground);

function animate() {
  requestAnimationFrame(animate);

  if (robot) {
    robot.rotation.x += rotateX * rotationSpeed;
    robot.rotation.y += rotateY * rotationSpeed;
  }

  renderer.render(scene, camera);
  ctrls.update();
}

animate();

window.addEventListener("resize", handleWindowResize, false);


