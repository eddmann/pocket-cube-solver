import { Vector3 } from 'three';

// prettier-ignore
const ROTATIONS = {
  F: { positions: ['ULF', 'URF', 'DLF', 'DRF'], axis: new Vector3(0, 0, 1) },
  B: { positions: ['URB', 'ULB', 'DRB', 'DLB'], axis: new Vector3(0, 0, 1) },
  R: { positions: ['URF', 'URB', 'DRF', 'DRB'], axis: new Vector3(1, 0, 0) },
  L: { positions: ['ULB', 'ULF', 'DLB', 'DLF'], axis: new Vector3(1, 0, 0) },
  U: { positions: ['ULB', 'URB', 'ULF', 'URF'], axis: new Vector3(0, 1, 0) },
  D: { positions: ['DLF', 'DRF', 'DLB', 'DRB'], axis: new Vector3(0, 1, 0) },
};

type Rotation = keyof typeof ROTATIONS;

export type Animation = {
  step: () => boolean;
};

const animate = (
  cubies: any[],
  move: string,
  animationSpeed: number
): Animation => {
  const [action, extra] = move.split('', 2) as [
    Rotation,
    "'" | '2' | undefined
  ];
  const { positions, axis } = ROTATIONS[action];
  const direction = extra === "'" ? 1 : -1;
  const quarterTurns = extra === '2' ? 2 : 1;
  const cubiesToRotate = cubies.filter(cubie =>
    positions.includes(cubie.userData.name)
  );
  const targetRotation = (quarterTurns * Math.PI) / 2;
  let remaining = targetRotation;

  return {
    step() {
      if (remaining <= 0) {
        return false;
      }

      const stepFactor = 0.05 * quarterTurns * animationSpeed;
      const theta =
        (1.1 -
          ((2 * remaining - targetRotation) / targetRotation) ** 2) *
        stepFactor;
      remaining -= theta;

      cubiesToRotate.forEach(cubie => {
        cubie.position.applyAxisAngle(axis, theta * direction);
        cubie.rotateOnAxis(axis, theta * direction);
      });

      return true;
    },
  };
};

export default animate;
