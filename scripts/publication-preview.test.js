import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";

test("all custom layouts and a new paper without preview data render", async () => {
  const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false, watch: null }, appType: "custom", optimizeDeps: { noDiscovery: true, include: [] } });
  try {
    const { default: Preview } = await server.ssrLoadModule("/src/components/PublicationPreview.jsx");
    const { publications, publicationPreviews } = await server.ssrLoadModule("/src/siteConfig.js");
    const fallback = { ...publications[0], id: "new-paper", title: "A new paper", abstract: "A new abstract." };
    for (const paper of [...publications, fallback]) {
      const html = renderToStaticMarkup(React.createElement(Preview, {
        paper, papers: [...publications, fallback], onChange() {}, onClose() {}, onCopy() {},
      }));
      assert.match(html, /<dialog/);
      assert.doesNotMatch(html, /NaN|undefined/);
      assert.match(html, /Original abstract/);
      assert.equal((html.match(/id="study-abstract"/g) || []).length, 1);
      assert.ok(html.indexOf('id="study-abstract"') < html.indexOf('class="study-bottom"'));
      if (html.includes('aria-label="Method overview"')) assert.ok(html.indexOf('id="study-abstract"') < html.indexOf('aria-label="Method overview"'));
      assert.doesNotMatch(html, /Paper<\/button>/);
      assert.match(html, /Continue reading the full paper/);
      if (paper.id === "new-paper") {
        assert.match(html, /study--basic/);
        assert.match(html, /<details[^>]*open/);
        assert.doesNotMatch(html, /class="study-results"/);
      }
    }
    publicationPreviews[fallback.id] = {
      template: "narrative", takeaway: "A research question", intro: "A short explanation.",
      headline: "How it works", method: "The method.", figure: "/method.png",
      figureCaption: "Method overview", steps: [], blendFigureBackground: false,
      abstractExpanded: true, labels: { idea: "Research question" },
    };
    const narrative = renderToStaticMarkup(React.createElement(Preview, {
      paper: fallback, papers: [fallback], onChange() {}, onClose() {}, onCopy() {},
    }));
    assert.match(narrative, /study--narrative/);
    assert.match(narrative, /Research question/);
    assert.match(narrative, /filter:none/);
    assert.doesNotMatch(narrative, /NaN|undefined|class="study-results"/);
    assert.match(narrative, /<details[^>]*open/);
  } finally {
    await server.close();
  }
});
