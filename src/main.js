
const THREE = require('three'); // older modules are imported like this. You shouldn't have to worry about this much

import Framework from './framework'
import Noise from './noise'
import {other} from './noise'



// called after the scene loads
function onLoad(framework) {
  var scene = framework.scene;
  var camera = framework.camera;
  var renderer = framework.renderer;
  var gui = framework.gui;
  var stats = framework.stats;

  // LOOK: the line below is synyatic sugar for the code above. Optional, but I sort of recommend it.
  // var {scene, camera, renderer, gui, stats} = framework; 

  // initialize a simple box and material
  var universe = new THREE.IcosahedronGeometry(1,5);
  var sphere = new THREE.IcosahedronGeometry(1, 5);
  // Model license:
  // This work is based on "Xian SpaceShip" (https://sketchfab.com/3d-models/xian-spaceship-0c414ddf4dfa419983ae5574da3a5242) by Valery Kharitonov (https://sketchfab.com/KJLOYH) licensed under CC-BY-4.0 (http://creativecommons.org/licenses/by/4.0/)
  //const loader = new THREE.Loader.;
//
  //  loader.load( 'scene.gltf', function ( gltf ) {
//
  //    scene.add( gltf.scene );
//
  //  }, undefined, function ( error ) {

 //     console.error( error );

  //  } );
  var galaxyMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    uniforms: {
      image: { // Check the Three.JS documentation for the different allowed types and values
        type: "t", 
        value: THREE.ImageUtils.loadTexture('./4kimage.jpg')
      }
    },
    vertexShader: require('./shaders/galaxy-vert.glsl'),
    fragmentShader: require('./shaders/galaxy-frag.glsl')
  });
  var darkMaterial = new THREE.ShaderMaterial({
    transparent: false,
    uniforms: framework.uniforms,
    vertexShader: require('./shaders/dark-vert.glsl'),
    fragmentShader: require('./shaders/dark-frag.glsl')
  });
  var rasenganMaterial = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    uniforms: framework.uniforms,
    vertexShader: require('./shaders/rasengan-vert.glsl'),
    fragmentShader: require('./shaders/rasengan-frag.glsl')
  });
  var gradientMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: framework.uniforms,
    vertexShader: require('./shaders/gradient-vert.glsl'),
    fragmentShader: require('./shaders/gradient-frag.glsl')
  });
  var innerDarkness = new THREE.Mesh(sphere, darkMaterial);
  var sphereInnerEnergy = new THREE.Mesh(sphere, gradientMaterial);
  var sphereOuterEnergy = new THREE.Mesh(sphere, rasenganMaterial);
  var galaxyCube = new THREE.Mesh(universe, galaxyMaterial);
  
  
  // set camera position
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3(0,0,0));

  scene.add(innerDarkness);
  scene.add(galaxyCube);
  scene.add(sphereInnerEnergy);
  scene.add(sphereOuterEnergy);
  // edit params and listen to changes like this
  // more information here: https://workshop.chromeexperiments.com/examples/gui/#1--Basic-Usage
  gui.add(camera, 'fov', 0, 180).onChange(function(newVal) {
    camera.updateProjectionMatrix();
  });
  gui.add(framework.uniforms.atmosphere, 'value', 0, 100, 0.1).onChange(function(newVal) {
    framework.uniforms.atmosphere.value = newVal;
  });
}

// called on frame updates
function onUpdate(framework) {
  framework.uniforms.time.value++;
  
  //framework.gltf.position.x += 0.5;
  // console.log(`the time is ${new Date()}`);
}

// when the scene is done initializing, it will call onLoad, then on frame updates, call onUpdate
Framework.init(onLoad, onUpdate);

// console.log('hello world');

// console.log(Noise.generateNoise());

// Noise.whatever()

// console.log(other())