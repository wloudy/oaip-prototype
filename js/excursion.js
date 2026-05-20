const EXCURSIONS = [
  'Монумент Победы на Поклонной горе',
  'Музей Великой Отечественной войны',
  'Главный храм Вооружённых сил России',
  'Парковая аллея Героев',
  'Фонтан «Слёзы горюют»',
  'Триумфальная арка'
];

const HOURS = [];
for (let h = 9; h <= 21; h++) {
  HOURS.push({ from: h, to: h + 1, label: `${h}:00–${h + 1}:00` });
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function buildSchedule() {
  const tbody = document.getElementById('schedule-body');
  if (!tbody) return;

  EXCURSIONS.forEach((name, row) => {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = name;
    tr.appendChild(th);

    HOURS.forEach((slot, col) => {
      const td = document.createElement('td');
      const seed = row * 100 + col;
      const r = seededRandom(seed);
      let places;
      let cls = 'slot-cell ';

      if (r < 0.15) {
        places = 0;
        cls += 'full';
      } else if (r < 0.35) {
        places = Math.floor(r * 5) + 1;
        cls += 'low';
      } else {
        places = Math.floor(r * 12) + 3;
        cls += 'available';
      }

      const cell = document.createElement('span');
      cell.className = cls;
      cell.textContent = places === 0 ? '—' : places;
      cell.title = places === 0 ? 'Регистрация завершена' : `Свободно мест: ${places}`;
      td.appendChild(cell);
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });
}

document.addEventListener('DOMContentLoaded', buildSchedule);
