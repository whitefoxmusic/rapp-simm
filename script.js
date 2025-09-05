let gameState = {
  fame: 0,
  money: 150,
  exp: 0,
  flow: 1,
  lyrics: 1,
  charisma: 1,
  followers: 100,
  week: 1,
  singles: [],
  albums: [],
  streams: 0,
  stage: 0
};

function promptName(type, callback) {
  const name = prompt(`Name your ${type}:`);
  if (name && name.trim() !== "") {
    callback(name.trim());
  } else {
    callback(`Untitled ${type}`);
  }
}

function getCertification(streams) {
  if (streams >= 1_000_000_000) {
    return '<span style="color:#6cf; font-weight:bold;">&#128142; Diamond</span>';
  } else if (streams >= 100_000_000) {
    return '<span style="color:#c8f; font-weight:bold;">&#11088; Platinum</span>';
  } else if (streams >= 10_000_000) {
    return '<span style="color:#FFD700; font-weight:bold;">&#x1F48E; Gold</span>';
  }
  return '';
}

function showReleases() {
  let html = "<b>Singles:</b>";
  html += "<ul style='margin-bottom:6px'>";
  if (gameState.singles.length === 0) html += "<li style='color:#bbb'>None</li>";
  else gameState.singles.forEach(s => {
    html += `<li>
      <span style='color:#f7ca5b'>${s.name}</span>: 
      <span style='color:#b8f'>${s.streams.toLocaleString()}</span> streams 
      ${getCertification(s.streams)}
    </li>`;
  });
  html += "</ul><b>Albums:</b>";
  html += "<ul>";
  if (gameState.albums.length === 0) html += "<li style='color:#bbb'>None</li>";
  else gameState.albums.forEach(a => {
    html += `<li>
      <span style='color:#f7ca5b'>${a.name}</span>: 
      <span style='color:#b8f'>${a.streams.toLocaleString()}</span> streams 
      ${getCertification(a.streams)}
    </li>`;
  });
  html += "</ul>";
  return html;
}

function growStreams() {
  gameState.singles.forEach(s => {
    const gain = Math.floor(Math.random() * 100) + 20;
    s.streams += gain;
    gameState.money += gain;
    gameState.streams += gain;
  });
  gameState.albums.forEach(a => {
    const gain = Math.floor(Math.random() * 300) + 80;
    a.streams += gain;
    gameState.money += gain;
    gameState.streams += gain;
  });
}

function randomEvent() {
  const events = [
    { text: "A fan shares your freestyle, gaining you 50 followers!", action: () => gameState.followers += 50 },
    { text: "You get invited to a local radio show. Fame +10, Money +50!", action: () => { gameState.fame += 10; gameState.money += 50; } },
    { text: "A rival rapper drops diss bars. Lose 30 followers!", action: () => gameState.followers = Math.max(gameState.followers - 30,0) },
    { text: "Your song goes viral! Streams +2000, Money +2000!", action: () => { gameState.streams += 2000; gameState.money += 2000; } }
  ];
  const rand = events[Math.floor(Math.random() * events.length)];
  alert(rand.text);
  rand.action();
}

function releaseSingle() {
  promptName('single', (name) => {
    let streams;
    let message = "";
    const rand = Math.random();
    if (rand < 0.001) { // 0.1% chance for Diamond
      streams = Math.floor(Math.random() * 500_000_000) + 1_000_000_000;
      message = "Your single went DIAMOND! Incredible!";
    } else if (rand < 0.01) { // 1% chance for Platinum
      streams = Math.floor(Math.random() * 50_000_000) + 100_000_000;
      message = "Your single went PLATINUM!";
    } else if (rand < 0.05) { // 5% chance for Gold
      streams = Math.floor(Math.random() * 5_000_000) + 10_000_000;
      message = "Your single went GOLD!";
    } else {
      streams = Math.floor(Math.random() * 2000) + 500;
    }
    // Guarantee at least as many streams as followers
    streams = Math.max(streams, gameState.followers);

    gameState.singles.push({ name, streams });
    gameState.streams += streams;
    gameState.money += streams;
    gameState.fame += Math.floor(streams / 100);
    gameState.followers += Math.floor(streams / 10);
    alert(`Your single "${name}" got ${streams.toLocaleString()} streams! You earned $${streams.toLocaleString()}.\n${message}`);
    nextWeek();
  });
}

function releaseAlbum() {
  promptName('album', (name) => {
    let streams;
    let message = "";
    const rand = Math.random();
    if (rand < 0.001) { // 0.1% chance for Diamond
      streams = Math.floor(Math.random() * 500_000_000) + 1_000_000_000;
      message = "Your album went DIAMOND! Legendary!";
    } else if (rand < 0.01) { // 1% chance for Platinum
      streams = Math.floor(Math.random() * 50_000_000) + 100_000_000;
      message = "Your album went PLATINUM!";
    } else if (rand < 0.05) { // 5% chance for Gold
      streams = Math.floor(Math.random() * 5_000_000) + 10_000_000;
      message = "Your album went GOLD!";
    } else {
      streams = Math.floor(Math.random() * 10000) + 3000;
    }
    // Guarantee at least as many streams as followers
    streams = Math.max(streams, gameState.followers);

    gameState.albums.push({ name, streams });
    gameState.streams += streams;
    gameState.money += streams;
    gameState.fame += Math.floor(streams / 200);
    gameState.followers += Math.floor(streams / 30);
    alert(`Your album "${name}" got ${streams.toLocaleString()} streams! You earned $${streams.toLocaleString()}.\n${message}`);
    nextWeek();
  });
}

function getRandomActions() {
  const baseActions = [
    { text: "Practice Flow (+1)", action: () => { gameState.flow++; gameState.exp+=2; nextWeek(); } },
    { text: "Write Lyrics (+1)", action: () => { gameState.lyrics++; gameState.exp+=2; nextWeek(); } },
    { text: "Promote Yourself (+1 Charisma, +100 followers)", action: () => { gameState.charisma++; gameState.followers+=100; nextWeek(); } },
    { text: "Release Single", action: releaseSingle },
    { text: "Release Album", action: releaseAlbum }
  ];
  // Shuffle and pick 3
  for (let i = baseActions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [baseActions[i], baseActions[j]] = [baseActions[j], baseActions[i]];
  }
  return baseActions.slice(0,3);
}

function showWeek() {
  document.getElementById('story').innerHTML = `<b>Week ${gameState.week}:</b> Choose your action!`;
  document.getElementById('status').innerHTML =
    `<b>Fame:</b> <span style="color:#f7ca5b">${gameState.fame}</span> &nbsp; 
     <b>Money:</b> <span style="color:#b8f">$${gameState.money.toLocaleString()}</span> &nbsp; 
     <b>EXP:</b> ${gameState.exp}<br>
     <b>Flow:</b> ${gameState.flow} &nbsp; 
     <b>Lyrics:</b> ${gameState.lyrics} &nbsp; 
     <b>Charisma:</b> ${gameState.charisma}<br>
     <b>Followers:</b> <span style="color:#a3ffa3">${gameState.followers.toLocaleString()}</span><br>
     <b>Total Streams:</b> <span style="color:#b8f">${gameState.streams.toLocaleString()}</span><br>` +
     showReleases();

  const choicesDiv = document.getElementById('choices');
  choicesDiv.innerHTML = '';
  const actions = getRandomActions();
  actions.push({ text: "Random Event", action: () => { randomEvent(); nextWeek(); } });
  actions.forEach(act => {
    const btn = document.createElement('button');
    btn.textContent = act.text;
    btn.onclick = act.action;
    choicesDiv.appendChild(btn);
  });
}

function nextWeek() {
  growStreams();
  gameState.week++;
  showWeek();
}

function restartGame() {
  gameState = {
    fame: 0,
    money: 150,
    exp: 0,
    flow: 1,
    lyrics: 1,
    charisma: 1,
    followers: 100,
    week: 1,
    singles: [],
    albums: [],
    streams: 0,
    stage: 0
  };
  showWeek();
}

window.onload = showWeek;
// Save the current game state to localStorage
function saveGame() {
  localStorage.setItem('rapperGameSave', JSON.stringify(gameState));
  alert('Game saved!');
}

// Load the game state from localStorage
function loadGame() {
  const data = localStorage.getItem('rapperGameSave');
  if (data) {
    gameState = JSON.parse(data);
    showWeek();
    alert('Game loaded!');
  } else {
    alert('No save found!');
  }
}

// Attach to buttons after DOM loads
window.onload = function() {
  showWeek();
  document.getElementById('saveBtn').onclick = saveGame;
  document.getElementById('loadBtn').onclick = loadGame;
};
let socialPosts = [];

function switchTab(tab) {
  document.getElementById('gameTab').style.display = tab === 'game' ? '' : 'none';
  document.getElementById('socialTab').style.display = tab === 'social' ? '' : 'none';
  document.getElementById('gameTabBtn').classList.toggle('active', tab === 'game');
  document.getElementById('socialTabBtn').classList.toggle('active', tab === 'social');
  if (tab === 'social') renderSocialFeed();
}

document.getElementById('gameTabBtn').onclick = () => switchTab('game');
document.getElementById('socialTabBtn').onclick = () => switchTab('social');

function renderSocialFeed() {
  const feed = document.getElementById('socialFeed');
  if (socialPosts.length === 0) {
    feed.innerHTML = "<i>No posts yet. Make your first post!</i>";
  } else {
    feed.innerHTML = socialPosts.map(p => `<div style="margin-bottom:10px;"><b>${p.week}:</b> ${p.text}</div>`).join('');
  }
}

document.getElementById('postBtn').onclick = () => {
  const txt = prompt("What's your post?");
  if (txt && txt.trim() !== "") {
    socialPosts.unshift({ week: "Week " + gameState.week, text: txt.trim() });
    gameState.followers += Math.floor(Math.random() * 100) + 50; // Gain followers
    renderSocialFeed();
    alert("Your post gained you new followers!");
  }
};