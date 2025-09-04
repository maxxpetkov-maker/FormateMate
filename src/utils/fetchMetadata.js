/**
 * Fetches metadata for a given input (URL, DOI, or ISBN).
 * Returns CSL-JSON for Citation.js.
 */
const DOI_REGEX = /^10.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
const ISBN_REGEX = /^(?:ISBN(?:-1[03])?:?\ )?((?:97[89])?\d{9}[\dxX])$/;
const URL_REGEX = /^https?:\/\/\S+$/i;

export default async function fetchMetadata(input) {
  input = input.trim();
  // DOI
  if (DOI_REGEX.test(input)) {
    const res = await fetch(`https://doi.org/${input}`, {
      headers: { Accept: "application/citeproc+json" }
    });
    if (!res.ok) return null;
    return await res.json();
  }
  // ISBN
  if (ISBN_REGEX.test(input.replace(/-/g, ""))) {
    const isbn = input.replace(/[^0-9Xx]/g, "");
    const res = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&jscmd=data&format=json`);
    const data = await res.json();
    if (data[`ISBN:${isbn}`]) {
      // Minimal CSL-JSON conversion
      const book = data[`ISBN:${isbn}`];
      return {
        type: "book",
        title: book.title,
        author: (book.authors || []).map(a => ({ family: a.name })),
        issued: { "date-parts": [[book.publish_date ? parseInt(book.publish_date) : 2000]] },
        publisher: (book.publishers && book.publishers[0] && book.publishers[0].name) || ""
      };
    }
    return null;
  }
  // URL
  if (URL_REGEX.test(input)) {
    // Use citation-js's built-in support
    return input;
  }
  // Try as DOI if input starts with "https://doi.org/"
  if (input.startsWith("https://doi.org/")) {
    return await fetchMetadata(input.replace(/^https:\/\/doi\.org\//, ""));
  }
  return null;
}
