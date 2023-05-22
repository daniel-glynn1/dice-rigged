import { useState } from "react";
import "./App.css";

import { gof } from 'chi-sq-test';

export default function App() {
  const [counts, setCounts] = useState(Array(11).fill(0));
  const [value, setValue] = useState(null);

  function handleCountsChange(num, newCount) {
    const newCounts = counts.slice();
    newCounts[num-2] = newCount;
    setCounts(newCounts);
  }

  function handleClick() {
    //const calcCounts = counts.map((x) => x === null ? 0 : x);
    const newValue = calculateValue(counts);
    setValue(newValue);
  }
  
  return (
    <div className="app">
      <h1>Are My Dice Rigged*?</h1>
      <p>*Based on a Chi-Square goodness of fit test</p>
      <hr/>
      <p>Enter the counts of each sum of 2 dice rolled:</p>
      <NumberInputPanel counts={counts} onCountsChange={handleCountsChange} />
      <button className="calculate-button" onClick={handleClick}>Calculate</button>
      <div className="calculate-result">{value}</div>
      <div className="info">
        <p>Helpful links</p>
        <a href="https://statisticsbyjim.com/hypothesis-testing/interpreting-p-values/">
          How to interpret a p-value
        </a>
        <a href="https://www.jmp.com/en_us/statistics-knowledge-portal/chi-square-test.html">
          Learn more about Chi-Square goodness of fit tests 
        </a>
        
      </div>
    </div>

  );
}


function NumberInputPanel({counts, onCountsChange}) {
  function handleCountChange(num, newCount) {
    onCountsChange(num, newCount);
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
    <div className="number-box">
      <div className = "number-label">{num}</div>
      <input
        className = "number-input"
        type="number"
        //pattern="[0-9]*"
        value={value}
        onChange={handleInputChange}
      />
    </div>
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
