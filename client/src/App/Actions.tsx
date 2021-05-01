import React from 'react';
import styles from './App.module.css';

type ActionsProps = {
  state: string;
  onStateChange: (state: string) => void;
  onRandom: () => void;
  onSolve: () => void;
};

const Actions = ({
  state,
  onStateChange,
  onRandom,
  onSolve,
}: ActionsProps) => {
  return (
    <div className={styles.Actions}>
      <input
        size={40}
        type="text"
        value={(state.match(/.{1,4}/g) || []).join(' ')}
        onChange={e =>
          onStateChange(
            e.target.value.toUpperCase().replace(/[^WOGRYB]/g, '')
          )
        }
      />
      <button onClick={onRandom}>Random</button>
      <button onClick={onSolve}>Solve</button>
    </div>
  );
};

export default Actions;
