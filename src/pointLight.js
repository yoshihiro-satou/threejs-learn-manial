import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';


function main() {
  const canvas = document.querySelector('#webgl');
  const renderer = new THREE.WebGLRenderer( { antialias: true, canvas });

  const fov = 45;
  const aspect = 2;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
  camera.position.set(0, 10, 20);

  const controls = new OrbitControls( camera, canvas );
  controls.target.set( 0, 5, 0 );
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');


  // 床
  {
    const planeSize = 40;
    const loader = new THREE.TextureLoader();
    const texture = loader.load( 'https://threejs.org/manual/examples/resources/images/checker.png' );
    texture.wrapS = THREE.ReinhardToneMapping;
    texture.wrapT = THREE.ReinhardToneMapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    texture.repeat.set( repeats, repeats );

    const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
  }

  // box
  {
    const cubeSize = 4;
    const cubeGeo = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize );
    const cubeMat = new THREE.MeshPhongMaterial( { color: '#8AC'});
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0);
    scene.add(mesh);
  }

  // 球
  {
    const sphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHieghtDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry( sphereRadius, sphereWidthDivisions, sphereHieghtDivisions);
    const sphereMat = new THREE.MeshPhongMaterial( { color: '#CA8'});
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set( - sphereRadius - 1, sphereRadius + 2, 0);
    scene.add(mesh);
  }

  class ColorGUIHelper{
    constructor( object, prop) {

      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value( hexString ){
      this.object[this.prop].set( hexString );
    }
  }

  function makeXYZGUI( gui, vecter3, name, onChangeFn ) {
    const folder = gui.addFolder( name );
    folder.add(vecter3, 'x', -10, 10).onChange( onChangeFn );
    folder.add(vecter3, 'y', 0, 10).onChange( onChangeFn );
    folder.add(vecter3, 'z', -10, 10).onChange( onChangeFn );
    folder.open();
  }

  {
    const color = 0xffffff;
    const intensity = 150;
    const light = new THREE.PointLight( color, intensity );
    light.position.set(0, 10, 0);
    scene.add(light);

    const helper = new THREE.PointLightHelper( light );
    scene.add( helper );

    function updateLight() {
      helper.update();
    }

    const gui = new GUI();
    gui.addColor( new ColorGUIHelper( light, 'color'), 'value').name('color');
    gui.add( light, 'intensity', 0, 250, 1);
    gui.add( light, 'distance', 0, 40).onChange( updateLight );

    makeXYZGUI( gui, light.position, 'position');
  }

  function resizeRendererToDisplay( renderer ) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needSize = canvas.width !== width || canvas.height !== height;
    if(needSize) {
      renderer.setSize(width, height, false);
    }
    return needSize;
  }

  function render() {
    if(resizeRendererToDisplay( renderer )) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
main();
