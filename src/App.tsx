import { useState } from "react";

type Screen = "checkin" | "books" | "frequency";

const books = [
  {
    title: "Torto Arado",
    author: "Itamar Vieira Junior",
    category: "Literatura brasileira",
    average: 9.7,
    color: "bg-[#d94c47]",
  },
  {
    title: "O Pequeno Príncipe",
    author: "Antoine de Saint-Exupéry",
    category: "Clássico",
    average: 9.5,
    color: "bg-[#e4a937]",
  },
  {
    title: "Quarto de Despejo",
    author: "Carolina Maria de Jesus",
    category: "Memórias",
    average: 9.3,
    color: "bg-[#347b67]",
  },
];

const attendance = [
  { month: "Fev", value: 52 },
  { month: "Mar", value: 68 },
  { month: "Abr", value: 61 },
  { month: "Mai", value: 82 },
  { month: "Jun", value: 74 },
  { month: "Jul", value: 92 },
];

const studentRanking = [
  { name: "Ana Clara Ribeiro", registration: "2024.01093", visits: 28, points: 280 },
  { name: "Lucas Gabriel Costa", registration: "2024.01427", visits: 25, points: 250 },
  { name: "Mariana Oliveira Santos", registration: "2024.01842", visits: 23, points: 230 },
  { name: "João Pedro Almeida", registration: "2024.00981", visits: 21, points: 210 },
  { name: "Beatriz Souza Lima", registration: "2024.01654", visits: 19, points: 190 },
];

const bookCatalog = [
  "A Bolsa Amarela",
  "A Hora da Estrela",
  "Capitães da Areia",
  "Dom Casmurro",
  "Extraordinário",
  "Memórias Póstumas de Brás Cubas",
  "O Cortiço",
  "O Pequeno Príncipe",
  "Quarto de Despejo",
  "Torto Arado",
];

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: "book" | "card" | "user" | "arrow" | "star" | "chart" | "check";
  className?: string;
}) {
  const paths = {
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </>
    ),
    card: (
      <>
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <path d="M2 10h20M6 15h2" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
    arrow: <path d="m9 18 6-6-6-6" />,
    star: (
      <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
    ),
    chart: (
      <>
        <path d="M3 3v18h18" />
        <path d="m7 16 4-5 4 3 5-7" />
      </>
    ),
    check: <path d="m5 12 4 4L19 6" />,
  };

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function Header({
  screen,
  onNavigate,
}: {
  screen: Screen;
  onNavigate: (screen: Screen) => void;
}) {
  const steps: { id: Screen; label: string }[] = [
    { id: "checkin", label: "Entrada" },
    { id: "books", label: "Avaliações" },
    { id: "frequency", label: "Frequência" },
  ];

  return (
    <header className="border-b border-[#dbe7e0] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <button
          className="flex items-center gap-3 text-left"
          onClick={() => onNavigate("checkin")}
          type="button"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#116149] text-white">
            <Icon name="book" className="h-5 w-5" />
          </span>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[#d94c47]">
              Biblioteca
            </span>
            <span className="block text-sm font-bold text-[#173f34]">Portal do leitor</span>
          </span>
        </button>

        <nav className="hidden items-center gap-2 sm:flex" aria-label="Etapas">
          {steps.map((step, index) => {
            const active = step.id === screen;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => onNavigate(step.id)}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition ${
                  active
                    ? "bg-[#eef7f2] text-[#116149]"
                    : "text-[#7a8e87] hover:text-[#116149]"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full border text-[10px] ${
                    active ? "border-[#116149]" : "border-[#cad8d2]"
                  }`}
                >
                  {index + 1}
                </span>
                {step.label}
              </button>
            );
          })}
        </nav>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b9d1c7] text-[#116149]">
          <Icon name="user" className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}

function CheckInScreen({ onContinue }: { onContinue: () => void }) {
  const [identified, setIdentified] = useState(false);
  const [selectedAction, setSelectedAction] = useState<"add" | "return" | null>(null);
  const [bookQuery, setBookQuery] = useState("");
  const [selectedBook, setSelectedBook] = useState("");
  const confetti = Array.from({ length: 70 }, (_, index) => ({
    left: `${(index * 37) % 100}%`,
    delay: `${(index % 14) * 0.07}s`,
    duration: `${1.4 + (index % 5) * 0.18}s`,
    color: ["#116149", "#d94c47", "#e4a937", "#76a993"][index % 4],
  }));
  const matchingBooks =
    bookQuery.trim().length > 0
      ? bookCatalog.filter((title) =>
          title.toLocaleLowerCase("pt-BR").startsWith(bookQuery.trim().toLocaleLowerCase("pt-BR")),
        )
      : [];

  const selectAction = (action: "add" | "return") => {
    setSelectedAction(action);
    setBookQuery("");
    setSelectedBook("");
  };

  const selectBook = (title: string) => {
    setBookQuery(title);
    setSelectedBook(title);
  };

  return (
    <main className="relative flex flex-1 items-center overflow-hidden px-5 py-10 sm:px-8">
      <div className="dot-field pointer-events-none absolute inset-0 opacity-50" />
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.86fr]">
        <section>
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-[#d94c47]" />
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#d94c47]">
              Controle de visitas
            </p>
          </div>
          <h1 className="max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.05em] text-[#123e32] sm:text-6xl lg:text-7xl">
            Bem-vindo à <span className="text-[#d94c47]">Biblioteca</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-[#60766e] sm:text-lg">
            Registre sua visita, avalie suas leituras e acompanhe sua jornada pela biblioteca.
          </p>
        </section>

        <section className="relative">
          <div className="absolute -right-5 -top-5 h-24 w-24 rounded-full border-[18px] border-[#d94c47]/10" />
          <div className="relative rounded-[2rem] border border-[#d5e4de] bg-white p-5 shadow-[0_24px_80px_rgba(18,62,50,0.12)] sm:p-8">
            {!identified ? (
              <div className="text-center">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#eef7f2]">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[1.4rem] border-2 border-[#116149] bg-white text-[#116149] shadow-sm">
                    <Icon name="card" className="h-9 w-9" />
                  </div>
                </div>
                <p className="mt-7 text-xs font-bold uppercase tracking-[0.18em] text-[#d94c47]">
                  Identificação
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#123e32]">
                  Aproxime o seu cartão
                </h2>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#71847e]">
                  Posicione o cartão do aluno próximo ao leitor para registrar sua entrada.
                </p>
                <div className="mx-auto mt-7 flex w-36 justify-center gap-2">
                  <span className="signal-bar h-1.5 w-7 rounded-full bg-[#116149]/25" />
                  <span className="signal-bar h-1.5 w-7 rounded-full bg-[#116149]/50" />
                  <span className="signal-bar h-1.5 w-7 rounded-full bg-[#116149]" />
                </div>
                <button
                  onClick={() => setIdentified(true)}
                  className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border-2 border-[#116149] bg-white px-5 py-3.5 text-sm font-extrabold text-[#116149] transition hover:bg-[#116149] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#116149]/15"
                  type="button"
                >
                  Simular leitura do cartão
                  <Icon name="card" className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="relative overflow-hidden rounded-2xl px-2 pb-4 pt-2">
                  <div
                    className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
                    aria-hidden="true"
                  >
                    {confetti.map((piece, index) => (
                      <span
                        key={index}
                        className="confetti-piece absolute -top-5 block"
                        style={
                          {
                            left: piece.left,
                            width: index % 3 === 0 ? "6px" : "9px",
                            height: index % 3 === 0 ? "13px" : "7px",
                            backgroundColor: piece.color,
                            animationDelay: piece.delay,
                            animationDuration: piece.duration,
                          } as React.CSSProperties
                        }
                      />
                    ))}
                  </div>
                  <div className="relative z-10">
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#116149] text-white">
                      <Icon name="check" className="h-9 w-9" />
                    </div>
                    <p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#116149]">
                      Cartão identificado
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-[#123e32]">
                      Mariana Oliveira Santos
                    </h2>
                    <p className="mt-1 text-sm text-[#71847e]">Matrícula 2024.01842</p>
                  </div>
                </div>

                <div className="mb-6 mt-2 rounded-2xl bg-[#fff4f2] px-5 py-5">
                  <p className="text-sm font-semibold text-[#8d4843]">Visita registrada com sucesso</p>
                  <p className="mt-1 text-2xl font-black text-[#d94c47]">Você ganhou 10 pontos</p>
                </div>

                <div className="mb-4 text-left">
                  <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.14em] text-[#405f55]">
                    O que você deseja fazer?
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      aria-pressed={selectedAction === "add"}
                      onClick={() => selectAction("add")}
                      className={`rounded-xl border-2 px-3 py-3 text-xs font-extrabold transition ${
                        selectedAction === "add"
                          ? "border-[#116149] bg-[#eef7f2] text-[#116149]"
                          : "border-[#b8d0c6] bg-white text-[#116149] hover:border-[#116149]"
                      }`}
                    >
                      Acrescentar livros
                    </button>
                    <button
                      type="button"
                      aria-pressed={selectedAction === "return"}
                      onClick={() => selectAction("return")}
                      className={`rounded-xl border-2 px-3 py-3 text-xs font-extrabold transition ${
                        selectedAction === "return"
                          ? "border-[#116149] bg-[#eef7f2] text-[#116149]"
                          : "border-[#b8d0c6] bg-white text-[#116149] hover:border-[#116149]"
                      }`}
                    >
                      Devolver livros
                    </button>
                  </div>
                </div>

                {selectedAction && (
                  <div className="relative mb-4 text-left">
                    <label
                      htmlFor="book-search"
                      className="mb-2 block text-xs font-extrabold text-[#405f55]"
                    >
                      {selectedAction === "add"
                        ? "Qual livro deseja acrescentar?"
                        : "Qual livro deseja devolver?"}
                    </label>
                    <div className="relative">
                      <Icon
                        name="book"
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#116149]"
                      />
                      <input
                        id="book-search"
                        type="search"
                        value={bookQuery}
                        autoComplete="off"
                        placeholder="Digite as primeiras letras..."
                        onChange={(event) => {
                          setBookQuery(event.target.value);
                          setSelectedBook("");
                        }}
                        className="w-full rounded-xl border-2 border-[#b8d0c6] bg-white py-3 pl-10 pr-4 text-sm font-semibold text-[#123e32] outline-none transition placeholder:font-normal placeholder:text-[#9aaba5] focus:border-[#116149] focus:ring-4 focus:ring-[#116149]/10"
                      />
                    </div>

                    {bookQuery && !selectedBook && (
                      <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-40 overflow-y-auto rounded-xl border border-[#cbdcd5] bg-white p-1.5 shadow-[0_12px_30px_rgba(18,62,50,0.16)]">
                        {matchingBooks.length > 0 ? (
                          matchingBooks.map((title) => (
                            <button
                              key={title}
                              type="button"
                              onClick={() => selectBook(title)}
                              className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[#405f55] transition hover:bg-[#eef7f2] hover:text-[#116149]"
                            >
                              <Icon name="book" className="h-4 w-4 shrink-0" />
                              {title}
                            </button>
                          ))
                        ) : (
                          <p className="px-3 py-3 text-sm text-[#81938c]">
                            Nenhum livro encontrado.
                          </p>
                        )}
                      </div>
                    )}

                    {selectedBook && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs font-bold text-[#116149]">
                        <Icon name="check" className="h-3.5 w-3.5" />
                        Livro selecionado
                      </p>
                    )}
                  </div>
                )}

                <button
                  onClick={onContinue}
                  disabled={!selectedAction || !selectedBook}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#116149] bg-white px-5 py-3.5 text-sm font-extrabold text-[#116149] transition hover:bg-[#116149] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#116149]/15 disabled:cursor-not-allowed disabled:border-[#c7d4cf] disabled:text-[#9aaba5] disabled:hover:bg-white"
                  type="button"
                >
                  Continuar
                  <Icon name="arrow" className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function BooksScreen({ onContinue }: { onContinue: () => void }) {
  const [ratings, setRatings] = useState<Record<number, number>>({});

  return (
    <main className="flex-1 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#d94c47]">
              Comunidade leitora
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-[#123e32] sm:text-5xl">
              Livros mais bem votados
            </h1>
            <p className="mt-3 max-w-2xl text-[#697f77]">
              Conte como foi sua leitura. Escolha uma nota de 0 a 10 para cada livro lido.
            </p>
          </div>
          <button
            type="button"
            onClick={onContinue}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-[#116149] bg-white px-5 py-3 text-sm font-extrabold text-[#116149] transition hover:bg-[#116149] hover:text-white"
          >
            Ver minha frequência
            <Icon name="arrow" className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {books.map((book, index) => (
            <article
              key={book.title}
              className="overflow-hidden rounded-2xl border border-[#d6e4de] bg-white transition hover:-translate-y-1 hover:shadow-[0_18px_50px_rgba(18,62,50,0.1)]"
            >
              <div className="flex gap-5 p-6">
                <div
                  className={`relative flex h-32 w-24 shrink-0 items-end overflow-hidden rounded-sm ${book.color} p-3 text-white shadow-lg`}
                >
                  <span className="absolute left-3 top-3 h-1 w-8 bg-white/60" />
                  <span className="text-sm font-black leading-tight">{book.title}</span>
                </div>
                <div className="min-w-0 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#d94c47]">
                    {book.category}
                  </span>
                  <h2 className="mt-2 text-xl font-black leading-tight text-[#123e32]">{book.title}</h2>
                  <p className="mt-1 text-xs text-[#768b83]">{book.author}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff4f2] text-[#d94c47]">
                      <Icon name="star" className="h-3.5 w-3.5 fill-current" />
                    </span>
                    <strong className="text-lg text-[#123e32]">{book.average}</strong>
                    <span className="text-xs text-[#8a9b95]">média</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#e4ece8] bg-[#f9fbfa] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold text-[#405f55]">Sua nota</p>
                  <span className="text-xs font-bold text-[#116149]">
                    {ratings[index] !== undefined ? `${ratings[index]} / 10` : "Selecione"}
                  </span>
                </div>
                <div className="grid grid-cols-11 gap-1" aria-label={`Avaliar ${book.title}`}>
                  {Array.from({ length: 11 }, (_, rating) => (
                    <button
                      key={rating}
                      type="button"
                      aria-label={`Nota ${rating}`}
                      aria-pressed={ratings[index] === rating}
                      onClick={() => setRatings((current) => ({ ...current, [index]: rating }))}
                      className={`aspect-square rounded-md text-[10px] font-extrabold transition ${
                        ratings[index] === rating
                          ? "bg-[#d94c47] text-white"
                          : "border border-[#b8d0c6] bg-white text-[#116149] hover:border-[#116149]"
                      }`}
                    >
                      {rating}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-[#7c9088]">
          {Object.keys(ratings).length} de {books.length} livros avaliados nesta sessão
        </p>
      </div>
    </main>
  );
}

function FrequencyScreen({ onRestart }: { onRestart: () => void }) {
  const [showRanking, setShowRanking] = useState(false);

  return (
    <main className="flex-1 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#d94c47]">
              Relatório de presença
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-[#123e32] sm:text-5xl">
              Frequência dos alunos
            </h1>
            <p className="mt-3 text-[#697f77]">Visitas registradas nos últimos seis meses.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              aria-expanded={showRanking}
              onClick={() => setShowRanking((current) => !current)}
              className={`rounded-xl border-2 border-[#116149] px-5 py-3 text-sm font-extrabold transition ${
                showRanking
                  ? "bg-[#116149] text-white"
                  : "bg-white text-[#116149] hover:bg-[#116149] hover:text-white"
              }`}
            >
              {showRanking ? "Ocultar ranking" : "Ver ranking dos alunos"}
            </button>
            <button
              type="button"
              onClick={onRestart}
              className="rounded-xl border-2 border-[#116149] bg-white px-5 py-3 text-sm font-extrabold text-[#116149] transition hover:bg-[#116149] hover:text-white"
            >
              Registrar nova visita
            </button>
          </div>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {[
            ["429", "visitas no semestre", "+18%"],
            ["92", "visitas em julho", "recorde"],
            ["71", "média mensal", "+9 alunos"],
          ].map(([value, label, badge], index) => (
            <div key={label} className="rounded-2xl border border-[#d6e4de] bg-white p-6">
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    index === 1 ? "bg-[#fff1ef] text-[#d94c47]" : "bg-[#eef7f2] text-[#116149]"
                  }`}
                >
                  <Icon name={index === 0 ? "user" : index === 1 ? "star" : "chart"} />
                </span>
                <span className="rounded-full bg-[#f3f7f5] px-2.5 py-1 text-[10px] font-extrabold text-[#597168]">
                  {badge}
                </span>
              </div>
              <strong className="mt-5 block text-4xl font-black tracking-tight text-[#123e32]">{value}</strong>
              <span className="mt-1 block text-sm text-[#71867e]">{label}</span>
            </div>
          ))}
        </div>

        {showRanking && (
          <section className="mt-5 overflow-hidden rounded-2xl border border-[#d6e4de] bg-white">
            <div className="flex flex-col justify-between gap-2 border-b border-[#e1eae6] px-5 py-5 sm:flex-row sm:items-center sm:px-7">
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#d94c47]">
                  Leitores mais frequentes
                </p>
                <h2 className="mt-1 text-xl font-black text-[#123e32]">Ranking dos alunos</h2>
              </div>
              <p className="text-xs text-[#788c84]">10 pontos por visita registrada</p>
            </div>

            <div className="divide-y divide-[#e7eeeb]">
              {studentRanking.map((student, index) => (
                <div
                  key={student.registration}
                  className={`grid grid-cols-[42px_1fr_auto] items-center gap-3 px-5 py-4 sm:grid-cols-[50px_1fr_100px_100px] sm:px-7 ${
                    student.name === "Mariana Oliveira Santos" ? "bg-[#f1f8f4]" : ""
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black ${
                      index === 0
                        ? "bg-[#d94c47] text-white"
                        : "border border-[#b9d1c7] bg-white text-[#116149]"
                    }`}
                  >
                    {index + 1}º
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-[#123e32]">{student.name}</p>
                    <p className="mt-0.5 text-[11px] text-[#81938c]">
                      Matrícula {student.registration}
                      {student.name === "Mariana Oliveira Santos" && (
                        <span className="ml-2 font-bold text-[#d94c47]">Você</span>
                      )}
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <strong className="block text-sm text-[#123e32]">{student.visits}</strong>
                    <span className="text-[10px] text-[#81938c]">visitas</span>
                  </div>
                  <div className="text-right">
                    <strong className="block text-sm text-[#116149]">{student.points}</strong>
                    <span className="text-[10px] text-[#81938c]">pontos</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-5 rounded-2xl border border-[#d6e4de] bg-white p-5 sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-black text-[#123e32]">Evolução mensal</h2>
              <p className="mt-1 text-sm text-[#788c84]">Número total de entradas por mês</p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#60766e]">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#116149]" />
              Visitas registradas
            </div>
          </div>

          <div className="mt-10 flex h-72 gap-3 sm:gap-6">
            <div className="flex w-8 flex-col justify-between pb-7 text-right text-[10px] text-[#93a39d]">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>
            <div className="chart-grid flex flex-1 items-end justify-around border-b border-[#cbdad4] px-1 sm:px-5">
              {attendance.map((item, index) => (
                <div key={item.month} className="flex h-full flex-1 flex-col items-center justify-end">
                  <div className="group relative flex h-[calc(100%-28px)] w-full items-end justify-center">
                    <span className="absolute bottom-[calc(var(--height)+8px)] text-[10px] font-extrabold text-[#116149] opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                      {item.value}
                    </span>
                    <div
                      className={`w-7 rounded-t-lg transition-all duration-700 sm:w-12 ${
                        index === attendance.length - 1
                          ? "bg-[#d94c47]"
                          : "bg-[#116149] hover:bg-[#0d4d3b]"
                      }`}
                      style={
                        {
                          height: `${item.value}%`,
                          "--height": `${item.value}%`,
                        } as React.CSSProperties
                      }
                    />
                  </div>
                  <span className="mt-3 h-4 text-xs font-bold text-[#667b73]">{item.month}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("checkin");

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfcfb] text-[#123e32]">
      <Header screen={screen} onNavigate={setScreen} />
      {screen === "checkin" && <CheckInScreen onContinue={() => setScreen("books")} />}
      {screen === "books" && <BooksScreen onContinue={() => setScreen("frequency")} />}
      {screen === "frequency" && <FrequencyScreen onRestart={() => setScreen("checkin")} />}
      <footer className="border-t border-[#e0e9e5] px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a9b95]">
        Sistema de controle de visitas · Biblioteca escolar
      </footer>
    </div>
  );
}
