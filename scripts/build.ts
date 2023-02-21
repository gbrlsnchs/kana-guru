import { Language, minify } from "https://deno.land/x/minifier@v1.1.1/mod.ts";

const encoder = new TextEncoder();
const now = new Date();

await Deno.mkdir("server/assets", { recursive: true });

async function minifyFile(lang: Language, src: string, dst?: string): Promise<void> {
	const encoder = new TextEncoder();
	const decoder = new TextDecoder();
	const bytes = await Deno.readFile(`site/${src}`);
	const minified = minify(lang, decoder.decode(bytes));

	return Deno.writeFile(`server/assets/${dst || src}`, encoder.encode(minified));
}

const tasks = [
	minifyFile(Language.HTML, "index.html"),
	minifyFile(Language.CSS, "style.css", "style.min.css"),
	minifyFile(Language.JS, "kana.js", "kana.min.js"),
	Deno.run({
		cmd: ["zig", "build", "-Drelease-fast", "--prefix", "assets"],
		env: {
			"DESTDIR": "server",
		},
	}).status(),
];

await Promise.all(tasks);
await Deno.writeFile("/tmp/kana-guru-sync", encoder.encode(now.toString()), { mode: 0o777 });
