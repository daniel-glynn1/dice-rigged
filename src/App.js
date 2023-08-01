import React, { useState } from 'react';
import { gof } from 'chi-sq-test';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

import "./App.css";

// chart info
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Legend
);

ChartJS.defaults.font.family = 'Arial';
ChartJS.defaults.font.size = 16;
ChartJS.defaults.color = "#ffffff";

const labels = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
const options = {
  plugins: {
    title: {
      display: true,
      text: 'Dice Stats'
    }
  }
}


export default function App() {
  const [counts, setCounts] = useState(Array(11).fill(0));
  const [value, setValue] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Actual",
        data: counts,
        backgroundColor: "#7209B760",
        grouped: false
      },
      {
        label: "Expected",
        data: calculateExpected(counts),
        backgroundColor: "#88888860",
        grouped: false
      }
    ]
  };

  function handleCountsChange(num, newCount) {
    const newCounts = counts.slice();
    newCounts[num-2] = newCount;
    setCounts(newCounts);
  }

  function handleCalculate() {
    const newValue = calculateValue(counts);
    setValue(newValue);

    setIsSubmitted(true);
  }

  function handleGoBack() {
    const newCounts = Array(11).fill(0);
    setCounts(newCounts);

    setIsSubmitted(false);
  }
  
  return (
    <div className="app">
      <h1>Are My Dice Rigged<em>*</em>?</h1>
      <p><em>*</em>Based on a Chi-Square goodness of fit test</p>
      <hr/>

      { !isSubmitted ? <p>Enter the number of times each sum was rolled (2 dice):</p> : <></>}

      <div className="number-chart-box">
        {isSubmitted ? 
          <Bar data={data} options={options} /> :
          <NumberInputPanel counts={counts} onCountsChange={handleCountsChange} />
        }
      </div>
      
      { !isSubmitted ? 
        <button className="calculate-button" onClick={handleCalculate}>Calculate</button> :
        <button className="calculate-button" onClick={handleGoBack}>Go back</button>
      }
    
      
      { isSubmitted ?
      <>
        <div className="calculate-result">
          <p>P-value = <em className={value < 0.05 ? "rejected" : "not-rejected" }>{value.toFixed(4)}</em></p>
          <p>
            <em className={value < 0.05 ? "rejected" : "not-rejected" }>{value.toFixed(4)}</em> {value < 0.05 ? "<" : ">"} 0.05 
            so there <em className={value < 0.05 ? "rejected" : "not-rejected" }>{value < 0.05 ? "IS" : "IS NOT"}</em> sufficient evidence that these dice do not follow their expected distribution.
          </p>
          {/* <p>{value < 0.05 ? "(Or you are just very lucky/unlucky, but at least now you have statistical evidence of that!)" : ""}</p> */}
        </div>

        <div className="info">
          <p>Helpful links</p>
          <a href="https://statisticsbyjim.com/hypothesis-testing/interpreting-p-values/">
            How to interpret a p-value
          </a>
          <a href="https://www.jmp.com/en_us/statistics-knowledge-portal/chi-square-test.html">
            Learn more about Chi-Square goodness of fit tests 
          </a>
          
        </div>
      </> :
      <></>
      }
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

// function ChartComponent({ data }) {
//   const chartRef = useRef(null);

//   useEffect(() => {
//     const ctx = chartRef.current.getContext('2d');
//     new Chart(ctx, {
//       type: 'bar',
//       data: data,
//       options: {
//         // Customize chart options here
//       }
//     });
//   }, [data]);

//   return <canvas ref={chartRef} />;
// }




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
