import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Status } from "https://deno.land/std@0.177.0/http/http_status.ts";

const [index, style, core, wasm] = await Promise.all([
	Deno.readFile("www/index.html"),
	Deno.readFile("www/style.min.css"),
	Deno.readFile("www/kana.min.js"),
	Deno.readFile("www/lib/kana.wasm"),
]);

function handler(req: Request) {
	const { pathname } = new URL(req.url);

	if (pathname === "/") {
		return new Response(index, {
			headers: {
				"content-type": "text/html",
			},
		});
	}

	if (pathname.startsWith("/style.css")) {
		return new Response(style, {
			headers: {
				"content-type": "text/css",
			},
		});
	}

	if (pathname.startsWith("/kana.js")) {
		return new Response(core, {
			headers: {
				"content-type": "text/javascript",
			},
		});
	}

	if (pathname.startsWith("/kana.wasm")) {
		return new Response(wasm, {
			headers: {
				"content-type": "application/wasm",
			},
		});
	}

	return Response.redirect("/");
}

serve(handler, {
	port: 8000,
});
