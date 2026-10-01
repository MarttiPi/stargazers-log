async function loadStars(){
  const container = document.getElementById('stars');
  if(!container) return;
  try{
    const res = await fetch('events.json', {cache: 'no-store'});
    if(!res.ok) throw new Error('Failed to fetch events.json');
    const events = await res.json();
    render(events, container);
  }catch(err){
    container.innerHTML = `<div class="empty">Error loading starred repositories: ${err.message}</div>`;
    console.error(err);
  }
}

function render(events, container){
  if(!events || events.length===0){
    container.innerHTML = '<div class="empty">No starred repositories found.</div>';
    return;
  }
  const list = document.createElement('div');
  list.className = 'stars-list';
  events.forEach(evt => {
    const r = evt.repo || evt;
    const card = document.createElement('article');
    card.className = 'star-card';

    const top = document.createElement('div');
    top.className = 'star-top';
    top.innerHTML = `<div class="repo-name"><a class="link" href="${escapeHtml(r.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(r.owner)}/${escapeHtml(r.name)}</a></div>`;

    const right = document.createElement('div');
    right.className = 'meta';
    right.innerHTML = `<div class="badge">⭐ ${Number(r.stargazers_count || 0)}</div><div class="badge">${escapeHtml(r.language || '—')}</div>`;
    top.appendChild(right);

    const desc = document.createElement('div');
    desc.className = 'repo-desc';
    desc.textContent = r.description || '';

    const footer = document.createElement('div');
    footer.className = 'meta';
    const date = evt.starred_at ? new Date(evt.starred_at).toLocaleString() : '';
    footer.innerHTML = `<div>Starred: ${escapeHtml(date)}</div>`;

    card.appendChild(top);
    card.appendChild(desc);
    card.appendChild(footer);
    list.appendChild(card);
  });
  container.innerHTML = '';
  container.appendChild(list);
}

function escapeHtml(s){
  if(!s) return '';
  return String(s).replace(/[&<>"'`]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;","`":"&#96;"})[c]);
}

document.addEventListener('DOMContentLoaded', loadStars);
