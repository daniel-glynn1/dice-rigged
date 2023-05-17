import { useState } from "react";
import "./App.css";

import { gof } from 'chi-sq-test';

export default function App() {
  const [counts, setCounts] = useState([Array(11).fill(0)]);
  const [value, setValue] = useState(null);

  function handleCountsChange(newCounts) {
    setCounts(newCounts);
  }

  function handleClick() {
    const calcCounts = counts.map((x) => x === null ? 0 : x);
    const newValue = calculateValue(calcCounts);
    setValue(newValue);
  }
  
  return (
    <div className="app">
      <NumberInputPanel counts={counts} onCountsChange={handleCountsChange} />
      <button className="calculate-button" onClick={handleClick}>Calculate</button>
      <div className="calculate-result">{value}</div>
    </div>

  );
}


function NumberInputPanel({counts, onCountsChange}) {
  function handleCountChange(num, newCount) {
    const nextCounts = counts.slice();
    nextCounts[num-2] = newCount;
    onCountsChange(nextCounts);
  }


  return (
    <>
      <div className = "number-row">
        <NumberInput num="2" onCountChange={(newCount) => handleCountChange(2, newCount)}/>
        <NumberInput num="3" onCountChange={(newCount) => handleCountChange(3, newCount)}/>
        <NumberInput num="4" onCountChange={(newCount) => handleCountChange(4, newCount)}/>
        <NumberInput num="5" onCountChange={(newCount) => handleCountChange(5, newCount)}/>
        <NumberInput num="6" onCountChange={(newCount) => handleCountChange(6, newCount)}/>
        <NumberInput num="7" onCountChange={(newCount) => handleCountChange(7, newCount)}/>
        <NumberInput num="8" onCountChange={(newCount) => handleCountChange(8, newCount)}/>
        <NumberInput num="9" onCountChange={(newCount) => handleCountChange(9, newCount)}/>
        <NumberInput num="10" onCountChange={(newCount) => handleCountChange(10, newCount)}/>
        <NumberInput num="11" onCountChange={(newCount) => handleCountChange(11, newCount)}/>
        <NumberInput num="12" onCountChange={(newCount) => handleCountChange(12, newCount)}/>
      </div>
    </>
  );
}

function NumberInput({ num, onCountChange }) {
  const [value, setValue] = useState("");

  const handleInputChange = (e) => {
    const newCount = Number(e.target.value);
    onCountChange(newCount);

    setValue(e.target.value);
  };

  return (
    <>
      <div className = "number-label">{num}</div>
      <input
        className = "number-input"
        type="number"
        //pattern="[0-9]*"
        value={value}
        onChange={handleInputChange}
      />
    </>
  );
}

// helper functions to calculate p value
function calculateValue(counts) {
  const observed = counts;
  const expected = calculateExpected(counts);
  const ddof = 0;
  const chiSquareResult = gof(observed, expected, ddof);

  return chiSquareResult.pValue;
}

function calculateExpected(counts) {
  // expected percentages of sum from 2 d6s rolled
  const percentages = [1/36, 2/36, 3/36, 4/36, 5/36, 6/36, 5/36, 4/36, 3/36, 2/36, 1/36];
  const n = counts.reduce((a, b) => a + b, 0);
  const expected = percentages.map((x) => x * n);
  return expected;
}
