export const TRENDING = [
  { rank: 1, title: "Neon Hearts", year: 2025, genre: "Sci-Fi Romance", score: 0.92, runtime: "2h 14m", color: "#FF3D7F", color2: "#FFD23F" },
  { rank: 2, title: "Last Train West", year: 2024, genre: "Western Drama", score: 0.88, runtime: "2h 31m", color: "#C1272D", color2: "#FFB347" },
  { rank: 3, title: "The Quiet Room", year: 2025, genre: "Psychological", score: 0.85, runtime: "1h 47m", color: "#2A1A3E", color2: "#7A5BA8" },
  { rank: 4, title: "Sugar Crash", year: 2025, genre: "Dark Comedy", score: 0.79, runtime: "1h 58m", color: "#FF6B9D", color2: "#FFE66D" },
  { rank: 5, title: "Midnight Diner", year: 2024, genre: "Drama", score: 0.91, runtime: "2h 02m", color: "#1A3A5C", color2: "#F4A460" },
  { rank: 6, title: "Paper Tigers", year: 2025, genre: "Action", score: 0.83, runtime: "1h 52m", color: "#E63946", color2: "#F1FAEE" },
  { rank: 7, title: "Saltwater", year: 2024, genre: "Coming-of-age", score: 0.76, runtime: "1h 41m", color: "#457B9D", color2: "#A8DADC" },
  { rank: 8, title: "Kid From Mars", year: 2025, genre: "Family", score: 0.81, runtime: "1h 38m", color: "#9B5DE5", color2: "#F15BB5" },
];

export const FILMSTRIP = [
  { num: "001", title: "The Velvet Hour", meta: "DIR. CHEN · 2025" },
  { num: "002", title: "Bone Deep", meta: "DIR. OKONKWO · 2024" },
  { num: "003", title: "Apricot Sky", meta: "DIR. RIVERA · 2025" },
  { num: "004", title: "Ghost Frequencies", meta: "DIR. PARK · 2024" },
  { num: "005", title: "The Long Goodbye", meta: "DIR. HARTLEY · 2025" },
  { num: "006", title: "Lemon Daughter", meta: "DIR. AMARA · 2025" },
  { num: "007", title: "Dust & Daylight", meta: "DIR. WHITTAKER · 2024" },
  { num: "008", title: "Bluebird Hotel", meta: "DIR. NOVAK · 2025" },
];

export const MOCK_DETAIL = {
  title: "Neon Hearts",
  year: "2025",
  rating: "PG-13",
  runtime: "2h 14m",
  director: "Mira Tanaka",
  genres: ["Sci-Fi", "Romance", "Drama"],
  score: 0.92,
  synopsis:
    "In 2087, two memory cartographers fall in love while reconstructing a stranger's final hours. As the line between her recollections and theirs begins to blur, they must decide whose story is worth saving — and whose is worth losing forever.",
  cast: [
    { name: "Lena Park", role: "Iris", initials: "LP" },
    { name: "Theo Marsh", role: "August", initials: "TM" },
    { name: "Nia Okafor", role: "Dr. Vey", initials: "NO" },
    { name: "Bo Yeung", role: "Hux", initials: "BY" },
    { name: "Ana Ríos", role: "The Stranger", initials: "AR" },
    { name: "Sam Holt", role: "Detective", initials: "SH" },
  ],
  breakdown: [
    { name: "Acting", icon: "🎭", score: 9.4, note: "Park's quietly devastating turn anchors a film that lives or dies by its leads.", pct: 94 },
    { name: "Story", icon: "📖", score: 8.8, note: "Tanaka's screenplay folds in on itself with the precision of origami — and the patience of a long letter.", pct: 88 },
    { name: "Visuals", icon: "🎨", score: 9.7, note: "Cinematographer K. Lin paints in soft neons. Every frame feels like a memory you're trying to hold.", pct: 97 },
    { name: "Sound", icon: "🎵", score: 9.1, note: "A hushed, synth-laced score from Yuki Mori does most of the emotional heavy lifting.", pct: 91 },
  ],
};

export const MOCK_COMMENTS = [
  { name: "Margot R.", handle: "@margot_reels", initials: "MR", color: "#FF3D7F", stars: 5, text: "I haven't cried at a movie since 2019. Now I have. Park gives the performance of the year, no contest.", time: "2 days ago", likes: 247, replies: 38 },
  { name: "Devon Ash", handle: "@devon_a", initials: "DA", color: "#FFD23F", stars: 4, text: "Gorgeous to look at, slow to start. Stick with it — the second half is a knockout. The diner scene alone is worth the ticket.", time: "5 days ago", likes: 182, replies: 22 },
  { name: "Priya K.", handle: "@cinekitchen", initials: "PK", color: "#9B5DE5", stars: 5, text: "Tanaka has made the romantic sci-fi I've been waiting a decade for. Tender, strange, and deeply sad in the best way.", time: "1 week ago", likes: 421, replies: 67 },
  { name: "Jonas W.", handle: "@latenight_jonas", initials: "JW", color: "#06D6A0", stars: 4, text: "Wanted to dislike it. Couldn't. The third act subverts every sci-fi trope I expected. Surprised me twice.", time: "1 week ago", likes: 156, replies: 19 },
  { name: "Cleo Mensah", handle: "@cleo_films", initials: "CM", color: "#118AB2", stars: 5, text: "I've seen it three times. Each viewing reveals new layers. The detail in the production design is unreal.", time: "2 weeks ago", likes: 312, replies: 44 },
  { name: "Alex T.", handle: "@alextoo", initials: "AT", color: "#EF476F", stars: 4, text: "A film about memory, made of memory. Felt like watching someone else's dream and recognizing pieces of my own.", time: "2 weeks ago", likes: 198, replies: 28 },
];

export const MOCK_EMOTIONS = {
  excitement: 78,
  nostalgia: 52,
  confusion: 18,
  fear: 24,
  sadness: 35,
  inspiration: 65,
  satisfaction: 71,
};

export const MOCK_CHARACTERS = [
  { name: "Arthur Fleck", sentiment: "positive" as const, mentions: 12 },
  { name: "Commissioner Gordon", sentiment: "mixed" as const, mentions: 5 },
  { name: "Alfred", sentiment: "positive" as const, mentions: 4 },
  { name: "Harvey Dent", sentiment: "negative" as const, mentions: 3 },
];

export const MOCK_CLUSTERS = [
  { label: "Phenomenal acting", percentage: 42, representative: "The lead performance is once-in-a-generation. Completely transformative and unforgettable." },
  { label: "Compelling story", percentage: 31, representative: "The screenplay is tight, emotional, and unpredictable from start to finish." },
  { label: "Slow pacing concerns", percentage: 15, representative: "Beautiful but the second act drags considerably before the payoff." },
  { label: "Stunning visuals", percentage: 12, representative: "Every frame is a painting. The cinematography is genuinely breathtaking." },
];

export const MOCK_AVC = {
  audienceScore: 87,
  criticScore: 79,
  verdict: "Audiences connect more deeply than critics anticipated — particularly praising the emotional performances and immersive world-building that critics undervalued.",
};

export const SNACKS = [
  { icon: "🍿", name: "Popcorn", price: "$6.50" },
  { icon: "🥤", name: "Cola", price: "$4.00" },
  { icon: "🍫", name: "Choc Bar", price: "$3.50" },
  { icon: "🌭", name: "Hot Dog", price: "$7.00" },
];

export const FILMSTRIP_COLORS = [
  ["#FF3D7F", "#9B5DE5"],
  ["#FFD23F", "#F4A460"],
  ["#06D6A0", "#118AB2"],
  ["#EF476F", "#FFD23F"],
  ["#9B5DE5", "#3A86FF"],
  ["#FF6B9D", "#C77DFF"],
  ["#FFD23F", "#FF3D7F"],
  ["#3A86FF", "#9B5DE5"],
];

export const REVIEW_COLORS = ["#FF3D7F", "#FFD23F", "#9B5DE5", "#06D6A0", "#118AB2", "#EF476F", "#FF6B9D", "#3A86FF"];

export const SEARCH_SUGGESTIONS = [
  { label: "The Matrix", id: "tt0133093" },
  { label: "Parasite", id: "tt6751668" },
  { label: "Interstellar", id: "tt0816692" },
  { label: "Dune: Part Two", id: "tt15239678" },
  { label: "Poor Things", id: "tt14230458" },
];
