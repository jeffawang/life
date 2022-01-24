import * as THREE from 'three';
import "./index.css";

let camera, scene, renderer, canvas;

const uniforms = {
  u_time: { value: 0 },
  u_resolution:  { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  u_frame: {value: 0 },
};

let fragmentShader, vertexShader;

fetch("/shaders/life.frag")
  .then((r) => r.text())
  .then((t) => fragmentShader = t)
  .then(init)
  .then(img)

function init() {
  // Boilerplate: camera, scene, renderer
  camera = new THREE.OrthographicCamera(-1,1,1,-1,-1,1);
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({antialias: true});
  document.body.appendChild( renderer.domElement );
  function resize() {
    renderer.setSize( document.body.clientWidth, document.body.clientHeight );
    uniforms.u_resolution.value.set(document.body.clientWidth, document.body.clientHeight);
  }
  resize()
  window.addEventListener('resize', resize, false);

  
  renderer.setAnimationLoop( main );
}

// main is the hot loop, passed to setAnimationLoop by init()
function main( time, frame ) {
  uniforms.u_time.value = time * 0.001;
  uniforms.u_frame.value = frame;
  renderer.render( scene, camera );
}

// img defines what finally gets rendered to the scene.
function img() {
  const plane = new THREE.PlaneBufferGeometry(2,2);

  const material = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms,
  });

  scene.add(new THREE.Mesh(plane, material));
}
