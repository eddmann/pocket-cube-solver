import { Vector3 } from 'three';

export type CubeState = string;

export type CubeRotatation = 'F' | 'B' | 'R' | 'L' | 'U' | 'D';

export type CubePosition =
  | 'DLB'
  | 'DLF'
  | 'ULB'
  | 'ULF'
  | 'DRB'
  | 'DRF'
  | 'URB'
  | 'URF';

export const CUBE_FACE_COLOURS = {
  W: 'white',
  O: 'orange',
  G: 'green',
  R: 'red',
  Y: 'yellow',
  B: 'blue',
};

export type CubeFaceColour = keyof typeof CUBE_FACE_COLOURS;

export type Move = string;

export type MoveTransition = {
  move: Move;
  startState: CubeState;
  endState: CubeState;
};

export type Solution = MoveTransition[];

export type Solver = typeof import('wasm-pocket-cube-solver');

export const SOLVED_CUBE = 'WWWWOOOOGGGGRRRRYYYYBBBB';

export const CUBIE_POSITIONS: {
  [position in CubePosition]: Vector3;
} = {
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
export const CUBE_STATE_LOOKUP = [
  7, 19, 22, 10, 6, 9, 3, 0, 11, 23, 17, 5,
  21, 18, 12, 15, 4, 16, 13, 1, 20, 8, 2, 14
];