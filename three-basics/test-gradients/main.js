import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import vertexShader from './shaders/vertex.glsl';
import fragmentShader from './shaders/fragment.glsl';
import vertexAtmosphere from './shaders/vertexAtmosphere.glsl';
import fragmentAtmosphere from './shaders/fragmentAtmosphere.glsl';
import vertexPoints from './shaders/vertexPoints.glsl';
import fragmentPoints from './shaders/fragmentPoints.glsl';
import fragmentSun from './shaders/fragmentSun.glsl';
import vertexSun from './shaders/vertexSun.glsl';
import { AdditiveBlending, Mesh } from 'three';

const scene  = new THREE.Scene();
const canvas = document.querySelector('canvas');
const camera = new THREE.PerspectiveCamera(
    75,
    canvas.offsetWidth/canvas.offsetHeight,
    0.1,
    1600
);
camera.position.z = 16;

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
});
renderer.setSize(canvas.offsetWidth,canvas.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const light = new THREE.PointLight({color:0xfdfbd3,intensity:10});
light.position.set(-100,0,1500);
scene.add(light);

const controls = new OrbitControls( camera, renderer.domElement );
controls.autoRotateSpeed = -2;
controls.autoRotate = true;
controls.update();
// create mesh
const geometry = new THREE.SphereGeometry(5,50,50);
/*
const material = new THREE.MeshBasicMaterial();

material.userData.globeTexture = {value: new THREE.TextureLoader().load('./img/texture_test2.jpg')};

material.onBeforeCompile = shader => {
    shader.uniforms.globeTexture = material.userData.globeTexture; 
    shader.vertexShader = vertexShader;
    shader.fragmentShader = fragmentShader;
};*/
// PLANET
const globeTexture = new THREE.TextureLoader().load('./img/texture_test2.jpg');
const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    /*
    blending:THREE.CustomBlending,
    blendEquation:THREE.AddEquation,
    blendSrc:THREE.OneFactor,
    blendDst:THREE.OneMinusDstColorFactor,*/
    uniforms:
      THREE.UniformsUtils.merge([
        THREE.UniformsLib['lights'],
        {
            lightIntensity: {type: 'f', value: .6},
            globeTexture: {type: 't', value: null}
        }
    ]),
    lights:true
});
material.uniforms.globeTexture.value = globeTexture;

const sphere = new THREE.Mesh(geometry,material);
//sphere.scale.set(0.8,0.8,0.8);
const materialAtmosphere = new THREE.ShaderMaterial({
    vertexShader: vertexAtmosphere,
    fragmentShader: fragmentAtmosphere,
    blending:THREE.CustomBlending,
    blendEquation:THREE.AddEquation,
    blendSrc:THREE.OneFactor,
    //blendDst:THREE.OneMinusDstColorFactor,
    blendDst:THREE.DstColorFactor,
    side:THREE.FrontSide,
    transparent:true,
    uniforms:{
        "c":   { type: "f", value: 0.8 },
		"p":   { type: "f", value: 3.0 },
        glowColor: { type: "c", value: new THREE.Color(0x66334c) },
        viewVector: { type: "v3", value: camera.position }
    }
});
const atmosphere = new THREE.Mesh(geometry,materialAtmosphere);
atmosphere.position.set(sphere.position.x,sphere.position.y,sphere.position.z);
atmosphere.scale.set(1.1,1.1,1.1);
//scene.add(atmosphere);

const planetGroup = new THREE.Group();
planetGroup.add(sphere);
planetGroup.add(atmosphere);
scene.add(planetGroup);

/// STARS
const starGeometry = new THREE.BufferGeometry();
//const starMaterial = new THREE.PointsMaterial({color:0xffffff});
const starVertices = [];
const amountStars = 2000;
for (let i = 0; i < amountStars; i++) {
    const x = (Math.random() - 0.5) * 2000; 
    const y = (Math.random() - 0.5) * 2000;
    const z = - (Math.random() - 0.5) * 1000;
    starVertices.push(x,y,z);
}
const starOpacities = new Float32Array(amountStars);
starGeometry.setAttribute('position',new THREE.Float32BufferAttribute(starVertices,3));
starGeometry.setAttribute('opacity',new THREE.BufferAttribute(starOpacities,1.));
const starMaterial = new THREE.ShaderMaterial({
    vertexShader:vertexPoints,
    fragmentShader:fragmentPoints,
    blending: THREE.AdditiveBlending,
    depthWrite:false,
    uniforms:{
        pointTexture: { value: new THREE.TextureLoader().load( "img/spark1.png" ) }
    }
})
const starts = new THREE.Points(starGeometry,starMaterial);
scene.add(starts);

const mouse = {
    x:undefined,
    y:undefined
}

// SUN
const sunMaterial = new THREE.ShaderMaterial({
    vertexShader:vertexSun,
    fragmentShader:fragmentSun,
    uniforms:{
        time:{
            type:'f',
            value:0.0
        }
    }
});
const sun = new THREE.Mesh(geometry,sunMaterial);
const sunMaterialAtmosphere = new THREE.ShaderMaterial({
    vertexShader:vertexAtmosphere,
    fragmentShader:fragmentAtmosphere,
    blending:THREE.CustomBlending,
    blendEquation:THREE.AddEquation,
    blendSrc:THREE.OneFactor,
    blendDst:THREE.DstColorFactor,
    side:THREE.FrontSide,
    uniforms:{
        "c":   { type: "f", value: .4 },
		"p":   { type: "f", value: 3. },
        glowColor: { type: "c", value: new THREE.Color(0xF57660) },
        viewVector: { type: "v3", value: camera.position }
    }
})
const sunAtmosphere = new Mesh(geometry,sunMaterialAtmosphere);
sunAtmosphere.scale.set(1.1,1.1,1.1);
sunAtmosphere.position.set(sun.position.x-1,sun.position.y,sun.position.z);
const sunGroup = new THREE.Group();
sunGroup.position.set(light.position.x,light.position.y,light.position.z);
sunGroup.scale.set(70,70,70);
sunGroup.add(sun);
sunGroup.add(sunAtmosphere);
scene.add(sunGroup);

const cameraXtarget = 5;
const cameraYtarget = 0;
const cameraZtarget = 10;
const cameraMovement = gsap.timeline({ease:'none',paused:true,repeat:0});
cameraMovement
            //.to( camera.position, {x:5, y: 0, z: 10, duration:10, delay: 3})
           // .to( camera.position, {x:5, y: 0, z: 10, duration:5},'-=0.2')
            .to(controls.target,{x:5,y:0,z:0,duration:5});

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene,camera);
    sphere.rotation.y += 0.004;
   // sphere.rotation.x -= 0.0001;
    gsap.to(planetGroup.rotation,{
        x:-mouse.y*0.3,
        y:mouse.x * 0.5,
        duration: 2
    });
   // atmosphere.material.uniforms.time.value += 0.007;
    sun.material.uniforms.time.value += .0025 ;
    const attributes = starts.geometry.attributes;
    for (let i = 0; i < attributes.opacity.array.length; i++) {
        attributes.opacity.array[ i ] = Math.random() * 0.5 + 0.5;
    }
    attributes.opacity.needsUpdate = true;
    controls.update();
    cameraMovement.play();
    
    materialAtmosphere.uniforms.viewVector.value = new THREE.Vector3().subVectors( camera.position,atmosphere.position);
	sunMaterialAtmosphere.uniforms.viewVector.value = new THREE.Vector3().subVectors( camera.position,sunAtmosphere.position);
}
animate();


addEventListener('mousemove',()=>{
    mouse.x = (event.clientX/innerWidth) * 2 -1;
    mouse.y = -(event.clientY/innerHeight) * 2 +1;
})
