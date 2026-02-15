const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function formatDate(isoDate) {
  if (!isoDate) {
    return 'In development'
  }

  const date = new Date(isoDate)
  if (Number.isNaN(date.getTime())) {
    return 'In development'
  }

  return dateFormatter.format(date)
}

function ProjectCard({ project, sourceLabel, lang }) {
  // Use localized description or fallback to direct property if not localized yet
  const description = typeof project.description === 'object' 
    ? project.description[lang] 
    : project.description

  return (
    <article className="relative flex flex-col gap-3 p-4 border border-brand-line rounded-[18px] bg-brand-surface shadow-[0_8px_22px_rgba(25,41,27,0.07)] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:border-brand-primary/50 hover:shadow-strong group h-full">
      {/* Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-primary transition-all group-hover:h-[4px]"></div>
      
      <header className="flex justify-between items-start gap-2">
        <span className="px-2 py-1 rounded-full border border-brand-primary/34 bg-brand-primary/12 text-brand-primary-strong text-[0.7rem] font-bold tracking-wide transition-colors duration-500">
          {sourceLabel}
        </span>
        <span className="px-2 py-1 rounded-full border border-brand-line bg-brand-surface-muted text-brand-ink-soft text-[0.7rem] font-bold tracking-wide transition-colors duration-500">
          {project.role}
        </span>
      </header>

      <h3 className="text-lg font-outfit font-bold transition-colors duration-500 text-brand-ink">{project.title}</h3>
      <p className="m-0 text-brand-ink-soft text-[0.92rem] leading-relaxed line-clamp-3 transition-colors duration-500">
        {description}
      </p>

      <div className="flex flex-wrap gap-1.5">
        <span className="px-2 py-1 border border-brand-line rounded-lg bg-brand-surface-muted text-brand-ink-soft text-[0.73rem] transition-colors duration-500">
          {project.language || 'Multi Stack'}
        </span>
        <span className="px-2 py-1 border border-brand-line rounded-lg bg-brand-surface-muted text-brand-ink-soft text-[0.73rem] transition-colors duration-500">
          Updated {formatDate(project.updatedAt)}
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span className="px-2 py-0.5 border border-brand-primary/35 rounded-full bg-brand-primary/11 text-brand-primary-strong text-[0.72rem] font-semibold transition-colors duration-500" key={`${project.id}-${tag}`}>
            {tag}
          </span>
        ))}
      </div>

      {project.source === 'github' && (
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2 py-1 border border-brand-line rounded-lg bg-brand-surface-muted text-brand-ink-soft text-[0.73rem] transition-colors duration-500">
            Stars {project.stars ?? 0}
          </span>
          <span className="px-2 py-1 border border-brand-line rounded-lg bg-brand-surface-muted text-brand-ink-soft text-[0.73rem] transition-colors duration-500">
            Forks {project.forks ?? 0}
          </span>
        </div>
      )}

      <div className="mt-auto flex gap-2 pt-2">
        {project.repoUrl && (
          <a 
            href={project.repoUrl} 
            target="_blank" 
            rel="noreferrer"
            className="flex-1 text-center py-2 rounded-lg border border-brand-line-strong text-[0.83rem] font-bold bg-brand-surface text-brand-ink hover:border-brand-primary hover:-translate-y-0.5 transition-all duration-300"
          >
            GitHub
          </a>
        )}

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noreferrer"
            className="flex-1 text-center py-2 rounded-lg bg-brand-primary text-[#f8fbf7] text-[0.83rem] font-bold border border-brand-primary hover:bg-brand-primary-strong hover:-translate-y-0.5 transition-all duration-300 shadow-md"
          >
            Visit
          </a>
        )}
      </div>
    </article>
  )
}

export default ProjectCard
