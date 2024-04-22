import { useEffect, useState } from "react";

const SUMMARIZE_URL =
  process.env.NODE_ENV === "production"
    ? "/api/summarize"
    : "http://localhost:3000/api/summarize";

export default function Home() {
  const [summary, setSummary] = useState("");
  const [metadata, setMetadata] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const summarizeText = (text) => {
    fetch(SUMMARIZE_URL, {
      method: "POST",
      body: JSON.stringify({ text }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsLoading(false);
        setSummary(data.message.content);
        
        localStorage.setItem("summary", data.message.content);
      });
  };

  const onLoadFile = (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== "application/pdf") {
      console.error(file?.name || "File", "is not a PDF file.");
      return;
    }

    const fileReader = new FileReader();
    fileReader.onload = () => {
      const typedarray = new Uint8Array(fileReader.result);

      pdfjsLib.getDocument({ data: typedarray }).promise.then((pdf) => {
      
        pdf.getMetadata().then((data) => {
          setMetadata(data.info);
        });

        pdf.getPage(1).then((page) => {
          page.getTextContent().then((textContent) => {
            let text = "";
            textContent.items.forEach((item) => {
              text += item.str + " ";
            });

            document.getElementById("pdfContent").innerText = text;
            setIsLoading(true);
            summarizeText(text);
          });
        });
      });
    };
    fileReader.readAsArrayBuffer(file);
  };

  useEffect(() => {
    
    const savedSummary = localStorage.getItem("summary");
    if (savedSummary) {
      setSummary(savedSummary);
    }

    const fileInput = document.getElementById("file-input");
    if (fileInput) {
      fileInput.addEventListener("change", onLoadFile);
    }
    return () => {
      if (fileInput) {
        fileInput.removeEventListener("change", onLoadFile);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-12">
      <div className="absolute top-10 left-10 flex items-center gap-4">
        <span className="text-3xl font-bold text-gray-800 ">Resume Summarizer</span>
      </div>

      <input className="hidden" id="file-input" type="file" />

      <button
        onClick={() => document.getElementById("file-input").click()}
        className="rounded-xl mt-10 text-white bg-red-600 p-4 font-bold flex items-center hover:bg-red-700 transition duration-300 ease-in-out"
      >
        <span>Upload PDF</span>
      </button>

      <div className="flex gap-5 mt-20 w-full">
        <div className="w-1/2">
          <h2 className="text-center mb-4 text-2xl font-semibold text-gray-800 bg-gradient-to-r from-green-500 to-green-300 py-2 rounded-lg">
            Text from the Resume
          </h2>
          <div className="text-gray-800 bg-white rounded-lg shadow-md p-4" id="pdfContent">
            {}
          </div>
        </div>

        <div className="w-1/2">
          <h2 className="text-center mb-4 text-2xl font-semibold text-gray-800 bg-gradient-to-r from-green-300 to-green-500 py-2 rounded-lg">
            Summarized Resume
          </h2>
          {isLoading ? (
            <p className="text-gray-800 text-center">Connecting the AI to get Results...</p>
          ) : (
            <div className="text-gray-800 bg-white rounded-lg shadow-md p-4">{summary}</div>
          )}
        </div>
      </div>

      {}
      <div className="mt-10 text-gray-800">
        <h2 className="text-2xl font-semibold mb-2">Metadata</h2>
        <ul>
          {Object.entries(metadata).map(([key, value]) => (
            <li key={key}>
              <strong>{key}: </strong>
              {typeof value === "object" ? JSON.stringify(value) : value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
