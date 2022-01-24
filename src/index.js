import * as THREE from 'three';

let camera, scene, renderer, canvas;
let geometry, material, mesh;
let plane, mat, uniforms;

let fragmentShader, vertexShader;

fetch("/shaders/life.frag")
  .then((r) => r.text())
  .then((t) => fragmentShader = t)
  .then(boilerplate)
  .then(main)

function boilerplate() {
  // Boilerplate: camera, scene, renderer
  camera = new THREE.OrthographicCamera(-1,1,1,-1,-1,1);
  scene = new THREE.Scene();
  canvas = document.createElement("canvas");
  document.body.appendChild(canvas);
  renderer = new THREE.WebGLRenderer({canvas});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.setAnimationLoop( animation );
  window.addEventListener('resize', () => {
    renderer.setSize( window.innerWidth, window.innerHeight );
    uniforms.u_resolution.value.set(window.innerWidth, window.innerHeight);
  }, false)
  document.body.appendChild( renderer.domElement );
}

function main() {
  // full-canvas shader boilerplate.
  plane = new THREE.PlaneBufferGeometry(2,2);
  
  uniforms = {
    u_time: { value: 0 },
    u_resolution:  { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  };
  material = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms,
  });
  scene.add(new THREE.Mesh(plane, material));
}

function animation( time ) {

  // uniforms.u_resolution.value.set(canvas.width, canvas.height, 1);
  uniforms.u_time.value = time * 0.001;
  renderer.render( scene, camera );
}