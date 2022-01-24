import * as THREE from 'three';
import "./index.css";

let camera, scene, renderer, lifeRenderer;
let lifeScene, lifeRenderTarget;

const mainUniforms = {
  u_time: { value: 0 },
  u_resolution:  { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  u_frame: {value: 0 },
  u_texture: {value: null}
};

const uniforms = {
  u_time: { value: 0 },
  u_resolution:  { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  u_frame: {value: 0 },
};

let lifeShader, mainShader;
fetch("/shaders/main.frag")
  .then((r) => r.text())
  .then((t) => mainShader = t)
  .then(() => {
    fetch("/shaders/life.frag")
      .then((r) => r.text())
      .then((t) => lifeShader = t)
      .then(init)
      .then(img)
      .then(life)
  });

let texture;

function init() {
  // Boilerplate: camera, scene, renderer
  camera = new THREE.OrthographicCamera(-1,1,1,-1,-1,1);
  scene = new THREE.Scene();


  texture = new THREE.TextureLoader().load('noise.jpg');

  renderer = new THREE.WebGLRenderer({antialias: true});
  lifeRenderTarget = new THREE.WebGLRenderTarget(document.body.clientWidth, document.body.clientHeight);
  lifeScene = new THREE.Scene();
  document.body.appendChild( renderer.domElement );
  function resize() {
    renderer.setSize( document.body.clientWidth, document.body.clientHeight );
    lifeRenderTarget.setSize( document.body.clientWidth, document.body.clientHeight );
    uniforms.u_resolution.value.set(document.body.clientWidth, document.body.clientHeight);
    mainUniforms.u_resolution.value.set(document.body.clientWidth, document.body.clientHeight);
  }
  resize()
  window.addEventListener('resize', resize, false);

  
  renderer.setAnimationLoop( main );
}

// main is the hot loop, passed to setAnimationLoop by init()
function main( time, frame ) {
  uniforms.u_time.value = time * 0.001;
  uniforms.u_frame.value = frame;

  mainUniforms.u_time.value = time * 0.001;
  mainUniforms.u_frame.value = frame;

  // populate buffer
  renderer.setRenderTarget(lifeRenderTarget);
  renderer.render( lifeScene, camera );

  // render to canvas
  renderer.setRenderTarget(null);
  mainUniforms.u_texture.value = lifeRenderTarget.texture;
  renderer.render( scene, camera );
}

function life() {
  // PlaneBufferGeometry is deprecated, use PlaneGeometry in the future?
  const plane = new THREE.PlaneBufferGeometry(2,2);

  const material = new THREE.ShaderMaterial({
    fragmentShader: lifeShader,
    uniforms,
  });
  lifeScene.add(new THREE.Mesh(plane, material));
}

// img defines what finally gets rendered to the scene.
function img() {
  const plane = new THREE.PlaneBufferGeometry(2,2);

  const material = new THREE.ShaderMaterial({
    fragmentShader: mainShader,
    uniforms: mainUniforms,
  });

  scene.add(new THREE.Mesh(plane, material));
}
