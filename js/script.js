// Data do início do namoro - fixada em Brasília (UTC-3)
const startedAt = new Date("2022-05-31T19:15:00-03:00");

const el = (id) => document.getElementById(id);
const pad = (n) => String(n).padStart(2, "0");

// Converte qualquer data para o horário de Brasília
function getBrasiliaTime() {
  const now = new Date();

  const brasilia = new Date(
    now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" })
  );

  return brasilia;
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

function update() {

  // sempre usa horário de Brasília
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

  el("years").textContent = years;
  el("days").textContent = days;
  el("hours").textContent = pad(hours);
  el("minutes").textContent = pad(minutes);
  el("seconds").textContent = pad(seconds);

  el("sinceText").textContent =
    "Desde " +
    new Intl.DateTimeFormat("pt-BR", {
      timeZone: "America/Sao_Paulo",
      dateStyle: "short",
      timeStyle: "short",
    }).format(startedAt);
}

function toast(msg) {
  const t = el("toast");

  t.textContent = msg;

  setTimeout(() => {
    if (t.textContent === msg) t.textContent = "";
  }, 2200);
}

el("copyBtn").addEventListener("click", async () => {

  const msg =
    `Estamos juntos há ${el("years").textContent} anos, ${el("days").textContent} dias, ` +
    `${el("hours").textContent} horas, ${el("minutes").textContent} minutos e ` +
    `${el("seconds").textContent} segundos ❤️`;

  try {
    await navigator.clipboard.writeText(msg);
    toast("Copiado! ✅");
  } catch {
    toast("Não consegui copiar 😅");
  }
});

el("msgBtn").addEventListener("click", () => {

  const msg =
    `Amor, eu fiz esse site pra você. ` +
    `Estamos juntos há ${el("years").textContent} anos ❤️`;

  alert(msg);
});

update();

setInterval(update, 1000);