import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from './components/ProjectCard'
import ProjectGraph from './components/ProjectGraph'
import ParticleBackground from './components/ParticleBackground'
import { FEATURED_PROJECTS, PROFILE, PROJECT_RELATIONS, TRANSLATIONS } from './data/projects'

const SOURCE_LABEL = {
  github: 'GitHub',
  product: 'Product',
}

async function fetchRepoDetails(repoPath) {
  const response = await fetch(`https://api.github.com/repos/${repoPath}`, {
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`)
  }

  return response.json()
}

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 100, damping: 15, duration: 0.5 }
  }
}

const headerVariants = {
  hidden: { y: -50, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

function App() {
  const [lang, setLang] = useState('id')
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })
  const [projects, setProjects] = useState(FEATURED_PROJECTS)
  const [syncStatus, setSyncStatus] = useState('idle')

  const t = TRANSLATIONS[lang]

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDark])

  useEffect(() => {
    let active = true
    const githubProjects = FEATURED_PROJECTS.filter(
      (project) => project.source === 'github',
    )

    if (!githubProjects.length) {
      return undefined
    }

    async function syncProjects() {
      setSyncStatus('loading')

      const results = await Promise.allSettled(
        githubProjects.map((project) => fetchRepoDetails(project.repoPath)),
      )

      if (!active) {
        return
      }

      const updates = {}
      let successCount = 0

      results.forEach((result, index) => {
        if (result.status !== 'fulfilled') {
          return
        }

        successCount += 1
        const fallback = githubProjects[index]
        const repo = result.value

        updates[fallback.id] = {
          description: {
            id: repo.description || fallback.description.id,
            en: repo.description || fallback.description.en
          },
          language: repo.language || fallback.language,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updatedAt: repo.updated_at,
          repoUrl: repo.html_url || fallback.repoUrl,
          liveUrl:
            fallback.liveUrl ||
            (repo.homepage && repo.homepage.trim() ? repo.homepage : null),
        }
      })

      setProjects((currentProjects) =>
        currentProjects.map((project) => {
          const update = updates[project.id]
          return update ? { ...project, ...update } : project
        }),
      )

      if (successCount === githubProjects.length) {
        setSyncStatus('ready')
        return
      }

      if (successCount > 0) {
        setSyncStatus('partial')
        return
      }

      setSyncStatus('error')
    }

    syncProjects()

    return () => {
      active = false
    }
  }, [])

  const relationCopy = useMemo(() => {
    const lookup = new Map(projects.map((project) => [project.id, project.title]))

    return PROJECT_RELATIONS.map((relation) => ({
      key: `${relation.source}-${relation.target}`,
      title: `${lookup.get(relation.source)} to ${lookup.get(relation.target)}`,
      reason: relation.reason[lang],
    }))
  }, [projects, lang])

  const syncMessage = {
    idle: t.syncIdle,
    loading: t.syncLoading,
    ready: t.syncReady,
    partial: t.syncPartial,
    error: t.syncError,
  }[syncStatus]

  const toggleLang = () => {
    setLang(prev => prev === 'id' ? 'en' : 'id')
  }

  return (
    <div className="relative min-h-screen py-4 md:py-11 px-4 sm:px-6 overflow-x-hidden transition-colors duration-500" id="home">
      <ParticleBackground />
      {/* Decorative Elements */}
      <motion.div 
        initial={{ opacity: 0, rotate: -20 }}
        animate={{ opacity: 1, rotate: -14 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="hidden lg:block absolute pointer-events-none -z-10 w-56 h-56 -top-10 -right-18 border border-brand-line bg-brand-surface/30 rounded-[28px] transition-colors duration-500"
      />
      <motion.div 
        initial={{ opacity: 0, rotate: 25 }}
        animate={{ opacity: 1, rotate: 18 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        className="hidden lg:block absolute pointer-events-none -z-10 w-52 h-52 left-[-76px] top-[430px] border border-brand-line bg-brand-surface/30 rounded-[24px] transition-colors duration-500"
      />

      <motion.header 
        variants={headerVariants}
        initial="hidden"
        animate="visible"
        className="sticky top-3 z-50 flex items-center justify-between gap-3 px-3 py-2.5 mx-auto max-w-[1140px] w-full border border-brand-line rounded-2xl bg-brand-surface/90 shadow-soft backdrop-blur-md transition-colors duration-500"
      >
        <a href="#home" className="flex items-center gap-2.5 font-bold group shrink-0">
          <motion.img 
            whileHover={{ scale: 1.1, rotate: 5 }}
            src="./hoshi.png"
            alt="Logo"
            className="w-8 h-8 rounded-xl object-cover"
          />
          <span className="hidden sm:inline text-[0.95rem] tracking-wider transition-colors group-hover:text-brand-primary-strong">FaYeest</span>
        </a>

        <nav className="hidden md:flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          <a href="#projects" className="px-3 py-2 rounded-lg text-brand-ink-soft text-[0.9rem] font-semibold hover:bg-brand-surface-muted hover:text-brand-primary-strong transition-colors duration-300 whitespace-nowrap">{t.navProjects}</a>
          <a href="#services" className="px-3 py-2 rounded-lg text-brand-ink-soft text-[0.9rem] font-semibold hover:bg-brand-surface-muted hover:text-brand-primary-strong transition-colors duration-300 whitespace-nowrap">{t.navServices}</a>
          <a href="#graph" className="px-3 py-2 rounded-lg text-brand-ink-soft text-[0.9rem] font-semibold hover:bg-brand-surface-muted hover:text-brand-primary-strong transition-colors duration-300 whitespace-nowrap">{t.navGraph}</a>
          <a href="#about" className="px-3 py-2 rounded-lg text-brand-ink-soft text-[0.9rem] font-semibold hover:bg-brand-surface-muted hover:text-brand-primary-strong transition-colors duration-300 whitespace-nowrap">{t.navAbout}</a>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <motion.button 
            whileTap={{ scale: 0.9, rotate: 15 }}
            onClick={() => setIsDark(!isDark)}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-brand-line text-brand-primary-strong hover:bg-brand-primary/10 transition-all cursor-pointer overflow-hidden relative"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={isDark ? 'dark' : 'light'}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.button>

          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={toggleLang}
            className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-xl border border-brand-line text-[0.75rem] sm:text-[0.8rem] font-bold text-brand-primary-strong hover:bg-brand-primary/10 transition-all cursor-pointer"
          >
            {lang.toUpperCase()}
          </motion.button>
          <motion.a
            whileHover={{ y: -2 }}
            className="flex items-center justify-center px-2.5 sm:px-3.5 py-2 rounded-xl border border-brand-line-strong text-brand-primary-strong text-[0.75rem] sm:text-[0.87rem] font-bold hover:border-brand-primary hover:bg-brand-primary/10 transition-all"
            href={PROFILE.links.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </motion.a>
        </div>
      </motion.header>

      <main className="mx-auto max-w-[1140px] w-full mt-4 grid gap-4 sm:gap-6">
        {/* Hero Section */}
        <motion.section 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-4 lg:grid-cols-[1.5fr_0.9fr]"
        >
          <motion.div 
            variants={itemVariants}
            className="p-5 sm:p-6 md:p-9 border border-brand-line rounded-[22px] bg-brand-surface shadow-soft transition-colors duration-500"
          >
            <motion.h1 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="max-w-full lg:max-w-[22ch] text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight sm:leading-[1.1] transition-colors duration-500"
            >
              {t.heroTitle}
            </motion.h1>
            <motion.p 
              variants={itemVariants}
              className="mt-4 max-w-[62ch] text-brand-ink-soft leading-relaxed text-base sm:text-lg transition-colors duration-500"
            >
              {PROFILE.intro[lang]}
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="mt-6 sm:mt-8 flex flex-wrap gap-2.5"
            >
              <a
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-3 text-[0.9rem] font-bold bg-brand-primary text-[#f8fbf7] shadow-[0_9px_20px_rgba(66,102,71,0.25)] hover:bg-brand-primary-strong hover:-translate-y-0.5 transition-all"
                href={PROFILE.links.github}
                target="_blank"
                rel="noreferrer"
              >
                Explore GitHub
              </a>
              <a 
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-3 text-[0.9rem] font-bold border border-brand-line-strong bg-brand-surface text-brand-ink hover:border-brand-primary hover:-translate-y-0.5 transition-all" 
                href="#projects"
              >
                {t.navProjects}
              </a>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              <article className="p-4 border border-brand-line rounded-2xl bg-brand-surface transition-colors duration-500 shadow-sm">
                <strong className="block font-outfit text-2xl sm:text-3xl text-brand-primary-strong">3</strong>
                <span className="text-brand-ink-soft text-[0.82rem]">{t.heroSelected}</span>
              </article>
              <article className="p-4 border border-brand-line rounded-2xl bg-brand-surface transition-colors duration-500 shadow-sm">
                <strong className="block font-outfit text-2xl sm:text-3xl text-brand-primary-strong">2</strong>
                <span className="text-brand-ink-soft text-[0.82rem]">{t.heroRepos}</span>
              </article>
              <article className="p-4 border border-brand-line rounded-2xl bg-brand-surface transition-colors duration-500 shadow-sm">
                <strong className="block font-outfit text-2xl sm:text-3xl text-brand-primary-strong">1</strong>
                <span className="text-brand-ink-soft text-[0.82rem]">{t.heroFullstack}</span>
              </article>
            </motion.div>
          </motion.div>

          <motion.aside 
            variants={itemVariants}
            className="p-5 sm:p-6 border border-brand-line rounded-[22px] bg-brand-surface-muted shadow-soft flex flex-col justify-between transition-colors duration-500"
          >
            <div>
              <p className="m-0 font-outfit text-[1.12rem] font-semibold transition-colors duration-500">{t.currentFocus}</p>
              <ul className="mt-4 pl-4 list-disc text-brand-ink-soft leading-relaxed text-[0.95rem] space-y-2 transition-colors duration-500">
                <li>Automation workflows in Python</li>
                <li>Product-first full-stack delivery</li>
                <li>Interactive UI for portfolio experience</li>
              </ul>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="px-3 py-1.5 border border-brand-primary/30 bg-brand-primary/10 rounded-full text-brand-primary-strong text-[0.75rem] font-bold transition-colors duration-500">Python</span>
              <span className="px-3 py-1.5 border border-brand-primary/30 bg-brand-primary/10 rounded-full text-brand-primary-strong text-[0.75rem] font-bold transition-colors duration-500">React</span>
              <span className="px-3 py-1.5 border border-brand-primary/30 bg-brand-primary/10 rounded-full text-brand-primary-strong text-[0.75rem] font-bold transition-colors duration-500">Firebase</span>
              <span className="px-3 py-1.5 border border-brand-primary/30 bg-brand-primary/10 rounded-full text-brand-primary-strong text-[0.75rem] font-bold transition-colors duration-500">API Integration</span>
            </div>
          </motion.aside>
        </motion.section>

        {/* Services Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="p-5 sm:p-8 border border-brand-line rounded-[22px] bg-brand-surface shadow-soft transition-colors duration-500" id="services"
        >
          <div className="text-center mb-10">
            <p className="m-0 text-[0.75rem] uppercase tracking-widest text-brand-ink-soft font-bold transition-colors duration-500">{t.servicesKicker}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl mt-2 transition-colors duration-500">{t.servicesTitle}</h2>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
          >
            {[
              { title: t.serviceWebTitle, desc: t.serviceWebDesc, icon: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" },
              { title: t.serviceAutoTitle, desc: t.serviceAutoDesc, icon: "M13 10V3L4 14h7v7l9-11h-7z" },
              { title: t.serviceProductTitle, desc: t.serviceProductDesc, icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" },
              { title: t.serviceCyberTitle, desc: t.serviceCyberDesc, icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
              { title: t.serviceServerTitle, desc: t.serviceServerDesc, icon: "M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" }
            ].map((service, idx) => (
              <motion.article 
                key={idx}
                variants={itemVariants}
                className="p-6 border border-brand-line rounded-2xl bg-brand-surface-muted hover:bg-brand-surface transition-colors duration-500 group cursor-default shadow-sm hover:shadow-md"
              >
                <div className="w-12 h-12 mb-5 rounded-xl bg-brand-primary/20 flex items-center justify-center text-brand-primary-strong transition-colors group-hover:bg-brand-primary group-hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={service.icon} />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 transition-colors group-hover:text-brand-primary-strong">{service.title}</h3>
                <p className="text-brand-ink-soft text-[0.95rem] leading-relaxed transition-colors duration-500">{service.desc}</p>
              </motion.article>
            ))}
          </motion.div>
        </motion.section>

        {/* Projects Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="p-5 sm:p-6 md:p-8 border border-brand-line rounded-[22px] bg-brand-surface shadow-soft transition-colors duration-500" id="projects"
        >
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <p className="m-0 text-[0.75rem] uppercase tracking-widest text-brand-ink-soft font-bold transition-colors duration-500">{t.projectsKicker}</p>
              <h2 className="text-2xl sm:text-3xl md:text-4xl transition-colors duration-500">{t.projectsTitle}</h2>
            </div>

            <p className={`self-start md:self-auto m-0 rounded-full border px-4 py-2 text-[0.8rem] font-semibold bg-brand-surface transition-colors duration-500 ${
              syncStatus === 'loading' ? 'text-brand-primary-strong border-brand-primary/45' : 
              syncStatus === 'error' ? 'text-red-700 border-red-300' : 'text-brand-ink-soft border-brand-line'
            }`}>
              {syncMessage}
            </p>
          </header>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.1 }}
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {projects.map((project) => (
              <motion.div key={project.id} variants={itemVariants} className="h-full">
                <ProjectCard
                  project={project}
                  lang={lang}
                  sourceLabel={SOURCE_LABEL[project.source]}
                />
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        {/* Graph Section */}
        <motion.section 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="p-5 sm:p-6 md:p-8 border border-brand-line rounded-[22px] bg-brand-surface shadow-soft transition-colors duration-500" id="graph"
        >
          <header className="mb-6">
            <p className="m-0 text-[0.75rem] uppercase tracking-widest text-brand-ink-soft font-bold transition-colors duration-500">{t.graphKicker}</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl transition-colors duration-500">{t.graphTitle}</h2>
            <p className="mt-2 max-w-[70ch] text-brand-ink-soft leading-relaxed text-base sm:text-lg transition-colors duration-500">
              {t.graphCopy}
            </p>
          </header>

          <ProjectGraph projects={projects} relations={PROJECT_RELATIONS} isDark={isDark} />

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relationCopy.map((relation, idx) => (
              <motion.article 
                key={relation.key}
                variants={itemVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false, amount: 0.1 }}
                className="p-4 border border-brand-line rounded-xl bg-brand-surface text-brand-ink-soft leading-relaxed text-[0.9rem] transition-colors duration-500 shadow-sm"
              >
                <span className="block mb-2 text-brand-ink font-outfit text-[1rem] font-semibold transition-colors duration-500">{relation.title}</span>
                {relation.reason}
              </motion.article>
            ))}
          </div>
        </motion.section>

        {/* CTA / About Section */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid gap-4 md:gap-6 lg:grid-cols-2" id="about"
        >
          <div className="p-6 sm:p-8 md:p-10 border border-brand-line rounded-[22px] bg-brand-surface shadow-soft flex flex-col justify-center transition-colors duration-500">
             <p className="m-0 text-[0.75rem] uppercase tracking-widest text-brand-ink-soft font-bold transition-colors duration-500">{t.aboutKicker}</p>
             <h2 className="text-2xl sm:text-3xl md:text-4xl mt-2 transition-colors duration-500">{PROFILE.name}</h2>
             <p className="mt-4 text-brand-ink-soft leading-relaxed text-base sm:text-lg transition-colors duration-500">{PROFILE.about[lang]}</p>
             
             <div className="mt-8 flex flex-wrap gap-3">
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={PROFILE.links.email} 
                  className="flex-1 sm:flex-none text-center px-6 py-3 border border-brand-line rounded-xl text-[0.9rem] font-semibold text-brand-ink-soft bg-brand-surface hover:border-brand-primary hover:text-brand-primary-strong transition-all duration-300 shadow-sm"
                >
                  Hubungi via Email
                </motion.a>
                <motion.a 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={PROFILE.links.github} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 sm:flex-none text-center px-6 py-3 border border-brand-line rounded-xl text-[0.9rem] font-semibold text-brand-ink-soft bg-brand-surface hover:border-brand-primary hover:text-brand-primary-strong transition-all duration-300 shadow-sm"
                >
                  Ikuti di GitHub
                </motion.a>
             </div>
          </div>

          <motion.div 
            whileHover={{ y: -5 }}
            className="p-8 sm:p-10 border border-brand-line rounded-[22px] bg-brand-primary shadow-soft text-[#f8fbf7] flex flex-col justify-center items-center text-center group transition-colors duration-500"
          >
             <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">{t.ctaTitle}</h2>
             <p className="opacity-90 max-w-[40ch] mb-8 text-base sm:text-lg">{t.ctaCopy}</p>
             <motion.a 
               whileHover={{ scale: 1.1 }}
               whileTap={{ scale: 0.9 }}
               href={PROFILE.links.linkedin} 
               target="_blank" 
               rel="noreferrer" 
               className="w-full sm:w-auto px-10 py-4 bg-[#f8fcf6] text-[#4f7654] rounded-xl font-bold transition-transform duration-300 shadow-lg"
             >
               {t.ctaBtn}
             </motion.a>
          </motion.div>
        </motion.section>

        <footer className="py-12 text-center text-brand-ink-soft text-[0.86rem] transition-colors duration-500">
          <div className="flex justify-center gap-6 mb-6">
            <a href={PROFILE.links.linkedin} target="_blank" rel="noreferrer" className="hover:text-brand-primary-strong transition-colors">LinkedIn</a>
            <a href={PROFILE.links.instagram} target="_blank" rel="noreferrer" className="hover:text-brand-primary-strong transition-colors">Instagram</a>
            <a href={PROFILE.links.github} target="_blank" rel="noreferrer" className="hover:text-brand-primary-strong transition-colors">GitHub</a>
          </div>
          <p className="text-[0.9rem]">
            &copy; 2026 {PROFILE.handle}.
          </p>
          <p className="mt-2 opacity-60 transition-colors duration-500 text-sm">Muhammad Tubagus Farrasandi</p>
        </footer>
      </main>
    </div>
  )
}

export default App
