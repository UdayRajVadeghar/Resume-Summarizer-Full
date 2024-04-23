import { faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
    <div className="font-serif">
      <nav className=" bg-teal-500 sticky top-0 z-50">
        <ul className="flex justify-around p-4 items-center">
          <li className="w-4/5 text-5xl font-serif">Resume Summarizer</li>
          <li className="border-2 text-xl bg-lime-500 rounded-lg p-2 px-3"><button>Login</button></li>
          <li className="border-2 text-xl bg-lime-500 rounded-lg p-2 px-3"><button>Sign Up</button></li>
        </ul>   
      </nav>
      <input className="hidden" id="file-input" type="file" />
      <div>
        <p className="text-3xl p-10 m-3 mx-10">
           Welcome to Resume Summarizer! Click to instantly condense your resume, efficiently highlighting key details for easy reference
        </p>
      </div>
      <div className="m-3 px-10 pt-10 mx-10 items-center justify-around">
        <div className="text-3xl">
          Click Here to Summarize the Resume.<br></br>Make sure it is <span className='font-bold'>.pdf</span> format
        </div>
        <div>
          
            <button
            onClick={() => document.getElementById("file-input").click()}
            className="rounded-xl mt-10 text-white bg-red-600 p-4 font-bold flex items-center hover:bg-red-700 transition duration-300 ease-in-out"
          >
            <span>Upload Resume</span>
          </button>
        </div>
      </div>
      <div className="flex justify-center h-10 items-center text-4xl font-serif p-10 m-10 bg-teal-200">
        <h1>
          Summerized Resume
        </h1>  
      </div>
      <div className="text-2xl p-10">
        {isLoading ? (
          <p className="text-gray-800 text-center">Connecting the AI to get Results...</p>
        ) : (
          <ul className="text-gray-800 bg-white rounded-lg shadow-md p-4">
            {summary.split('• ').map((sentence, index) => (
              <div key={index}>
                <li>
                  <span className="text-3xl font-serif">--&gt;</span>
                  <span>{sentence}</span>
                </li>
              </div>
            ))}
          </ul>
        )}
      </div>
      <div className="flex justify-center h-10 items-center text-4xl font-serif p-10 m-10 bg-teal-200">
        <h1>
          Text From Resume
        </h1>  
        </div>
      <div className="text-gray-800 bg-white rounded-lg shadow-md m-10 text-2xl p-4" id="pdfContent">
            
      </div>
      <div className="text-2xl">
        <div className="">
          <div className='flex justify-center h-10 items-center text-4xl font-serif p-10 m-10 bg-teal-200'>
            <h1>Metadata</h1>
          </div>
          
          <div className='m-10'>
            <ul className="mt-4">
              {Object.entries(metadata).map(([key, value]) => (
                <li key={key} className="pt-2">
                  <strong>{key}: </strong>
                  {typeof value === "object" ? JSON.stringify(value) : value}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div>
      <div className='lg:flex pt-10 mt-10 bg-gray-300'>
          <div className='lg:w-1/3 p-4 flex-grow-0 flex-shrink-0 grid grid-rows-2'>
            
            <div className='flex pl-10'>
              <FontAwesomeIcon icon={faGithub} className='pr-3'/>
              <FontAwesomeIcon icon={faTwitter} /><br></br>
            </div>
          </div>
          <div className='flex-grow p-4 lg:grid md:grid grid-cols-4 '>
            <div className='p-4'>
              <ul>
                <li className='p-2 font-bold'><button>About us</button></li>
                <li className='p-2'><button>Resources</button></li>
                <li className='p-2'><button>Blog</button></li>
                <li className='p-2'><button>Careers</button></li>
                <li className='p-2'><button>Contact</button></li>
                <li className='p-2'><button>Customers</button></li>
                <li className='p-2'><button>Help Center</button></li>
                <li className='p-2'><button>Podcast</button></li>
              </ul>
            </div>
            <div className='p-4'>
              <ul>
                <li className='p-2 font-bold'><button>Documentation</button></li>
                <li className='p-2'><button>Quickstart Guide</button></li>
                <li className='p-2'><button>System Status</button></li>
                <li className='p-2'><button>SDKs</button></li>
                <li className='p-2'><button>API Reference</button></li>
                <li className='p-2'><button>Sample Apps</button></li>
                <li className='p-2'><button>Migration Guide</button></li>
                <li className='p-2'><button>View All Docs</button></li>
              </ul>
            </div>
            <div className='p-4'>
              <ul>
                <li className='p-2 font-bold'><button>Procuct</button></li>
                <li className='p-2'><button>Why Pdf Summarizer?</button></li>
                <li className='p-2'><button>Integrations</button></li>
                <li className='p-2'><button>For Engineering Teams</button></li>
                <li className='p-2'><button>For Marketing Teams</button></li>
                <li className='p-2'><button>For Product Teams</button></li>
                <li className='p-2'><button>Apple Receipt Checker</button></li>
                <li className='p-2'><button>Pricing</button></li>
              </ul>
            </div>
            <div className='p-4'>
              <ul>
                <li className='p-2 font-bold'><button>Legal</button></li>
                <li className='p-2'><button>Privacy Policy</button></li>
                <li className='p-2'><button>Terms and Conditions</button></li>
                <li className='p-2'><button>Doodle</button></li>
                <li className='p-2'><button>Policyy</button></li>
        
              </ul>
            </div>
          </div>
        
        </div>
        <p className='pl-10'>©2022 RevenueCat</p>
      </div>
      
    </div>
  );
}
