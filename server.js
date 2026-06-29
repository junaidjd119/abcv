const http = require("http");
const fs = require("fs");
const path = require("path");
const PORT = 8080;
const MIME = { ".html":"text/html", ".css":"text/css", ".js":"application/javascript", ".png":"image/png", ".jpg":"image/jpeg", ".ico":"image/x-icon", ".xml":"application/xml", ".txt":"text/plain", ".json":"application/json", ".mp4":"video/mp4", ".svg":"image/svg+xml", ".webp":"image/webp" };

http.createServer((req, res) => {
    let urlPath = decodeURI(req.url.split("?")[0]);
    let filePath = path.resolve(path.join(__dirname, urlPath));
    
    // Path traversal check
    if (!filePath.startsWith(__dirname)) {
        res.writeHead(403);
        res.end("403 Forbidden");
        return;
    }
    
    if (urlPath === "/") filePath = path.resolve(path.join(__dirname, "index.html"));
    let ext = path.extname(filePath).toLowerCase();
    fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end("404"); return; }
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream", "Accept-Ranges": "bytes" });
        res.end(data);
    });
}).listen(PORT, () => console.log("Server: http://127.0.0.1:" + PORT));
