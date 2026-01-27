import * as THREE from "three";

function main() {

  const canvas = document.querySelector('#webgl');
  const renderer = new THREE.WebGLRenderer( { antialias: true, canvas} );
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  const fov = 40;
  const aspect = innerWidth / innerHeight;
  const near = 0.1;
  const far = 1000;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 50, 0);
  camera.up.set(0, 0, 1);
  camera.lookAt(0, 0, 0);

  const scene = new THREE.Scene();

  {
    const color = 0xffffff;
    const intensity = 500;
    const light = new THREE.PointLight( color, intensity);
    scene.add(light);
  }

  const objects = [];

  const radius = 1;
  const widthSegments = 6;
  const heightSegments = 6;
  const sphereGeometry = new THREE.SphereGeometry(
    radius, widthSegments, heightSegments);

    const sunMaterial = new THREE.MeshPhongMaterial( { emissive: 0xffff00 });
    const sunMesh = new THREE.Mesh( sphereGeometry, sunMaterial );
    sunMesh.scale.set(5, 5, 5);
    scene.add(sunMesh);
    objects.push(sunMesh);

    const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x2233ff, emissive: 0x1112244 });
    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
    earthMesh.position.x = 10;
    scene.add(earthMesh);
    objects.push(earthMesh);

    function resizeRendererToDisplaySize( renderer ) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if(needResize) {
        renderer.setSize(width, height, false );
      }
      return needResize;
    }

    function render(time) {
      time *= 0.001;

      if(resizeRendererToDisplaySize( renderer )) {
        const canvas = renderer.domElement;
        canvas.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      objects.forEach( (obj) => {
        obj.rotation.y = time;
      });

      renderer.render( scene, camera );
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);
}
main();
