import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

function main() {

  const canvas = document.querySelector('#webgl');
  const renderer = new THREE.WebGLRenderer( { antialias: true, canvas });

  const fov = 45;
  const aspect = window.innerWidth / window.innerHeight;
  const near = 0.1;
  const far = 100;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 10, 20);

  const constrols = new OrbitControls( camera, canvas );
  constrols.target.set(0, 5, 0);
  constrols.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

  {
    const planeSize = 40;

    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejs.org/manual/examples/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    const repeats = planeSize / 2;
    texture.repeat.set( repeats, repeats );

    const PlaneGeometry = new THREE.PlaneGeometry( planeSize, planeSize);
    const planeMet = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(PlaneGeometry, planeMet);
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
  }

  {
    const cubeSize = 4;
    const cubeGeo = new THREE.BoxGeometry( cubeSize, cubeSize, cubeSize);
    const cubeMet = new THREE.MeshPhongMaterial( { color: '#8AC'});
    const mesh = new THREE.Mesh(cubeGeo, cubeMet);
    mesh.position.set( cubeSize + 1, cubeSize / 2, 0);
    scene.add(mesh);
  }

  {
    const SphereRadius = 3;
    const sphereWidthDivisions = 32;
    const sphereHieghtDivisions = 16;
    const sphereGeo = new THREE.SphereGeometry( SphereRadius, sphereWidthDivisions, sphereHieghtDivisions);
    const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8'});
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set( - SphereRadius - 1, SphereRadius + 2, 0);
    scene.add(mesh);
  }

  class ColorGUIHelper {

    constructor( object, prop ) {

      this.object = object;
      this.prop = prop;

    }
    get value() {
      return `#${this.object[ this.prop ].getHexString()}`;
    }
    set value( hexString) {
      this.object[ this.prop ].set(hexString);
    }
  }

  function makeXYZGUI( gui, vecter3, name, onChangeFn ) {
    const folder = gui.addFolder( name );
    folder.add( vecter3, 'x', -10, 10 ).onChange(onChangeFn);
    folder.add( vecter3, 'y', 0, 10 ).onChange(onChangeFn);
    folder.add( vecter3, 'z', -10, 10 ).onChange(onChangeFn);
    folder.open();
  }

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light, light.target);

    const helper = new THREE.DirectionalLightHelper( light );
    scene.add(helper);

    function updateLight() {
      light.target.updateMatrixWorld();
      helper.update();
    }
    updateLight();

    const gui = new GUI();
    gui.addColor( new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 5, 0.01);
    
    makeXYZGUI(gui, light.position, 'position', updateLight );
    makeXYZGUI(gui, light.target.position, 'target', updateLight);
  }

  function resizeRndererToDisplaySize( renderer ) {

    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if(needResize) {
      renderer.setSize( width, height, false);
    }
    return needResize;
  }

  function render() {
    if( resizeRndererToDisplaySize(renderer)) {

      const canvas = renderer.domElement;
      const aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    renderer.render( scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}
main();
