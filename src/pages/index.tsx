import * as React from 'react';
import '../styles/index.scss';
import type { HeadFC } from 'gatsby';

import * as THREE from 'three';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stats } from '@react-three/drei';

import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';

import { folder, useControls } from 'leva';
import {
   EffectComposer,
   ChromaticAberration,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

const time = new THREE.Clock();

const perlin = new ImprovedNoise();
const vector = new THREE.Vector2();

function Instances({
   dummy = new THREE.Object3D(),
   width,
   height,
   scale,
   array,
   speed,
   sphere,
}: {
   dummy?: THREE.Object3D<Event>;
   width: number;
   height: number;
   scale: number;
   array: number[][];
   speed: number;
   sphere: { w: number; h: number };
}) {
   const ref = React.useRef<THREE.InstancedMesh>(null!);

   function mapX(x: number) {
      return width % 2 === 0 ? x - width / 2 + 0.5 : x - width / 2;
   }

   function mapY(y: number) {
      return height % 2 === 0 ? y - height / 2 + 0.5 : y - height / 2;
   }

   const length = width * height;

   let time = 0;
   useFrame((state, delta, xrFrame) => {
      for (let i = 0; i < width; i++) {
         for (let j = 0; j < height; j++) {
            vector.set(i, j).divideScalar(100);
            const d = perlin.noise(
               vector.x * 6.5,
               vector.y * 6.5,
               time * speed * 0.45
            );
            array[i][j] = THREE.MathUtils.mapLinear(d, -1, 1, 0, 255);
         }
      }
      time += delta;
      let n = 0;
      array.map((row, i) => {
         return row.map((value: any, j: number) => {
            // console.log(`NUMBER: ${value}`)
            const UNIT = THREE.MathUtils.mapLinear(value, 0, 255, 0, 1);
            const id = n++;
            dummy.position.set(
               mapX(i) * scale,
               mapY(j) * scale,
               (value / 10) * scale
            );
            dummy.scale.set(UNIT, UNIT, UNIT);
            dummy.updateMatrix();
            // ref.current.setColorAt(
            //    id,
            //    new THREE.Color(
            //       `rgb(${Math.floor(value)},${Math.floor(value)},${Math.floor(
            //          value
            //       )})`
            //    )
            // );
            ref.current.setMatrixAt(id, dummy.matrix);
         });
      });

      // Update the instance
      // ref.current.instanceColor!.needsUpdate = true;
      ref.current.instanceMatrix.needsUpdate = true;
   });

   // const [colorArray] = useState(() => Float32Array.from(Array.from({length}, (_, i) => color.set(colors[i]).convertSRGBToLinear().toArray()).flat()))

   React.useLayoutEffect(() => {}, [array]);

   return (
      // @ts-ignore
      <instancedMesh ref={ref} args={[null, null, length]}>
         <sphereBufferGeometry args={[0.4 * scale, sphere.w, sphere.h]}>
            {/*<instancedBufferAttribute attachObject={['attributes', 'color']} args={[colorArray, 3]}/>*/}
         </sphereBufferGeometry>
         <meshBasicMaterial />
      </instancedMesh>
   );
}

const IndexPage = () => {
   const {
      ARRAY_WIDTH,
      ARRAY_HEIGHT,
      SCALE,
      speed,
      ambientLight,
      pointLight,
      chromaticAberration,
      widthSegments,
      heightSegments,
   } = useControls({
      ARRAY_WIDTH: { value: 45, min: 1, max: 500, step: 1 },
      ARRAY_HEIGHT: { value: 30, min: 1, max: 500, step: 1 },
      SCALE: { value: 0.1, min: 0.001, max: 0.2 },
      speed: { value: 1, min: 0.25, max: 4, step: 0.25 },
      ambientLight: true,
      pointLight: false,
      chromaticAberration: true,
      sphere: folder({
         widthSegments: { value: 16, min: 1, max: 32, step: 1 },
         heightSegments: { value: 16, min: 1, max: 32, step: 1 },
      }),
   });

   let dummyArray: number[][] = new Array(ARRAY_WIDTH);

   for (let i = 0; i < ARRAY_WIDTH; i++) {
      dummyArray[i] = new Array(ARRAY_HEIGHT);
   }

   return (
      <Canvas>
         <Stats />
         <OrbitControls makeDefault />
         {/*<EffectComposer>*/}
         {/*   {chromaticAberration ? (*/}
         {/*      <ChromaticAberration*/}
         {/*         blendFunction={BlendFunction.NORMAL}*/}
         {/*         offset={[0.008, 0.006]}*/}
         {/*         radialModulation*/}
         {/*         modulationOffset={0.6}*/}
         {/*      />*/}
         {/*   ) : (*/}
         {/*      <></>*/}
         {/*   )}*/}
         {/*</EffectComposer>*/}
         {ambientLight ? <ambientLight intensity={0.5} /> : null}
         <Instances
            width={ARRAY_WIDTH}
            height={ARRAY_HEIGHT}
            scale={SCALE}
            array={dummyArray}
            speed={speed}
            sphere={{
               w: widthSegments,
               h: heightSegments,
            }}
         />
         {/*<spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />*/}
         {/*{pointLight ? (*/}
         {/*   <pointLight position={[-10, -10, -10]} intensity={10} />*/}
         {/*) : null}*/}
      </Canvas>
   );
};

export default IndexPage;

export const Head: HeadFC = () => <title>Home Page</title>;

/*
    {
        dummyArray.map((row, i) => {
            return row.map((col: any, j: number) => {
                    // console.log(i, j);
                    return <Box key={`${i},${j}`} position={[mapX(i) * SCALE, mapY(j) * SCALE, 0]}/>
                }
            )
        })
    }
*/
