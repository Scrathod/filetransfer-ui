const BASE_URL = "http://localhost:8080/api/files";


const USERNAME = "bankuser";
const PASSWORD = "bank123";


const authHeader = "Basic " + btoa(`${USERNAME}:${PASSWORD}`);


export async function uploadFile(file) {
const formData = new FormData();
formData.append("file", file);


const response = await fetch(`${BASE_URL}/upload`, {
method: "POST",
headers: {
Authorization: authHeader
},
body: formData
});


return handleResponse(response);
}


export async function listFiles() {
const response = await fetch(`${BASE_URL}/list`, {
headers: { Authorization: authHeader }
});


return handleResponse(response);
}


export async function downloadFile(filename) {
const response = await fetch(`${BASE_URL}/download/${filename}`, {
headers: { Authorization: authHeader }
});


if (!response.ok) {
const err = await response.json();
throw new Error(err.message || "Download failed");
}


const blob = await response.blob();
const url = window.URL.createObjectURL(blob);


const a = document.createElement("a");
a.href = url;
a.download = filename;
document.body.appendChild(a);
a.click();
a.remove();
}




export function uploadFileWithProgress(file, onProgress) {
return new Promise((resolve, reject) => {
const xhr = new XMLHttpRequest();
const formData = new FormData();
formData.append('file', file);


xhr.upload.onprogress = (e) => {
if (e.lengthComputable) {
const percent = Math.round((e.loaded / e.total) * 100);
onProgress(percent);
}
};


xhr.onload = () => {
if (xhr.status >= 200 && xhr.status < 300) {
resolve(JSON.parse(xhr.responseText));
} else {
reject(new Error('Upload failed'));
}
};


xhr.onerror = () => reject(new Error('Maximum upload size exceeded,80MB Allowed'));


xhr.open('POST', `${BASE_URL}/upload`);
xhr.setRequestHeader('Authorization', authHeader);
xhr.send(formData);
});
}

async function handleResponse(response) {
  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("Unexpected server error");
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}