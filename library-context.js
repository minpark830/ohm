// Only public browsing preferences belong in the hash. Account progress is
// supplied when filtering and is never serialized into a route or storage.
export const libraryTopics = Object.freeze(['All', 'Circuit analysis', 'RC circuits', 'BJT', 'MOSFET', 'Digital logic', 'HDL']);
const levels = ['All levels', 'Easy', 'Medium', 'Hard'];
const statuses = ['all', 'unsolved', 'solved', 'attempted'];
const sorts = ['recommended', 'difficulty', 'quick', 'newest', 'title'];
const formats = ['all', 'numeric', 'parts', 'choice', 'hdl'];
const views = new Set(['dashboard', 'problems', 'saved', 'progress', 'lab', 'admin', 'reports', 'account', 'roadmap', 'review', 'interview', 'insights', 'learn', 'hdl', 'help', 'roles', 'debug', 'design','diagnostic','plan','cases','circuit','full-hdl','community','challenges','moderation','collections','activity','notebook']);
const sources = ['problems', 'saved'];
const maxProblemId = 2147483647;
const maxHashLength = 4096;
const pick = (list, value, fallback) => list.includes(value) ? value : fallback;

export function defaultLibraryFilters() {
  return {topic: 'All', level: 'All levels', q: '', status: 'all', sort: 'recommended', skill: '', format: 'all', page: 1, pageSize: 25, scroll: 0};
}

export function normalizeLibraryScroll(value) {
  if (typeof value === 'string' && !/^\d+(?:\.\d+)?$/.test(value)) return 0;
  if (typeof value !== 'number' && typeof value !== 'string') return 0;
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(100000, Math.floor(number))) : 0;
}

function searchText(value, maxLength = 160) {
  if (typeof value !== 'string') return '';
  const clean = value.replace(/[\u0000-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, '').normalize('NFC');
  let result = '';
  for (const character of clean) {
    if (result.length + character.length > maxLength) break;
    result += character;
  }
  return result;
}

export function normalizeLibraryFilters(raw = {}) {
  const value = raw && typeof raw === 'object' && !Array.isArray(raw) ? raw : {};
  return {
    topic: pick(libraryTopics, value.topic, 'All'),
    level: pick(levels, value.level, 'All levels'),
    q: searchText(value.q),
    status: pick(statuses, value.status, 'all'),
    sort: pick(sorts, value.sort, 'recommended'),
    skill: searchText(value.skill, 80).trim(),
    format: pick(formats, value.format, 'all'),
    page: ['string','number'].includes(typeof value.page)&&/^(?:[1-9]\d{0,4}|100000)$/.test(String(value.page)) ? Number(value.page) : 1,
    pageSize: ['string','number'].includes(typeof value.pageSize)&&/^(25|50|100)$/.test(String(value.pageSize)) ? Number(value.pageSize) : 25,
    scroll: normalizeLibraryScroll(value.scroll)
  };
}

function problemId(value) {
  if (typeof value === 'string') {
    if (!/^[1-9]\d{0,9}$/.test(value)) return null;
    value = Number(value);
  }
  return typeof value === 'number' && Number.isInteger(value) && value > 0 && value <= maxProblemId ? value : null;
}

function route(kind, view = 'problems', filters = defaultLibraryFilters(), id = null, from = null) {
  return {kind, view, filters, problemId: id, from};
}

// URLSearchParams tolerates malformed escapes. Check decoding first so damaged
// links get an unavailable screen instead of silently selecting another route.
function params(query) {
  for (const pair of query.split('&')) {
    for (const component of pair.split('=')) decodeURIComponent(component.replace(/\+/g, ' '));
  }
  return new URLSearchParams(query);
}

export function parseWorkspaceRoute(hash = '') {
  if (typeof hash !== 'string' || hash.length > maxHashLength) return route('unavailable');
  const raw = hash.replace(/^#/, '');
  const separator = raw.indexOf('?');
  const path = separator < 0 ? raw : raw.slice(0, separator);
  let query;
  try { query = params(separator < 0 ? '' : raw.slice(separator + 1)); }
  catch { return route('unavailable'); }
  const filters = normalizeLibraryFilters(Object.fromEntries(['topic', 'level', 'q', 'status', 'sort', 'skill', 'format', 'page', 'pageSize', 'scroll'].map(key => [key, query.get(key)])));
  if (!path || path === 'problems' || path === 'saved') return route('library', path || 'problems', filters);
  const problemMatch = /^problem\/([^/]+)$/.exec(path);
  if (problemMatch) {
    const from = pick(sources, query.get('from'), 'problems');
    const id = problemId(problemMatch[1]);
    return id ? route('problem', from, filters, id, from) : route('unavailable', from, filters, null, from);
  }
  const feedbackMatch = /^feedback\/(new|[^/]+)$/.exec(path);
  if (feedbackMatch) {
    const id = feedbackMatch[1] === 'new' ? null : problemId(feedbackMatch[1]);
    return feedbackMatch[1] === 'new' || id ? route('feedback', 'problems', defaultLibraryFilters(), id) : route('unavailable');
  }
  return views.has(path) ? route('view', path) : route('unavailable');
}

export function workspaceHash({view = 'problems', filters, problemId: id, from} = {}) {
  const query = new URLSearchParams();
  const normalized = normalizeLibraryFilters(filters);
  const defaults = defaultLibraryFilters();
  let path;
  if (id !== undefined && id !== null) {
    const validId = problemId(id);
    if (!validId) return '#problem/unavailable';
    path = 'problem/' + validId;
    const source = pick(sources, from, pick(sources, view, 'problems'));
    if (source !== 'problems') query.set('from', source);
  } else {
    path = views.has(view) ? view : 'problems';
  }
  if (path.startsWith('problem/') || sources.includes(path)) {
    for (const key of ['topic', 'level', 'q', 'status', 'sort', 'skill', 'format', 'page', 'pageSize', 'scroll']) {
      if (normalized[key] !== defaults[key]) query.set(key, String(normalized[key]));
    }
  }
  return '#' + path + (query.size ? '?' + query.toString() : '');
}

function publicCatalog(problems) {
  const ids = new Set();
  return (Array.isArray(problems) ? problems : []).filter(problem => {
    if (!problem || problemId(problem.id) !== problem.id || problem.published === false || problem.published === 0 || ids.has(problem.id)) return false;
    ids.add(problem.id);
    return true;
  });
}

function idSet(values) {
  return new Set((Array.isArray(values) ? values : []).filter(value => problemId(value) === value));
}

export function canonicalProblemTags(problem) {
  // A skill is an exact, bounded tag from the published catalog, never a
  // generated company label or an inferred measure of interview frequency.
  return [...new Set((Array.isArray(problem?.tags) ? problem.tags : [])
    .filter(tag => typeof tag === 'string')
    .map(tag => searchText(tag, 80).trim()).filter(Boolean))].slice(0, 40);
}

export function problemFormat(problem) {
  return problem?.type === 'multipart' ? 'parts' : formats.includes(problem?.type) && problem.type !== 'all' ? problem.type : '';
}

export function attemptedProblemIds(progress = {}) {
  const ids = new Set();
  for (const attempt of Array.isArray(progress?.attempts) ? progress.attempts : []) {
    if (attempt && problemId(attempt.id) === attempt.id && typeof attempt.pass === 'boolean') ids.add(attempt.id);
  }
  for (const [key, review] of Object.entries(progress?.reviews && typeof progress.reviews === 'object' ? progress.reviews : {})) {
    const id = problemId(key);
    if (id && review && typeof review.lastPass === 'boolean' && Number.isFinite(Date.parse(review.lastAt))) ids.add(id);
  }
  return ids;
}

function publicMatch(problem, filters) {
  const tags = Array.isArray(problem.tags) ? problem.tags.filter(tag => typeof tag === 'string').join(' ') : '';
  return (filters.topic === 'All' || problem.category === filters.topic) &&
    (filters.level === 'All levels' || problem.difficulty === filters.level) &&
    (!filters.skill || canonicalProblemTags(problem).includes(filters.skill)) &&
    (filters.format === 'all' || problemFormat(problem) === filters.format) &&
    `${problem.title || ''} ${tags} ${problem.category || ''} ${problem.id}`.toLowerCase().includes(filters.q.toLowerCase());
}

function ordered(list, filters, recommend) {
  const byId = (a, b) => a.id - b.id;
  list.sort(byId);
  if (filters.sort === 'difficulty') {
    const rank = problem => levels.slice(1).indexOf(problem.difficulty);
    list.sort((a, b) => (rank(a) < 0 ? 3 : rank(a)) - (rank(b) < 0 ? 3 : rank(b)) || byId(a, b));
  } else if (filters.sort === 'quick') {
    const minutes = problem => typeof problem.minutes === 'number' && Number.isFinite(problem.minutes) && problem.minutes >= 0 ? problem.minutes : Infinity;
    list.sort((a, b) => minutes(a) - minutes(b) || byId(a, b));
  } else if (filters.sort === 'newest') {
    // Database IDs are stable import/addition order, not an invented publish date.
    list.sort((a, b) => b.id - a.id);
  } else if (filters.sort === 'title') {
    const compare = new Intl.Collator('en', {numeric: true, sensitivity: 'base'});
    list.sort((a, b) => compare.compare(String(a.title || ''), String(b.title || '')) || byId(a, b));
  } else if (typeof recommend === 'function') {
    const candidates = new Map(list.map(problem => [problem.id, problem]));
    const result = recommend([...list]);
    const used = new Set();
    const safe = [];
    for (const problem of Array.isArray(result) ? result : []) {
      if (candidates.has(problem?.id) && !used.has(problem.id)) { used.add(problem.id); safe.push(candidates.get(problem.id)); }
    }
    // A recommendation hook may reorder the selection, but cannot add excluded
    // rows, inject modified rows, duplicate them, or discard filtered problems.
    return [...safe, ...list.filter(problem => !used.has(problem.id))];
  }
  return list;
}

function selection({problems, progress = {}, filters, view = 'problems', anchor = null, recommend} = {}) {
  const normalized = normalizeLibraryFilters(filters);
  const solved = idSet(progress?.solved);
  const bookmarked = idSet(progress?.bookmarks);
  const attempted = attemptedProblemIds(progress);
  const list = publicCatalog(problems).filter(problem => publicMatch(problem, normalized) &&
    (problem.id === anchor || ((view !== 'saved' || bookmarked.has(problem.id)) &&
      (normalized.status === 'all' || (normalized.status === 'solved' ? solved.has(problem.id) : normalized.status === 'attempted' ? attempted.has(problem.id) : !solved.has(problem.id))))));
  return ordered(list, normalized, recommend);
}

export function filterProblems(options = {}) {
  return selection(options);
}

// Keep the current published problem as an anchor after it is solved or
// unsaved, while every neighbor still satisfies the original selection.
export function problemSelection({from, view = 'problems', problemId: id, ...options} = {}) {
  return selection({...options, view: pick(sources, from, pick(sources, view, 'problems')), anchor: problemId(id)});
}

export function adjacentProblem({delta, problemId: id, ...options} = {}) {
  if (delta !== 1 && delta !== -1) return null;
  const normalizedId = problemId(id);
  if (!normalizedId) return null;
  const list = problemSelection({...options, problemId: normalizedId});
  const index = list.findIndex(problem => problem.id === normalizedId);
  return index < 0 ? null : list[index + delta] || null;
}
