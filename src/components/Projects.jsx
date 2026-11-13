import React, { useRef, useState } from "react";
import "../css/Projects.css";
import { ScanEye, Smartphone } from "lucide-react";
import { BsStars } from "react-icons/bs";
import { FaGithub } from "react-icons/fa";
import { SiHuggingface } from "react-icons/si";
import { TbPhotoSearch } from "react-icons/tb";
import { projects, showProjects } from "../siteConfig";
import DailyPapers from "./DailyPapers";

const actionDetails = {
  app: { label: "App", Icon: Smartphone },
  github: { label: "GitHub", Icon: FaGithub },
  demo: { label: "Demo", Icon: SiHuggingface },
};

const metaIcons = {
  XR: BsStars,
  "Intelligent Transportation": ScanEye,
  "Object Recommendation": TbPhotoSearch,
  "AI SEARCH": TbPhotoSearch,
};

function ProjectMedia({ project }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const playVideo = () => {
    if (!videoRef.current) return;
    setIsPlaying(true);
    videoRef.current.play().catch(() => setIsPlaying(false));
  };

  const resetVideo = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    videoRef.current.currentTime = 0;
    setIsPlaying(false);
  };

  if (project.video) {
    return (
      <div className={`project-video-shell ${isPlaying ? "is-playing" : ""}`}
        onMouseEnter={playVideo} onMouseLeave={resetVideo} onFocus={playVideo} onBlur={resetVideo}>
        <video ref={videoRef} className="project-media" src={project.video} muted loop playsInline
          preload="metadata" aria-label={`${project.title} preview`} />
        <img className="project-video-poster" src={project.image} alt={`${project.title} preview`} />
      </div>
    );
  }

  return <img className="project-media" src={project.image} alt={`${project.title} preview`} />;
}

function ProjectAction({ project }) {
  const { label, Icon } = actionDetails[project.action];
  const content = <><Icon size={14} aria-hidden="true" /><span>{label}</span></>;

  if (!project.link) {
    return <span className="project-link is-disabled" aria-disabled="true">{content}</span>;
  }

  return <a className="project-link" href={project.link} target="_blank" rel="noreferrer">{content}</a>;
}

function ProjectMeta({ meta }) {
  const Icon = metaIcons[meta];

  return (
    <span className="project-meta">
      {Icon && <Icon aria-hidden="true" />}
      <span>{meta}</span>
    </span>
  );
}

export default function Projects() {
  return (
    <section className="card projects-section" id="projects">
      {showProjects && <>
        <div className="card-title">Selected Projects</div>
        <div className="project-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.title}>
              <div className="project-media-frame">
                <img className="project-media-backdrop" src={project.image} alt="" aria-hidden="true" />
                <ProjectMedia project={project} />
              </div>
              <div className="project-body">
                <ProjectMeta meta={project.meta} />
                <h3>{project.title}</h3>
                <p>{project.text}</p>
                {project.note && <div className="project-note">{project.note}</div>}
                <div className="project-actions">
                  <ProjectAction project={project} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </>}
      <DailyPapers />
      {showProjects && <>
        <div className="card-title portfolio-progress-title">More to Come</div>
        <p className="portfolio-progress-text">My portfolio is still under construction—more stories are on the way.</p>
      </>}
    </section>
  );
}
