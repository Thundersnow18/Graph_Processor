import React, { useState } from 'react';
import GraphResults from '../components/GraphResults';

const Home = () => {
  const [inputData, setInputData] = useState('[\n  "A->B",\n  "A->C",\n  "B->D"\n]');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    let parsedData;
    try {
      parsedData = JSON.parse(inputData);
      if (!Array.isArray(parsedData)) {
        throw new Error("Input must be a JSON array.");
      }
    } catch (err) {
      setError("Invalid JSON format. Please enter a valid JSON array.");
      setLoading(false);
      return;
    }

    try {
      let apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/bfhl';
      if (!apiUrl.endsWith('/bfhl')) {
        apiUrl = apiUrl.replace(/\/$/, '') + '/bfhl';
      }
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: parsedData }),
      });

      if (!response.ok) {
        throw new Error(`Server Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header>
        <h1>Graph Processor</h1>
        <p>Enter a JSON array of directed edges (e.g., ["A-&gt;B"])</p>
      </header>

      <main>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="edgesInput">Graph Edges (JSON Array)</label>
            <textarea
              id="edgesInput"
              rows={8}
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              placeholder='["A->B", "A->C"]'
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Processing...' : 'Submit'}
          </button>
        </form>

        <GraphResults result={result} />
      </main>
    </div>
  );
};

export default Home;
