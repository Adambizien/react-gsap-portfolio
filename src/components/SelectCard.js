import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader';

const HelmetModel = ({ modelName }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const currentMount = mountRef.current;  // Sauvegarde la référence actuelle

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    currentMount.appendChild(renderer.domElement);

    const rgbeLoader = new RGBELoader();
    rgbeLoader.load('/path/to/your/hdr/environment.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
    });

    const directionalLight = new THREE.DirectionalLight(0xffffff, 20);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    const mtlLoader = new MTLLoader();
    mtlLoader.load(`/models/${modelName}/${modelName}.mtl`, (materials) => {
      materials.preload();

      Object.keys(materials.materials).forEach((key) => {
        const material = materials.materials[key];
        material.side = THREE.DoubleSide;
        materials.materials[key] = new THREE.MeshStandardMaterial({
          color: material.color,
          roughness: 0.5,
          metalness: 1.0,
          map: material.map,
          normalMap: material.normalMap,
          aoMap: material.aoMap,
          envMapIntensity: 1.0,
          transparent: true,
          opacity: 1.0,
        });
      });

      const objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(
        `/models/${modelName}/${modelName}.obj`,
        (obj) => {
          scene.add(obj);
          obj.scale.set(10, 10, 10);
          obj.position.set(0, -1.5, 0);

          const animate = () => {
            requestAnimationFrame(animate);
            obj.rotation.y += 0.01;
            renderer.render(scene, camera);
          };
          animate();
        },
        (xhr) => {
          console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
          console.error('Error loading the model:', error);
        }
      );
    });

    const handleResize = () => {
      const width = currentMount.clientWidth;
      const height = currentMount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      currentMount.removeChild(renderer.domElement);  // Utilise la référence sauvegardée
    };
  }, [modelName]);

  return (
    <div
      style={{
        width: '40vw',
        height: '40vh',
        backgroundColor: 'black',
        margin: '50px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default HelmetModel;
