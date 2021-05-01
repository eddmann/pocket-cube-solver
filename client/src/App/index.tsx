import React, { useState, useRef, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import CameraControls from './CameraControls';
import Actions from './Actions';
import Solutions from './Solutions';
import Cube from '../Cube';
import styles from './App.module.css';

const SOLVED_CUBE = 'WWWWOOOOGGGGRRRRYYYYBBBB';
const SOLVED_MOVE = '🎉';

type AppProps = {
  solver: any;
};

export type Solution = [
  move: string,
  startState: string,
  endState: string
][];

const doSolve = (solver: any, state: string): Promise<Solution> => {
  try {
    const solution = solver.solve_cube(state);

    return Promise.resolve([
      ...solution.map((move: string, idx: number) => [
        move,
        solver.apply_cube_moves(state, solution.slice(0, idx)),
        solver.apply_cube_moves(state, solution.slice(0, idx + 1)),
      ]),
      [SOLVED_MOVE, SOLVED_CUBE, SOLVED_CUBE],
    ]);
  } catch (error) {
    return Promise.reject(error);
  }
};

const App = ({ solver }: AppProps) => {
  const cubeRef = useRef<any>();
  const [state, setState] = useState(SOLVED_CUBE);
  const [solution, setSolution] = useState<Solution>([]);
  const [solutionIdx, setSolutionIdx] = useState(0);
  const [isAutoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!cubeRef.current) return;
    if (!solution[solutionIdx]) return;
    if (!isAutoPlay) return;

    const [move, , endState] = solution[solutionIdx];
    if (move === SOLVED_MOVE) return;

    let isActiveAnimation = true;

    cubeRef.current.rotate(move).then(() => {
      if (!isActiveAnimation) {
        cubeRef.current.reset();
        return;
      }

      setState(endState);

      if (solutionIdx + 1 < solution.length) {
        setSolutionIdx(solutionIdx + 1);
      }
    });

    return () => {
      isActiveAnimation = false;
    };
  }, [solution, solutionIdx, isAutoPlay]);

  const handleRandom = () => {
    setState(solver.rand_cube());
    setSolution([]);
    setSolutionIdx(0);
  };

  const handleSolve = () => {
    doSolve(solver, state)
      .then(solution => {
        setSolution(solution);
        setSolutionIdx(0);
        setAutoPlay(true);
      })
      .catch(error => {
        global.alert(error);
      });
  };

  const handleMoveSelection = (idx: number) => {
    const [, startState] = solution[idx];
    setState(startState);
    setSolutionIdx(idx);
  };

  return (
    <div>
      <header>
        <h1>Pocket Cube Solver</h1>
      </header>
      <Actions
        state={state}
        onStateChange={setState}
        onRandom={handleRandom}
        onSolve={handleSolve}
      />
      <Canvas
        className={styles.Canvas}
        camera={{ position: [4, 4, 5] }}
        gl={{ antialias: true }}
      >
        <CameraControls />
        <Cube ref={cubeRef} state={state} />
      </Canvas>
      <Solutions
        solution={solution}
        solutionIdx={solutionIdx}
        isAutoPlay={isAutoPlay}
        onMoveSelection={handleMoveSelection}
        onAutoPlay={setAutoPlay}
      />
    </div>
  );
};

export default App;
