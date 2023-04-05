const { apply_patch } = wasm_bindgen;
async function run() {
  await wasm_bindgen();
}
run();

function checkNggUrl(url) {
  let nggUrl = url.match(
    /https:\/\/now\.gg\/(?:apps|play)\/(.+)\/([0-9]+)\/(.+)/
  );
  if (!nggUrl) return false;
  return `https://now.gg/play/${nggUrl[1]}/${nggUrl[2]}/${
    nggUrl[3].split(".")[0]
  }`;
}

async function getNggGame(url) {
  url = checkNggUrl(url);
  if (!url) return;
  const response = await fetch(url);
  let data = await response.text();
  data = apply_patch(data);
  document.open();
  document.write(data);
  document.close();
}

function urlSubmit() {
  getNggGame(document.getElementById("nggurl").value);
  return false;
}

async function getGames() {
  let games = await fetch(
    atob("aHR0cHM6Ly9tYXRoc3Nwb3QuY29tL2FwaS9hcHBzL3YxL3BvcHVsYXIvYXBwcy9saXN0")
  );
  games = await games.json();
  games = games.data;
  games = games.filter(game => checkNggUrl(game.playPageUrl));
  games = games.sort((a, b) =>
    a.name.toLowerCase().localeCompare(b.name.toLowerCase())
  );
  document.getElementsByClassName("btnBox")[0].innerHTML = "";
  document.getElementById("ldBtn").innerHTML = "";
  games.forEach((game) => {
    let btn = document.createElement("button");
    btn.innerHTML = game.name;
    btn.className = "btn";
    btn.onclick = function () {
      console.log(game.playPageUrl);
      getNggGame(game.playPageUrl.split("?")[0]);
    };

    document.getElementsByClassName("btnBox")[0].appendChild(btn);
  });
}

setTimeout(() => {
    document.onload = getNggGame('https://now.gg/play/roblox-corporation/5349/roblox');
}, 1000);