import { Language, minify } from "https://deno.land/x/minifier@v1.1.1/mod.ts";

await Deno.mkdir("www", { recursive: true });

async function minifyFile(lang: Language, src: string, dst?: string): Promise<void> {
	const encoder = new TextEncoder();
	const decoder = new TextDecoder();
	const bytes = await Deno.readFile(`src/site/${src}`);
	const minified = minify(lang, decoder.decode(bytes));

	return Deno.writeFile(`www/${dst || src}`, encoder.encode(minified));
}

const tasks = [
	minifyFile(Language.HTML, "index.html"),
	minifyFile(Language.CSS, "style.css", "style.min.css"),
	minifyFile(Language.JS, "kana.js", "kana.min.js"),
	Deno.run({
		cmd: ["zig", "build", "-Drelease-fast", "--prefix", "www"],
		env: {
			"DESTDIR": "",
		},
	}).status(),
];

await Promise.all(tasks);
