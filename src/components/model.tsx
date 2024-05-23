import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { AnimationMixer } from 'three';

const Model = () => {
  useEffect(() => {
    const scene = new THREE.Scene();

    const loader = new GLTFLoader();
    const clock = new THREE.Clock();

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.set(0, 5, -10); // Initial position behind the mesh
    camera.rotation.y = Math.PI;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    let mixer, mixer2;
    let mesh2;

    loader.load("/public/forest.glb", function (gltf) {
      const mesh = gltf.scene;
      mesh.position.set(0, 0, 0);
      mesh.scale.set(2, -2, 2);

      const animations = gltf.animations;
      mixer = new AnimationMixer(mesh);

      animations.forEach((walk) => {
        const action = mixer.clipAction(walk);
        action.play();
      });

      scene.add(mesh);

      loader.load("/hadda.glb", function (glft) {
        mesh2 = glft.scene;
        mesh2.position.set(0, 3, 300);
        mesh2.rotation.y = Math.PI; // Rotate 180 degrees along Y-axis
        mesh2.scale.set(10, 10, 10);

        const animations = glft.animations;
        if (animations.length > 0) {
          mixer2 = new AnimationMixer(mesh2);

          animations.forEach((animation) => {
            const action = mixer2.clipAction(animation);
            action.play();
            action.timeScale = 1;
          });

          scene.add(mesh2);

          // Key press event listeners for movement controls
          const moveSpeed = 1;
          const onKeyDown = (event) => {
            switch (event.key) {
              case 'w':
              case 'W':
                mesh2.position.z -= moveSpeed;
                break;
              case 's':
              case 'S':
                mesh2.position.z += moveSpeed;
                break;
              case 'a':
              case 'A':
                mesh2.position.x -= moveSpeed;
                break;
              case 'd':
              case 'D':
                mesh2.position.x += moveSpeed;
                break;
              default:
                break;
            }
          };

          window.addEventListener('keydown', onKeyDown);

          const animate = () => {
            const delta = clock.getDelta();
            if (mixer) mixer.update(delta);
            if (mixer2) mixer2.update(delta);

            if (mesh2) {
              // Calculate the new camera position behind mesh2
              const offset = new THREE.Vector3(0, 5, 20); // Offset to position camera behind
              const newCameraPosition = mesh2.position.clone().add(offset);
              camera.position.copy(newCameraPosition);
              camera.lookAt(mesh2.position);
            }

            controls.update();
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
          };
          animate();
        } else {
          console.log("No animations found for mesh2");
        }
      });
    });

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });

  }, []);

  return (
    <div>
      <button className='z-10 h-10 w-14 absolute text-white bg-red-500' onClick={() => { }}>Click</button>
    </div>
  );
}

export default Model;
