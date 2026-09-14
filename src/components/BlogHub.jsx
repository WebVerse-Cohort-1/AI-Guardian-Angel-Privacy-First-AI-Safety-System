import React, { useState } from 'react';
import { BookOpen, Search, Clock, Tag, User, ArrowLeft, Share2, Shield, Heart, Sparkles, CheckCircle } from 'lucide-react';

const MOCK_BLOGS = [
  {
    id: 'on-device-ai-privacy',
    title: 'Why On-Device AI is the Future of Personal Safety & Privacy',
    category: 'Privacy & AI',
    readTime: '4 min read',
    author: 'Dr. Ellen Vance',
    role: 'Chief AI Ethics Researcher',
    date: 'Sep 12, 2026',
    excerpt: 'Traditional cloud safety apps send your raw audio to external servers. Discover how zero-knowledge on-device neural models process acoustic signals locally without sacrificing privacy.',
    content: `
### The Cloud Privacy Paradox in Emergency Apps

Most legacy safety apps rely heavily on streaming continuous audio or video recordings to cloud servers. While this enables server-side machine learning analysis, it introduces significant privacy vulnerabilities:
1. **Third-Party Exposure**: Sensitive audio snippets can be accessed by contractors or cloud engineers during model training or auditing.
2. **Data Interception Risk**: Man-in-the-middle attacks or server breaches could leak unencrypted voice logs.
3. **Connectivity Dependency**: Cloud-only emergency triggers fail in dead zones, underground subways, or congested cellular towers.

---

### Enter On-Device Edge Neural Models

**AI Guardian Angel** operates on a zero-knowledge local inference architecture. Using lightweight, quantized WebAssembly and WebAudio neural networks, your smartphone processes sound waves directly inside your device sandbox:

- **Local Feature Extraction**: Audio spectrograms are converted into high-dimensional embeddings locally.
- **Zero Raw Storage**: Audio buffers are overwritten every 3 seconds in volatile memory and never saved to persistent storage.
- **Offline Reliability**: Threat detection and wakeword emergency signals work even when disconnected from cellular data or Wi-Fi.

> "True safety should never require surrendering your fundamental right to digital privacy."
`,
    tags: ['On-Device AI', 'Privacy', 'Edge Computing', 'Zero Knowledge']
  },
  {
    id: 'wakeword-detection-guide',
    title: '5 Critical Wakewords Every Personal Safety System Should Support',
    category: 'Safety Guides',
    readTime: '5 min read',
    author: 'Marcus Chen',
    role: 'Acoustic Signal Engineer',
    date: 'Sep 10, 2026',
    excerpt: 'In critical situations, pressing a panic button isn\'t always feasible. Learn how customizable acoustic wakewords like "Help Me" or "Guardian Alert" save lives hands-free.',
    content: `
### Hands-Free Emergency Activation

During an unexpected confrontation or physical threat, taking your phone out of your pocket or unlocking your screen takes between 4 to 8 seconds—time you may not have. Hands-free voice recognition bridges this crucial gap.

#### Top 5 Recommended Emergency Wakewords:

1. **"Help Me Now"** — A direct, high-energy acoustic phrase optimized for clear pitch detection even amidst background ambient noise.
2. **"Guardian Alert"** — A discreet custom phrase that activates silent monitoring mode without alerting nearby aggressors.
3. **"Code Red Emergency"** — Immediately triggers instant SOS SMS broadcasts with live GPS location pins to designated contacts.
4. **"Back Off"** — Detects aggressive voice stress and automatically initiates a high-decibel audible alarm deterrent.
5. **"Call Emergency Contacts"** — Hands-free contact dispatch protocol for rapid emergency assistance.

---

### Best Practices for Wakeword Configuration

- **Train in Varied Environments**: Ensure your custom phrases are configured with ambient noise (wind, traffic, crowded spaces).
- **Multi-Tone Detection**: Guardian Angel recognizes phonetic intent rather than exact voice pitch, ensuring activation even if your voice trembles under stress.
`,
    tags: ['Voice AI', 'Wakewords', 'Emergency Preparedness', 'Hands-Free']
  },
  {
    id: 'contextual-threat-monitoring',
    title: 'How Contextual Threat Detection Prevents False Alarms',
    category: 'AI Tech',
    readTime: '6 min read',
    author: 'Sarah Lin',
    role: 'Lead Data Scientist',
    date: 'Sep 08, 2026',
    excerpt: 'A sudden spike in heart rate during a workout shouldn\'t dispatch emergency responders. Explore how multi-sensor fusion correlates location, movement, and acoustic signals accurately.',
    content: `
### The Problem of False Alarms in Security

Single-sensor triggers—such as simple motion detection or basic sound meters—suffer from high false-positive rates. A dropped phone or a sudden scream during a horror movie could erroneously alert emergency contacts.

---

### Multi-Sensor Data Fusion Matrix

AI Guardian Angel evaluates a **Contextual Risk Score (0–100)** by fusing multiple sensor data channels in real time:

| Sensor Stream | Isolated Signal | Contextual Correlation | Risk Weight |
|---|---|---|---|
| **Acoustics** | High-decibel audio | Correlated with screaming frequencies + distress wakewords | +40 Risk |
| **Location** | Late-night transit | Unsafe/Unfamiliar route at 2:00 AM | +20 Risk |
| **Accelerometer** | Sudden velocity change | Rapid running or sudden impact after standstill | +30 Risk |
| **Time Window** | Night time | Nighttime isolation factor | +10 Risk |

> By combining these signals, the system achieves a 99.4% reduction in false positives while maintaining zero-delay emergency activation.
`,
    tags: ['Sensor Fusion', 'Machine Learning', 'Risk Matrix', 'Contextual AI']
  },
  {
    id: 'setting-up-safety-network',
    title: 'Building a Reliable Emergency Contact Safety Network',
    category: 'Safety Guides',
    readTime: '3 min read',
    author: 'Aria Rodriguez',
    role: 'Community Safety Advocate',
    date: 'Sep 05, 2026',
    excerpt: 'Your emergency network is your first line of defense. Here is how to select, prepare, and sync emergency contacts for instantaneous SMS and location broadcasts.',
    content: `
### Choosing Your Safety Circle

When setting up your emergency contacts inside AI Guardian Angel, aim for a balanced mix of speed, proximity, and reliability:

1. **Primary Immediate Contact**: A trusted friend or partner nearby who can respond physically or call local emergency services immediately.
2. **Family Guardian**: A family member who monitors long-distance trips or late-night commutes.
3. **Backup Responder**: An alternate contact in a different time zone or schedule to ensure 24/7 coverage.

---

### What Emergency Contacts Receive During an SOS Alert

When an emergency trigger reaches 70+ Risk Score or manual activation:
- **Instant SMS Broadcast**: Automated SMS message containing exact latitude/longitude coordinates.
- **Live Safety Route Map**: A secure link showing your real-time tracking map.
- **Battery & Audio Status**: Battery level and ambient risk report to give contacts vital context.
`,
    tags: ['Emergency Circle', 'SOS SMS', 'Safety Network', 'Community']
  }
];

const CATEGORIES = ['All', 'Privacy & AI', 'Safety Guides', 'AI Tech'];

const BlogHub = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBlog, setSelectedBlog] = useState(null);

  const filteredBlogs = MOCK_BLOGS.filter(blog => {
    const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          blog.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="anim-fade" style={{ padding: '0 4px' }}>
      
      {/* ── Article Reader View ── */}
      {selectedBlog ? (
        <article className="card anim-up" style={{ padding: '24px 20px' }}>
          <button 
            className="btn-ghost" 
            onClick={() => setSelectedBlog(null)}
            style={{ marginBottom: 20, padding: '8px 16px', fontSize: 13, gap: 6 }}
          >
            <ArrowLeft size={16} /> Back to Articles
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <span style={{ 
              fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
              color: 'var(--purple-light)', background: 'var(--purple-dim)', padding: '4px 12px',
              borderRadius: 999, border: '1px solid rgba(139,92,246,0.3)'
            }}>
              {selectedBlog.category}
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={13} /> {selectedBlog.readTime}
            </span>
          </div>

          <h1 style={{ 
            fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 900, 
            lineHeight: 1.25, color: 'var(--text-1)', marginBottom: 16 
          }}>
            {selectedBlog.title}
          </h1>

          {/* Author info bar */}
          <div style={{ 
            display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', 
            background: 'var(--bg-surface)', borderRadius: 'var(--r-md)', border: '1px solid var(--border)',
            marginBottom: 24 
          }}>
            <div style={{ 
              width: 40, height: 40, borderRadius: '50%', background: 'var(--violet-grad)',
              display: 'flex', alignItems: 'center', justifyCenter: 'center', color: 'white',
              fontWeight: 800, fontSize: 16 
            }}>
              {selectedBlog.author.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-1)' }}>{selectedBlog.author}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{selectedBlog.role} • {selectedBlog.date}</div>
            </div>
          </div>

          {/* Blog Body Content */}
          <div style={{ 
            fontSize: 14, lineHeight: 1.7, color: 'var(--text-2)', 
            display: 'flex', flexDirection: 'column', gap: 16 
          }}>
            {selectedBlog.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} style={{ 
                    fontFamily: 'Outfit, sans-serif', fontSize: 18, fontWeight: 800, 
                    color: 'var(--text-1)', marginTop: 12 
                  }}>
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('#### ')) {
                return (
                  <h4 key={idx} style={{ 
                    fontFamily: 'Outfit, sans-serif', fontSize: 15, fontWeight: 700, 
                    color: 'var(--purple-light)', marginTop: 8 
                  }}>
                    {paragraph.replace('#### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('> ')) {
                return (
                  <blockquote key={idx} style={{ 
                    padding: '14px 18px', background: 'var(--purple-dim)', 
                    borderLeft: '4px solid var(--purple)', borderRadius: 'var(--r-sm)',
                    fontStyle: 'italic', color: 'var(--text-1)', fontWeight: 500 
                  }}>
                    {paragraph.replace('> ', '')}
                  </blockquote>
                );
              }
              return <p key={idx}>{paragraph}</p>;
            })}
          </div>

          {/* Article Footer & Tags */}
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-3)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Topics Covered:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {selectedBlog.tags.map((tag, i) => (
                <span key={i} style={{ 
                  fontSize: 11, padding: '4px 12px', borderRadius: 999, 
                  background: 'var(--bg-surface)', border: '1px solid var(--border)', color: 'var(--text-2)' 
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      ) : (

        /* ── Blog Cards Feed ── */
        <>
          <div style={{ padding: '16px 20px 8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span className="icon-badge" style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--purple-dim)', color: 'var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookOpen size={18} />
              </span>
              <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 900, color: 'var(--text-1)' }}>
                Guardian Blog & Guides
              </h2>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginBottom: 16 }}>
              Latest research on on-device AI, safety protocols, and privacy ethics.
            </p>

            {/* Search Input */}
            <div style={{ position: 'relative', marginBottom: 16 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: 14, color: 'var(--text-3)' }} />
              <input 
                className="field-input" 
                placeholder="Search articles, wakewords, AI privacy..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ paddingLeft: 40 }}
              />
            </div>

            {/* Category Filters */}
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, scrollbarWidth: 'none' }}>
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{
                    padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                    whiteSpace: 'nowrap', cursor: 'pointer', border: '1px solid var(--border)',
                    background: selectedCategory === cat ? 'var(--violet-grad)' : 'var(--bg-surface)',
                    color: selectedCategory === cat ? 'white' : 'var(--text-2)',
                    boxShadow: selectedCategory === cat ? '0 4px 14px rgba(139,92,246,0.3)' : 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Blogs Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: '8px 4px 20px' }}>
            {filteredBlogs.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '32px 20px', color: 'var(--text-3)' }}>
                No articles found matching "{searchQuery}".
              </div>
            ) : (
              filteredBlogs.map((blog, idx) => (
                <article 
                  key={blog.id} 
                  className={`card anim-up-${(idx % 3) + 1}`}
                  onClick={() => setSelectedBlog(blog)}
                  style={{ cursor: 'pointer', transition: 'all 0.3s var(--ease-spring)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                    <span style={{ 
                      fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
                      color: 'var(--purple-light)', background: 'var(--purple-dim)', padding: '3px 10px',
                      borderRadius: 999, border: '1px solid rgba(139,92,246,0.3)'
                    }}>
                      {blog.category}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} /> {blog.readTime}
                    </span>
                  </div>

                  <h3 style={{ 
                    fontFamily: 'Outfit, sans-serif', fontSize: 16, fontWeight: 800, 
                    color: 'var(--text-1)', lineHeight: 1.35, marginBottom: 8 
                  }}>
                    {blog.title}
                  </h3>

                  <p style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 14 }}>
                    {blog.excerpt}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--border)' }}>
                    <span style={{ fontSize: 11, color: 'var(--text-2)', fontWeight: 600 }}>
                      By {blog.author}
                    </span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--purple-light)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      Read Article →
                    </span>
                  </div>
                </article>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BlogHub;
