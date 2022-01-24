import * as THREE from 'three';
import "./index.css";

let camera, scene, renderer;
let pingScene, pongScene;
let ping, pong;
let frame = 0;

const uniforms = {
  u_time: { value: 0 },
  u_resolution:  { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
  u_frame: { value: 4, type: "i" },
  u_texture: {value: null}
};

let lifeShader, mainShader;
Promise.all([
  fetch("/shaders/main.frag")
    .then((r) => r.text())
    .then((t) => mainShader = t),
  fetch("/shaders/life.frag")
    .then((r) => r.text())
    .then((t) => lifeShader = t)
])
  .then(init)
  .then(img)
  .then(life)
  .then(lifePong);

function init() {
  // Boilerplate: camera, scene, renderer
  camera = new THREE.OrthographicCamera(-1,1,1,-1,-1,1);
  scene = new THREE.Scene();

  renderer = new THREE.WebGLRenderer({antialias: true});
  ping = new THREE.WebGLRenderTarget();
  pingScene = new THREE.Scene();
  pong = new THREE.WebGLRenderTarget();
  pongScene = new THREE.Scene();
  document.body.appendChild( renderer.domElement );
  function resize() {
    let w = document.body.clientWidth;
    let h = document.body.clientHeight;
    renderer.setSize( w, h );
    ping.setSize( w, h );
    pong.setSize( w, h );
    uniforms.u_resolution.value.set(w, h);
  }
  resize()
  window.addEventListener('resize', resize, false);

  
  renderer.setAnimationLoop( main );
}

// main is the hot loop, passed to setAnimationLoop by init()
function main( time ) {
  // uniforms.u_time.value = time * 0.001;
  // uniforms.u_frame.value = frame;

  uniforms.u_time.value = time * 0.001;
  uniforms.u_frame.value = frame;

  // populate buffer
  if (frame % 2 === 0) {
    uniforms.u_texture.value = pong.texture;
    // uniforms.u_texture.value = pong.texture;
    renderer.setRenderTarget(ping);
    renderer.render( pingScene, camera );
  } else {
    uniforms.u_texture.value = ping.texture;
    // uniforms.u_texture.value = ping.texture;
    renderer.setRenderTarget(pong);
    renderer.render( pongScene, camera );
  }

  // render to canvas
  renderer.setRenderTarget(null);
  renderer.render( scene, camera );
  frame += 1;
}

function life() {
  // PlaneBufferGeometry is deprecated, use PlaneGeometry in the future?
  const plane = new THREE.PlaneBufferGeometry(2,2);

  const material = new THREE.ShaderMaterial({
    fragmentShader: lifeShader,
    uniforms,
  });
  pingScene.add(new THREE.Mesh(plane, material));
}

function lifePong() {
  // PlaneBufferGeometry is deprecated, use PlaneGeometry in the future?
  const plane = new THREE.PlaneBufferGeometry(2,2);

  const material = new THREE.ShaderMaterial({
    fragmentShader: lifeShader,
    uniforms,
  });
  pongScene.add(new THREE.Mesh(plane, material));
}

// img defines what finally gets rendered to the scene.
function img() {
  const plane = new THREE.PlaneBufferGeometry(2,2);

  const material = new THREE.ShaderMaterial({
    fragmentShader: mainShader,
    uniforms: uniforms,
  });

  scene.add(new THREE.Mesh(plane, material));
}
