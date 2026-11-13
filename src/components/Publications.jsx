import React, { useEffect, useState } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import "../css/Publications.css";
import { publications } from "../siteConfig";
import PublicationPreview from "./PublicationPreview";
import { fetchScholarCitations, resolveCitationCount } from "../utils/scholarCitations";

export default function Publications() {
  const [citationMap, setCitationMap] = useState({});
  const [abstractPaper, setAbstractPaper] = useState(null);

  useEffect(() => {
    let active = true;
    fetchScholarCitations().then((citations) => {
      if (active) setCitationMap(citations);
    });
    return () => { active = false; };
  }, []);

  return (
    <section id="publications">
      <div className="card-title">Selected Publications</div>
      <div className="publications-list">
        {publications.map((paper) => {
          const citationCount = resolveCitationCount(paper.title, citationMap);
          return (
          <article className="publication-card" id={paper.id} key={paper.id}>
            <img className="publication-image" src={paper.image} alt="" />
            <div className="publication-content">
              <div className="publication-venue">
                <span className={`venue-tag ${paper.venueType}`}>{paper.venue}</span>
                {paper.ccf && <span className="venue-tag ccf">{paper.ccf}</span>}
              </div>
              <h3 className="publication-title">
                {paper.abstract ? (
                  <button className="publication-abstract-trigger" type="button" aria-haspopup="dialog" aria-label={`Preview paper: ${paper.title}`} onClick={() => setAbstractPaper(paper)}>
                    {paper.title}
                  </button>
                ) : paper.title}
              </h3>
              <div className="publication-author-row">
                <div className="publication-authors">{paper.authors.map((author, index) => author.strong ? <strong key={index}>{author.text}</strong> : <React.Fragment key={index}>{author.text}</React.Fragment>)}</div>
                <div className="publication-author-tags">
                  {Number.isFinite(citationCount) && citationCount > 0 && <span className="publication-author-tag is-citation">Cited by {citationCount}</span>}
                  {paper.authorTag && <span className={`publication-author-tag is-${paper.authorTag.type}`}>{paper.authorTag.type === "rank" && <span className="challenge-trophy" aria-hidden="true">🏆</span>}{paper.authorTag.label}</span>}
                </div>
              </div>
              <div className="publication-tags">{paper.tags.map((tag) => <span className="tag-item-show" key={tag}>{tag}</span>)}</div>
              <div className="publication-links">
                <a href={paper.link} target="_blank" rel="noreferrer"><AiOutlineFileText aria-hidden="true" />Paper</a>
              </div>
            </div>
          </article>
          );
        })}
      </div>
      {abstractPaper && <PublicationPreview paper={abstractPaper} papers={publications} onChange={setAbstractPaper} onClose={() => setAbstractPaper(null)} />}
    </section>
  );
}
