
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));

const HOST = process.env.IP || process.env.HOST || "::";
const PORT = Number(process.env.PORT || 8100);

// Tipos de arquivos suportados
const MIME_TYPES = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".mjs": "application/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".otf": "font/otf",
    ".mp3": "audio/mpeg",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
    ".wasm": "application/wasm",
    ".xml": "application/xml",
    ".txt": "text/plain; charset=utf-8"
};

function respond(res, status, message) {
    res.writeHead(status, {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store"
    });

    res.end(message);
}

const server = http.createServer(async (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
        res.setHeader("Allow", "GET, HEAD");
        return respond(res, 405, "Method Not Allowed");
    }

    try {
        const url = new URL(req.url, "http://localhost");

        let pathname = decodeURIComponent(url.pathname);

        // Bloqueia arquivos e diretórios internos
        const segments = pathname.split("/");

        if (segments.some(segment =>
            segment === ".git" ||
            segment === ".env" ||
            segment === "node_modules"
        )) {
            return respond(res, 403, "Forbidden");
        }

        // Normaliza o caminho solicitado
        if (pathname === "/") {
            pathname = "/index.html";
        }

        const requestedPath = path.resolve(
            ROOT,
            "." + pathname
        );

        // Impede acesso fora da raiz do projeto
        const relativePath = path.relative(ROOT, requestedPath);

        if (
            relativePath.startsWith("..") ||
            path.isAbsolute(relativePath)
        ) {
            return respond(res, 403, "Forbidden");
        }

        // Verifica a existência real do arquivo
        let filePath = await fs.promises.realpath(requestedPath);

        // Impede acesso externo através de links simbólicos
        const realRelative = path.relative(ROOT, filePath);

        if (
            realRelative.startsWith("..") ||
            path.isAbsolute(realRelative)
        ) {
            return respond(res, 403, "Forbidden");
        }

        let stats = await fs.promises.stat(filePath);

        // Diretórios devem possuir index.html
        if (stats.isDirectory()) {
            filePath = path.join(filePath, "index.html");
            filePath = await fs.promises.realpath(filePath);

            const directoryRelative = path.relative(ROOT, filePath);

            if (
                directoryRelative.startsWith("..") ||
                path.isAbsolute(directoryRelative)
            ) {
                return respond(res, 403, "Forbidden");
            }

            stats = await fs.promises.stat(filePath);
        }

        if (!stats.isFile()) {
            return respond(res, 404, "Not Found");
        }

        const extension = path.extname(filePath).toLowerCase();

        const contentType =
            MIME_TYPES[extension] || "application/octet-stream";

        res.writeHead(200, {
            "Content-Type": contentType,
            "Content-Length": stats.size,
            "Cache-Control": "no-store",
            "X-Content-Type-Options": "nosniff"
        });

        if (req.method === "HEAD") {
            return res.end();
        }

        const stream = fs.createReadStream(filePath);

        stream.on("error", error => {
            console.error("File stream error:", error);

            if (!res.headersSent) {
                respond(res, 500, "Internal Server Error");
            } else {
                res.destroy(error);
            }
        });

        stream.pipe(res);

    } catch (error) {
        if (error.code === "ENOENT" || error.code === "ENOTDIR") {
            return respond(res, 404, "Not Found");
        }

        console.error("Server error:", error);

        if (!res.headersSent) {
            respond(res, 500, "Internal Server Error");
        } else {
            res.destroy(error);
        }
    }
});

server.listen(PORT, HOST, () => {
    console.log("--------------------------------");
    console.log(" NEI Preços - HTTP Server");
    console.log("--------------------------------");
    console.log(`Host: ${HOST}`);
    console.log(`Port: ${PORT}`);
    console.log(`Root: ${ROOT}`);
    console.log(`Entry: ${path.join(ROOT, "index.html")}`);
    console.log("--------------------------------");
});
