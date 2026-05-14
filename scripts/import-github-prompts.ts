/**
 * Reserved for phase one data ingestion.
 *
 * Planned flow:
 * 1. Read a GitHub README or local Markdown file.
 * 2. Extract case title, category heading, image Markdown, prompt code blocks, and source anchors.
 * 3. Write a raw JSON draft for manual Chinese localization and quality review.
 * 4. Normalize the reviewed data into src/data/prompts.json.
 *
 * Page development must not depend on this script in the MVP.
 */
export {};
