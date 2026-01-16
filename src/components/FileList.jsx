import { downloadFile } from "../api/client";


export default function FileList({ files, setToast }) {


const handleDownload = async (name) => {
try {
await downloadFile(name);
setToast({ message: `Downloaded ${name}`, type: "success" });
} catch (err) {
setToast({ message: err.message, type: "error" });
}
};


return (
<div className="card">
<h3>Uploaded Files</h3>


{files.length === 0 ? (
<p>No files available</p>
) : (
<ul>
{files.map((f) => (
<li key={f}>
{f}
<button onClick={() => handleDownload(f)}>Download</button>
</li>
))}
</ul>
)}
</div>
);
}