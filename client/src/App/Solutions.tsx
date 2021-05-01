import React from 'react';
import styles from './App.module.css';
import { Solution } from './index';

type SolutionsProps = {
  solution: Solution;
  solutionIdx: number;
  isAutoPlay: boolean;
  onMoveSelection: (idx: number) => void;
  onAutoPlay: (enabled: boolean) => void;
};

const Solutions = ({
  solution,
  solutionIdx,
  isAutoPlay,
  onMoveSelection,
  onAutoPlay,
}: SolutionsProps) => {
  if (solution.length === 0) {
    return null;
  }

  return (
    <div className={styles.Solution}>
      {solution.map(([move]: any, idx: number) => (
        <span
          key={idx}
          className={
            solutionIdx === idx ? styles.ActiveMove : styles.Move
          }
          onClick={() => onMoveSelection(idx)}
        >
          {move}
        </span>
      ))}
      <label>
        <input
          type="checkbox"
          onChange={() => onAutoPlay(!isAutoPlay)}
          checked={isAutoPlay}
        />
        Auto Play
      </label>
    </div>
  );
};

export default Solutions;
