/**
 * entry.js
 * 
 * This is the first file loaded. It sets up the Renderer, 
 * Scene and Camera. It also starts the render loop and 
 * handles window resizes.
 * 
 */
import './style.css';
import { WebGLRenderer, PerspectiveCamera, Scene, Vector3 } from 'three';
import UniverseScene from './objects/Scene.js';

const width = 500;
const height = 800;
const scene = new Scene();
const camera = new PerspectiveCamera(
  75,
  width/height,
  0.1,
  1600
);
const renderer = new WebGLRenderer({antialias: true});
const universeScene = new UniverseScene();

// scene
scene.add(universeScene);

// camera
camera.position.set(0,0,16);
camera.lookAt(new Vector3(0,0,0));

// renderer
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);

// render loop
const onAnimationFrameHandler = (timeStamp) => {
  renderer.render(scene, camera);
  universeScene.update && universeScene.update(timeStamp,camera);
  window.requestAnimationFrame(onAnimationFrameHandler);
}
window.requestAnimationFrame(onAnimationFrameHandler);

// resize
const windowResizeHanlder = () => { 
  //const { innerHeight, innerWidth } = window;
  //renderer.setSize(innerWidth, innerHeight);
  //camera.aspect = innerWidth / innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
};
windowResizeHanlder();
window.addEventListener('resize', windowResizeHanlder);

// dom
document.body.style.margin = 0;
document.body.appendChild( renderer.domElement );
