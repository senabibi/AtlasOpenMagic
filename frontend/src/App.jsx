import { useState } from "react";
import "./App.css";

function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function runAnalysis() {
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dataset_id: "301204",
          release: "2024r-pp",
          max_events: 20000,
        }),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        status: "error",
        message: error.message,
      });
    }

    setLoading(false);
  }

  return (
    <div className="app">
      <header>
        <div className="badge">ATLAS · OPEN SCIENCE</div>

        <h1>Reproducible Analysis</h1>

        <p>
          Run computational analyses on ATLAS Open Data
          with a reproducible software configuration.
        </p>
      </header>

      <section className="card">
        <h2>Analysis configuration</h2>

        <p>
          <strong>Dataset:</strong> 301204
        </p>

        <p>
          <strong>Release:</strong> 2024r-pp
        </p>

        <p>
          <strong>Events:</strong> 20,000
        </p>

        <button onClick={runAnalysis} disabled={loading}>
          {loading ? "Running..." : "Run Analysis"}
        </button>
      </section>

      {result && (
        <section className="card success">
          <h2>✓ Analysis completed</h2>

          <p>
            Dataset: <strong>{result.dataset_id}</strong>
          </p>

          <p>
            Release: <strong>{result.release}</strong>
          </p>

          <p>
            Events:{" "}
            <strong>
              {result.events_processed?.toLocaleString()}
            </strong>
          </p>

          <p>
            Cross section:{" "}
            <strong>{result.cross_section_pb} pb</strong>
          </p>

          <p>
            Remote files:{" "}
            <strong>{result.remote_files_found}</strong>
          </p>

          <p>
            Local files:{" "}
            <strong>{result.local_files_found}</strong>
          </p>

          <h3>Reproducibility manifest</h3>

          <pre>
            {JSON.stringify(result.manifest, null, 2)}
          </pre>
        </section>
      )}

      {result?.status === "error" && (
        <section className="card error">
          <h2>Error</h2>
          <p>{result.message}</p>
        </section>
      )}
    </div>
  );
}

export default App;
