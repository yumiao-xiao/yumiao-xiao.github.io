import { useState } from "react";
import { ExternalLink } from "lucide-react";
import PdfPreview from "./PdfPreview";
import RelatedPapers from "./RelatedPapers";
import config from "../../config/paper-recommendations.json";
import "../css/DailyPapers.css";

const dailyFeed = { id: "daily" };

export default function DailyPapers() {
  const [paper, setPaper] = useState(null);
  const curated = config.daily?.papers;

  if (curated?.length) {
    return (
      <section id="daily-papers" className="related-papers daily-papers" aria-labelledby="key-literature-heading">
        <div className="related-heading"><h2 className="card-title" id="key-literature-heading">{config.daily.title || "Key Literature"}</h2></div>
        {config.daily.keywords?.length > 0 && <div className="related-meta-row">
          <div className="related-keywords related-keyword-tags" aria-label="Search keywords">
            {config.daily.keywords.map((keyword) => <span className="related-keyword-tag" key={keyword}>{keyword}</span>)}
          </div>
        </div>}
        <ul className="literature-list">
          {curated.map((item) => (
            <li key={item.title}>
              <a className="literature-item" href={item.url} target="_blank" rel="noreferrer">
                <span className="literature-text">
                  <span className="literature-title">{item.title}</span>
                  <span className="literature-meta">
                    {item.authors && <span className="literature-authors">{item.authors}</span>}
                    {item.authors && item.source && <span className="literature-sep" aria-hidden="true">·</span>}
                    {item.source && <span className="literature-source">{item.source}</span>}
                  </span>
                </span>
                <ExternalLink className="literature-icon" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </section>
    );
  }

  return <>
    <svg aria-hidden="true" width="0" height="0" style={{position: "absolute", pointerEvents: "none"}}>
      <defs><filter id="daily-remove-white" colorInterpolationFilters="sRGB">
        <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -10 -10 -10 0 30" result="whiteMask" />
        <feComposite in="SourceGraphic" in2="whiteMask" operator="in" />
      </filter></defs>
    </svg>
    <RelatedPapers paper={dailyFeed} daily onOpen={setPaper} />
    {paper && <PdfPreview key={paper.id} url={paper.pdfUrl} name={paper.title} kind="paper" standalone onClose={() => setPaper(null)} />}
  </>;
}
