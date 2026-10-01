async function loadStars(){
  const container = document.getElementById('stars');
  if(!container) return;
  try{
    const res = await fetch('events.json', {cache: 'no-store'});
    if(!res.ok) throw new Error('Failed to fetch events.json: ' + res.status);
    const data = await res.json();
    const events = Array.isArray(data) ? data : (data && Array.isArray(data.items) ? data.items : []);
    render(events, container);
  }catch(err){
    container.innerHTML = '';
    const errDiv = document.createElement('div');
    errDiv.className = 'empty';
    errDiv.textContent = 'Error loading starred repositories: ' + (err && err.message ? err.message : String(err));
    container.appendChild(errDiv);
    console.error(err);
  }
}

function render(events, container){
  container.innerHTML = '';
  if(!Array.isArray(events) || events.length === 0){
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No starred repositories found.';
    container.appendChild(empty);
    return;
  }

  const list = document.createElement('ul');
  list.className = 'stars-list';
  list.setAttribute('role', 'list');

  events.forEach(evt => {
    const r = evt && evt.repo ? evt.repo : evt || {};

    const li = document.createElement('li');
    li.setAttribute('role', 'listitem');

    const card = document.createElement('article');
    card.className = 'star-card';

    const top = document.createElement('div');
    top.className = 'star-top';

    const heading = document.createElement('h2');
    heading.className = 'repo-name';
    const link = document.createElement('a');
    link.className = 'link';
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `${r.owner || ''}/${r.name || ''}`;
    if(r.url){
      try{ link.href = r.url; }catch(e){ /* ignore invalid URLs */ }
    }
    heading.appendChild(link);

    const right = document.createElement('div');
    right.className = 'meta';
    const starsBadge = document.createElement('div');
    starsBadge.className = 'badge';
    starsBadge.textContent = '⭐ ' + (Number(r.stargazers_count || 0));
    const langBadge = document.createElement('div');
    langBadge.className = 'badge';
    langBadge.textContent = r.language || '—';
    right.appendChild(starsBadge);
    right.appendChild(langBadge);

    top.appendChild(heading);
    top.appendChild(right);

    const desc = document.createElement('p');
    desc.className = 'repo-desc';
    desc.textContent = r.description || '';

    const footer = document.createElement('div');
    footer.className = 'meta';
    const timeWrapper = document.createElement('div');
    if(evt && evt.starred_at){
      const d = new Date(evt.starred_at);
      if(!isNaN(d)){
        const timeEl = document.createElement('time');
        timeEl.dateTime = d.toISOString();
        timeEl.textContent = d.toLocaleString();
        timeWrapper.appendChild(document.createTextNode('Starred: '));
        timeWrapper.appendChild(timeEl);
      }
    }
    footer.appendChild(timeWrapper);

    card.appendChild(top);
    card.appendChild(desc);
    card.appendChild(footer);
    li.appendChild(card);
    list.appendChild(li);
  });

  container.appendChild(list);
}

document.addEventListener('DOMContentLoaded', loadStars);
