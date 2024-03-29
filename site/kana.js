let result = "";
const inputs = {
	romaji: document.getElementById("romaji"),
	katakana: document.getElementById("katakana"),
	extended: document.getElementById("extended"),
	punctuation: document.getElementById("punctuation"),
	forceProlongation: document.getElementById("force-prolongation"),
	kanaToggle: document.getElementById("kana-toggle"),
	rawToggle: document.getElementById("raw-toggle"),
	prolongationReset: document.getElementById("prolongation-reset"),
	vowelShortener: document.getElementById("vowel-shortener"),
	virtualStop: document.getElementById("virtual-stop"),
};
const output = document.getElementById("result");
const loading = document.getElementById("loading");
const copy = document.getElementById("copy");

const encodeString = (value) => {
	const buffer = new TextEncoder().encode(value);
	const ptr = allocString(buffer.length + 1);
	const slice = new Uint8Array(memory.buffer, ptr, buffer.length + 1);
	slice.set(buffer);
	slice[buffer.length] = 0;

	return ptr;
};

const decodeString = (ptr, len) => {
	const slice = new Uint8Array(memory.buffer, ptr, len);

	return new TextDecoder().decode(slice);
};

const parseCheckbox = (el) => {
	if (!el) {
		return false;
	}

	return el.checked;
};

const parseAscii = (el, char) => {
	return parseCheckbox(el) ? char.charCodeAt(0) : 0;
};

const convert = () => {
	setTimeout(() => {}, 0);
	const ptr = encodeString(inputs.romaji.value);

	transliterate(
		ptr,
		parseCheckbox(inputs.katakana),
		parseCheckbox(inputs.extended),
		parseCheckbox(inputs.punctuation),
		parseCheckbox(inputs.forceProlongation),
		parseAscii(inputs.kanaToggle, "@"),
		parseAscii(inputs.rawToggle, "#"),
		parseAscii(inputs.prolongationReset, "^"),
		parseAscii(inputs.vowelShortener, "_"),
		parseAscii(inputs.virtualStop, "%"),
	);
	freeString(ptr);
};

const initialYear = 2023;
const currentYear = new Date().getUTCFullYear();
const copyright = document.getElementById("copyright-year");
copyright.innerText = initialYear === currentYear ? initialYear : `${initialYear}-${currentYear}`;

const {
	instance: {
		exports: { memory, allocString, freeString, transliterate },
	},
} = await WebAssembly.instantiateStreaming(fetch("kana.wasm"), {
	env: {
		handleResult(ptr, len) {
			output.innerText = len > 0 ? decodeString(ptr, len) : "";
		},
	},
});

for (let [key, value] of Object.entries(inputs)) {
	value.addEventListener(key === "romaji" ? "keyup" : "input", () => {
		convert();
	});
}

copy.addEventListener("click", () => {
	navigator.clipboard.writeText(output.innerText || output.textContent);
});
