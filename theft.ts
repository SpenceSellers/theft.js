import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts"
import { parse } from "https://deno.land/std@0.123.0/flags/mod.ts";

async function expandCode(code: string): Promise<string> {
    return await replaceAsync(code, /\<(http.*?)\>/g, async (_: string, b: string) => {
        return await expandCode(await expandUrl(b));
    });
}

async function expandUrl(url: string): Promise<string> {
    const res = await fetch(url)
    const contentTypeHeader = res.headers.get("Content-Type");
    const contentType = contentTypeHeader?.split(";")[0];

    if (contentType === "text/html") {
        return extractCodeFromHtml(await res.text(), {});
    } else {
        const text = await res.text();
        return text;
    }
}

function extractCodeFromHtml(html: string, urlTags: any): string {
    const doc = new DOMParser().parseFromString(html, "text/html")!;

    const selectors = [
        "#answers pre", // Prefer the first Stack Overflow answer if possible
        ".blob-code-content", // The code area from a github link. The user SHOULD have used a raw link, but that's not for us to judge.
        "pre",
        "code", // "code" is used for a single word or line, so it's not as appealing as a whole block like "pre"
        "body",
        "html"
    ];

    for (const selector of selectors) {
        const node = doc.querySelector(selector);
        if (!node) continue;
        const content = node.textContent;
        if (content.length == 0) continue;
        return content;
    }

    throw new Error(`Unable to extract code from HTML`);
}

async function replaceAsync(str: string, regex: RegExp, asyncFn: (full: string, capture: string) => Promise<string>) {
    const promises: any = [];
    str.replace(regex, (match, ...args) => {
        const promise = asyncFn(match, args[0]);
        promises.push(promise);
        return "";
    });
    const data = await Promise.all(promises);
    return str.replace(regex, () => data.shift());
}

async function main() {
    const args = parse(Deno.args);
    const filename = args._[0] as string;

    const text = await Deno.readTextFile(filename);

    const expanded = await expandCode(text);

    if (args.expand) {
        console.log(expanded);
    } else {
        eval(expanded);
    }
}

main();