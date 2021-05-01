import React, { useMemo, useRef } from 'react';
import { Shape, DoubleSide, Vector3 } from 'three';

const eps = 0.00001;

const createShape = (
  width: number,
  height: number,
  radius0: number
): Shape => {
  const shape = new Shape();
  const radius = radius0 - eps;

  shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
  shape.absarc(
    eps,
    height - radius * 2,
    eps,
    Math.PI,
    Math.PI / 2,
    true
  );
  shape.absarc(
    width - radius * 2,
    height - radius * 2,
    eps,
    Math.PI / 2,
    0,
    true
  );
  shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);

  return shape;
};

type FaceProps = {
  width?: number;
  height?: number;
  radius?: number;
  type: 'side' | 'top' | 'front';
  colour: string;
  inverse: boolean;
};

const Face = ({
  width = 0.88,
  height = 0.88,
  radius = 0,
  type,
  inverse,
  colour,
}: FaceProps) => {
  const shape = useMemo(() => createShape(width, height, radius), [
    width,
    height,
    radius,
  ]);

  let rotY = 0;
  let rotX = 0;
  const position = new Vector3(0, 0, 0);

  switch (type) {
    case 'side':
      rotY = (inverse ? -1 : 1) * (Math.PI / 2);
      position.setX(inverse ? -0.5 : 0.5);
      break;
    case 'top':
      rotX = (inverse ? 1 : -1) * (Math.PI / 2);
      position.setY(inverse ? -0.5 : 0.5);
      break;
    case 'front':
      rotY = Math.PI;
      position.setZ(inverse ? -0.5 : 0.5);
      break;
  }

  const meshRef = useRef<THREE.Mesh>();
  const geometryRef = useRef<THREE.ShapeBufferGeometry>();

  React.useLayoutEffect(() => {
    meshRef.current?.rotateX(rotX);
    meshRef.current?.rotateY(rotY);
    geometryRef.current?.center();
  }, [rotY, rotX]);

  return (
    <mesh ref={meshRef} position={position}>
      <meshBasicMaterial
        color={colour}
        side={DoubleSide}
        polygonOffset
        transparent
        polygonOffsetFactor={-1}
        polygonOffsetUnits={-4}
      />
      <shapeBufferGeometry
        ref={geometryRef}
        attach="geometry"
        args={[shape, 5]}
      />
    </mesh>
  );
};

export default Face;
