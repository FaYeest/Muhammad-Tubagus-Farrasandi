export const PROFILE = {
  name: 'Muhammad Tubagus Farrasandi',
  handle: 'FaYeest',
  role: {
    id: 'Web Developer & Full-Stack Engineer',
    en: 'Web Developer & Full-Stack Engineer'
  },
  intro: {
    id: 'Aku membangun produk web yang clean, cepat, dan terstruktur. Fokusku ada di backend integration, automation flow, dan pengalaman user yang tetap terasa human.',
    en: 'I build clean, fast, and structured web products. My focus is on backend integration, automation flows, and user experiences that feel human.'
  },
  about: {
    id: 'Halo! Saya Muhammad Tubagus Farrasandi, seorang mahasiswa Computer Science/IT yang berfokus pada pengembangan solusi web yang aman dan efisien. Perjalanan saya di dunia teknologi dimulai dari ketertarikan pada automasi dan terus berkembang hingga ke ranah full-stack engineering serta keamanan siber. Saya percaya bahwa setiap baris kode harus memiliki sinergi antara fungsionalitas yang kuat dan keamanan yang terjaga.',
    en: 'Hello! I am Muhammad Tubagus Farrasandi, a Computer Science student dedicated to building secure and efficient web solutions. My journey in technology began with a passion for automation and has evolved into full-stack engineering and cybersecurity. I believe every line of code should achieve a synergy between robust functionality and uncompromising security.'
  },
  links: {
    github: 'https://github.com/FaYeest',
    email: 'mailto:mtbfarrasandi@gmail.com',
    linkedin: 'https://www.linkedin.com/in/muhammad-tubagus-farrasandi',
    instagram: 'https://www.instagram.com/guudd_',
  },
}

export const FEATURED_PROJECTS = [
  {
    id: 'ninym-assistant',
    title: 'Ninym Assistant',
    source: 'github',
    repoPath: 'FaYeest/ninym-assistant',
    repoUrl: 'https://github.com/FaYeest/ninym-assistant',
    liveUrl: null,
    role: 'AI / Python Engineer',
    description: {
      id: 'Hybrid AI assistant dengan local/cloud model switching, RAG memory, dan persona engine untuk percakapan yang adaptif.',
      en: 'Hybrid AI assistant with local/cloud model switching, RAG memory, and persona engine for adaptive conversations.'
    },
    language: 'Python',
    stars: 0,
    forks: 0,
    updatedAt: null,
    tags: ['Python', 'Ollama', 'Groq', 'RAG'],
  },
  {
    id: 'ninym-discord-anime-bot',
    title: 'Ninym Discord Anime Bot',
    source: 'github',
    repoPath: 'FaYeest/ninym-discord-anime-bot',
    repoUrl: 'https://github.com/FaYeest/ninym-discord-anime-bot',
    liveUrl: null,
    role: 'Automation Engineer',
    description: {
      id: 'Discord bot untuk jadwal anime, auto-search torrent, dan streaming control berbasis qBittorrent serta Peerflix.',
      en: 'Discord bot for anime schedules, auto-search torrents, and streaming control based on qBittorrent and Peerflix.'
    },
    language: 'Python',
    stars: 0,
    forks: 0,
    updatedAt: null,
    tags: ['Python', 'Discord Bot', 'Automation', 'Streaming'],
  },
  {
    id: 'arphatra',
    title: 'Arphatra',
    source: 'product',
    repoPath: null,
    repoUrl: null,
    liveUrl: 'https://arphatra.web.app/',
    role: 'Full-Stack Engineer',
    description: {
      id: 'Built and maintained web product end-to-end, mulai dari frontend architecture, backend integration, sampai deployment flow.',
      en: 'Built and maintained web product end-to-end, from frontend architecture and backend integration to deployment flow.'
    },
    language: 'Full Stack',
    stars: null,
    forks: null,
    updatedAt: null,
    tags: ['React', 'Firebase', 'Product Engineering'],
  },
]

export const PROJECT_RELATIONS = [
  {
    source: 'ninym-assistant',
    target: 'ninym-discord-anime-bot',
    strength: 3,
    reason: {
      id: 'Keduanya berbasis Python dan berada dalam satu ecosystem automation + AI tooling.',
      en: 'Both are Python-based and reside within the same automation + AI tooling ecosystem.'
    }
  },
  {
    source: 'ninym-assistant',
    target: 'arphatra',
    strength: 2,
    reason: {
      id: 'Relasi kuat di backend thinking, integrasi service, dan product mindset engineering.',
      en: 'Strong relationship in backend thinking, service integration, and product mindset engineering.'
    }
  },
  {
    source: 'ninym-discord-anime-bot',
    target: 'arphatra',
    strength: 2,
    reason: {
      id: 'Sama-sama menonjolkan flow automation, orchestration, dan delivery yang usable.',
      en: 'Both highlight automation flows, orchestration, and usable delivery.'
    }
  },
]

export const TRANSLATIONS = {
  id: {
    navProjects: 'Proyek',
    navServices: 'Layanan',
    navGraph: 'Grafik',
    navAbout: 'Tentang',
    heroTitle: 'Membangun Solusi Web yang Aman dan Terotomasi',
    heroSelected: 'Proyek pilihan',
    heroRepos: 'Repositori GitHub',
    heroFullstack: 'Produk Full-stack',
    currentFocus: 'Fokus Saat Ini',
    servicesKicker: 'Apa yang Saya Tawarkan',
    servicesTitle: 'Layanan & Keahlian',
    serviceWebTitle: 'Web Development',
    serviceWebDesc: 'Membangun website responsif dengan performa tinggi menggunakan React dan ekosistem modern.',
    serviceAutoTitle: 'Automation Flow',
    serviceAutoDesc: 'Otomasi tugas repetitif menggunakan Python untuk efisiensi workflow yang lebih maksimal.',
    serviceProductTitle: 'Product Engineering',
    serviceProductDesc: 'Menangani siklus hidup produk dari ide, arsitektur frontend, hingga integrasi backend.',
    serviceCyberTitle: 'Cybersecurity',
    serviceCyberDesc: 'Penetration testing dan audit keamanan untuk memastikan aplikasi web aman dari kerentanan.',
    serviceServerTitle: 'Server & Linux',
    serviceServerDesc: 'Konfigurasi, pengelolaan server, dan optimasi sistem berbasis Linux untuk deployment yang stabil.',
    projectsKicker: 'Proyek Unggulan',
    projectsTitle: 'Eksplorasi Proyek Pilihan',
    graphKicker: 'Jaringan Proyek',
    graphTitle: 'Visualisasi Ekosistem Proyek',
    graphCopy: 'Klik node untuk buka project. Hover node untuk fokus ke koneksi paling relevan.',
    aboutKicker: 'Tentang Saya',
    ctaTitle: 'Punya ide project menarik?',
    ctaCopy: 'Ayo diskusikan bagaimana aku bisa membantumu mewujudkannya dengan solusi engineering yang tepat.',
    ctaBtn: 'Mulai Kolaborasi',
    syncIdle: 'Menunggu sinkronisasi data.',
    syncLoading: 'Syncing data dari GitHub...',
    syncReady: 'Data GitHub berhasil diperbarui.',
    syncPartial: 'Sebagian data berhasil disinkronkan.',
    syncError: 'Sync gagal. Menampilkan data fallback.'
  },
  en: {
    navProjects: 'Projects',
    navServices: 'Services',
    navGraph: 'Graph',
    navAbout: 'About',
    heroTitle: 'Building Secure and Automated Web Solutions',
    heroSelected: 'Selected projects',
    heroRepos: 'GitHub repositories',
    heroFullstack: 'Full-stack product',
    currentFocus: 'Current Focus',
    servicesKicker: 'What I Offer',
    servicesTitle: 'Services & Expertise',
    serviceWebTitle: 'Web Development',
    serviceWebDesc: 'Building responsive, high-performance websites using React and modern ecosystems.',
    serviceAutoTitle: 'Automation Flow',
    serviceAutoDesc: 'Automating repetitive tasks using Python for maximum workflow efficiency.',
    serviceProductTitle: 'Product Engineering',
    serviceProductDesc: 'Managing product lifecycles from ideation and frontend architecture to backend integration.',
    serviceCyberTitle: 'Cybersecurity',
    serviceCyberDesc: 'Penetration testing and security audits to ensure web applications are safe from vulnerabilities.',
    serviceServerTitle: 'Server & Linux',
    serviceServerDesc: 'Configuration, server management, and optimization of Linux-based systems for stable deployments.',
    projectsKicker: 'Featured Projects',
    projectsTitle: 'Exploring Featured Projects',
    graphKicker: 'Project Network',
    graphTitle: 'Project Ecosystem Visualization',
    graphCopy: 'Click node to open project. Hover node to focus on the most relevant connections.',
    aboutKicker: 'About Me',
    ctaTitle: 'Have an interesting project idea?',
    ctaCopy: 'Let\'s discuss how I can help you realize it with the right engineering solutions.',
    ctaBtn: 'Start Collaboration',
    syncIdle: 'Waiting for data synchronization.',
    syncLoading: 'Syncing data from GitHub...',
    syncReady: 'GitHub data successfully updated.',
    syncPartial: 'Partial data synchronized.',
    syncError: 'Sync failed. Showing fallback data.'
  }
}
