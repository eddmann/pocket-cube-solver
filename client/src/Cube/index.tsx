import React, {
  useRef,
  useLayoutEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import Cubie from './Cubie';
import animate, { Animation } from './animation';

const FACE_SIDES = 3;

const CUBIE_POSITIONS = {
  DLB: new Vector3(-0.5, -0.5, -0.5),
  DLF: new Vector3(-0.5, -0.5, 0.5),
  ULB: new Vector3(-0.5, 0.5, -0.5),
  ULF: new Vector3(-0.5, 0.5, 0.5),
  DRB: new Vector3(0.5, -0.5, -0.5),
  DRF: new Vector3(0.5, -0.5, 0.5),
  URB: new Vector3(0.5, 0.5, -0.5),
  URF: new Vector3(0.5, 0.5, 0.5),
};

// prettier-ignore
const STATE_LOOKUP = [
  7, 19, 22, 10, 6, 9, 3, 0, 11, 23, 17, 5,
  21, 18, 12, 15, 4, 16, 13, 1, 20, 8, 2, 14
];

const COLOURS = {
  W: 'white',
  O: 'orange',
  G: 'green',
  R: 'red',
  Y: 'yellow',
  B: 'blue',
};

type CubeProps = {
  state: string;
};

const Cube = forwardRef<THREE.Group, CubeProps>(({ state }, ref) => {
  const cubiesRef = useRef<THREE.Mesh[]>([]);
  const animationRef = useRef<[Animation, () => void]>();

  const stateWithPadding = state.padEnd(24, 'W');
  const cubieColours = stateWithPadding
    .split('')
    .reduce((faces, face, idx) => {
      // @ts-ignore
      faces[STATE_LOOKUP[idx]] = COLOURS[face];
      return faces;
    }, []);

  useFrame(() => {
    if (!animationRef.current) return;

    const [animation, onCompletion] = animationRef.current;

    if (!animation.step()) {
      onCompletion();
      animationRef.current = undefined;
    }
  });

  const rotate = (move: string) =>
    new Promise<void>(resolve => {
      animationRef.current = [
        animate(cubiesRef.current, move, 1),
        resolve,
      ];
    });

  const reset = () => {
    cubiesRef.current.forEach(cubie => {
      cubie.position.copy(cubie.userData.position);
      cubie.rotation.set(0, 0, 0);
    });
  };

  useLayoutEffect(reset, [stateWithPadding]);

  // @ts-ignore
  useImperativeHandle(ref, () => ({ reset, rotate }));

  return (
    <group ref={ref}>
      {Object.entries(CUBIE_POSITIONS).map(
        ([name, position], idx) => {
          const offset = idx * FACE_SIDES;
          const [side, top, front] = cubieColours.slice(
            offset,
            offset + FACE_SIDES
          );

          return (
            <Cubie
              key={name}
              // @ts-ignore
              ref={el => (cubiesRef.current[idx] = el)}
              name={name}
              position={position}
              sideColour={side}
              topColour={top}
              frontColour={front}
            />
          );
        }
      )}
    </group>
  );
});

export default Cube;
