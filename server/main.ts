import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Status } from "https://deno.land/std@0.177.0/http/http_status.ts";

const [index, style, core, wasm, favicon] = await Promise.all([
	Deno.readFile("assets/index.html"),
	Deno.readFile("assets/style.min.css"),
	Deno.readFile("assets/kana.min.js"),
	Deno.readFile("assets/lib/kana.wasm"),
	Deno.readFile("assets/favicon.svg"),
]);

const assets: Map<string, [Uint8Array, string]> = new Map([
	["/", [index, "text/html"]],
	["/style.css", [style, "text/css"]],
	["/kana.js", [core, "text/javascript"]],
	["/kana.wasm", [wasm, "application/wasm"]],
	["/favicon.svg", [favicon, "image/svg+xml"]],
]);

function handler(req: Request) {
	const url = new URL(req.url);
	const { pathname } = url;

	const asset = assets.get(pathname);

	if (!asset) {
		return Response.redirect(url.origin);
	}

	const [data, mimeType] = asset;

	return new Response(data, { headers: { "content-type": mimeType } });
}

serve(handler, { port: 8000 });
