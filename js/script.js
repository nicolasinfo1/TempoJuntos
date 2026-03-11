const startedAt = new Date("2022-05-31T19:15:00-03:00");

const el = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, "0");

function getBrasiliaTime() {
  const now = new Date();
  return new Date(
    now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );
}

function addYearsSafe(date, years) {
  const d = new Date(date);

  const target = new Date(
    d.getFullYear() + years,
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds()
  );

  if (target.getMonth() !== d.getMonth()) {
    return new Date(
      d.getFullYear() + years,
      d.getMonth() + 1,
      0,
      d.getHours(),
      d.getMinutes(),
      d.getSeconds()
    );
  }

  return target;
}

function fullYearsBetween(start, now) {
  let years = now.getFullYear() - start.getFullYear();
  const candidate = addYearsSafe(start, years);

  if (candidate > now) years -= 1;

  return Math.max(0, years);
}

function toast(msg) {
  const t = el("toast");
  t.textContent = msg;

  setTimeout(() => {
    if (t.textContent === msg) {
      t.textContent = "";
    }
  }, 2200);
}

function initAnimatedNum(numEl) {
  if (!numEl || numEl.dataset.animated === "1") return;

  const initial = numEl.textContent.trim();
  numEl.textContent = "";

  const viewport = document.createElement("div");
  viewport.className = "num-viewport";

  const current = document.createElement("div");
  current.className = "num-layer current";
  current.textContent = initial;

  const next = document.createElement("div");
  next.className = "num-layer next";
  next.textContent = initial;

  viewport.appendChild(current);
  viewport.appendChild(next);
  numEl.appendChild(viewport);

  numEl.dataset.animated = "1";
  numEl.dataset.value = initial;
}

function setAnimatedNum(numEl, newValue) {
  initAnimatedNum(numEl);

  const oldValue = numEl.dataset.value;
  if (oldValue === newValue) return;

  const viewport = numEl.querySelector(".num-viewport");
  const current = numEl.querySelector(".num-layer.current");
  const next = numEl.querySelector(".num-layer.next");

  next.textContent = newValue;

  viewport.getBoundingClientRect();
  viewport.classList.add("animating");

  const onEnd = () => {
    viewport.classList.remove("animating");
    current.textContent = newValue;
    numEl.dataset.value = newValue;
    viewport.removeEventListener("transitionend", onEnd);
  };

  viewport.addEventListener("transitionend", onEnd);
}

function update() {
  const now = getBrasiliaTime();
  if (now < startedAt) return;

  const years = fullYearsBetween(startedAt, now);
  const afterYearsDate = addYearsSafe(startedAt, years);

  const diffMs = now - afterYearsDate;
  const totalSeconds = Math.floor(diffMs / 1000);

  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  setAnimatedNum(el("years"), String(years));
  setAnimatedNum(el("days"), String(days));
  setAnimatedNum(el("hours"), pad(hours));
  setAnimatedNum(el("minutes"), pad(minutes));
  setAnimatedNum(el("seconds"), pad(seconds));

  el("sinceText").textContent =
    "Desde " +
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      dateStyle: "short",
      timeStyle: "short",
    }).format(startedAt);
}

["years", "days", "hours", "minutes", "seconds"].forEach((id) => {
  initAnimatedNum(el(id));
});

update();
setInterval(update, 1000);

const startBtn = el("startBtn");
const introScreen = el("introScreen");
const mainContent = el("mainContent");
const musica = el("musica");

startBtn.addEventListener("click", async () => {
  let tocou = false;

  try {
    await musica.play();
    tocou = true;
  } catch (error) {
    console.error("Erro ao tocar música:", error);
  }

  introScreen.classList.add("hide");
  mainContent.classList.remove("hidden");
  mainContent.classList.add("show");

  if (!tocou) {
    toast("O site abriu, mas a música não carregou.");
  }
});

el("copyBtn").addEventListener("click", async () => {
  const years = el("years").dataset.value ?? el("years").textContent;
  const days = el("days").dataset.value ?? el("days").textContent;
  const hours = el("hours").dataset.value ?? el("hours").textContent;
  const minutes = el("minutes").dataset.value ?? el("minutes").textContent;
  const seconds = el("seconds").dataset.value ?? el("seconds").textContent;

  const msg =
    `Estamos juntos há ${years} anos, ${days} dias, ${hours} horas, ${minutes} minutos e ${seconds} segundos ❤️`;

  try {
    await navigator.clipboard.writeText(msg);
    toast("Copiado! ✅");
  } catch {
    toast("Não consegui copiar 😅");
  }
});

el("msgBtn").addEventListener("click", () => {
  const years = el("years").dataset.value ?? el("years").textContent;
  alert(`Amor, eu fiz esse site pra você. Estamos juntos há ${years} anos ❤️`);
});