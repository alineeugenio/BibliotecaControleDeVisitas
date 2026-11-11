import { useEffect, useState } from "react"

type Screen = "checkin" | "books" | "library" | "score" | "frequency" | "goals"

type Student = {
  matricula: string
  nome: string
  pontuacao: string
}

type ApiBook = {
  id?: number | string
  titulo: string
  autor: string
  nota: string
  id_aluno: string
  comentario?: string
  avaliacao?: number
  data_registro?: string
  capa_id?: number | null
  open_library_key?: string
}

type OpenLibraryBook = {
  key: string
  title: string
  author_name?: string[]
  cover_i?: number
  first_publish_year?: number
}

type Coordinator = {
  nome: string
  email: string
  senha: string
}

type Goal = {
  id: number
  pontuacao: number
  titulo: string
  texto: string
}

const API_URL = "https://desafio-biblioteca-api.onrender.com"

const attendance = [
  { month: "Fev", value: 52 },
  { month: "Mar", value: 68 },
  { month: "Abr", value: 61 },
  { month: "Mai", value: 82 },
  { month: "Jun", value: 74 },
  { month: "Jul", value: 92 },
]

function Icon({
  name,
  className = "h-5 w-5",
}: {
  name: "book" | "card" | "user" | "arrow" | "star" | "chart" | "check" | "search" | "plus" | "close"
  className?: string
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
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    plus: <path d="M12 5v14M5 12h14" />,
    close: <path d="m6 6 12 12M18 6 6 18" />,
  }

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
  )
}

function Header({
  screen,
  coordinatorLoggedIn,
  studentLoggedIn,
  scoreUnlocked,
  onNavigate,
}: {
  screen: Screen
  coordinatorLoggedIn: boolean
  studentLoggedIn: boolean
  scoreUnlocked: boolean
  onNavigate: (screen: Screen) => void
}) {
  const steps: { id: Screen label: string }[] = coordinatorLoggedIn
    ? [
        { id: "goals", label: "Metas" },
        { id: "frequency", label: "Frequência" },
      ]
    : studentLoggedIn
      ? [
          { id: "checkin", label: "Entrada" },
          { id: "books", label: "Avaliações" },
          { id: "library", label: "Minha Biblioteca" },
          ...(scoreUnlocked
            ? [{ id: "score" as Screen, label: "Pontuação" }]
            : []),
        ]
      : [{ id: "checkin", label: "Entrada" }]

  return (
    <header className="border-b border-[#dbe7e0] bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <button
          className="flex items-center gap-3 text-left"
          onClick={() => onNavigate(coordinatorLoggedIn ? "goals" : "checkin")}
          type="button"
          aria-label="Ir para o início do Portal do Leitor do IFB"
        >
          <img
            src="/ifb-logo.svg"
            alt="Instituto Federal de Brasília"
            className="h-12 w-auto sm:h-14"
          />
          <span className="hidden border-l border-[#dbe7e0] pl-3 lg:block">
            <span className="block text-[10px] font-bold uppercase tracking-[0.22em] text-[#d94c47]">
              Biblioteca
            </span>
            <span className="block text-sm font-bold text-[#173f34]">
              Portal do leitor
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-2 sm:flex" aria-label="Etapas">
          {steps.map((step, index) => {
            const active = step.id === screen
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
            )
          })}
        </nav>

        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#b9d1c7] text-[#116149]">
          <Icon name="user" className="h-4 w-4" />
        </div>
      </div>
      <nav
        className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 pb-3 sm:hidden"
        aria-label="Etapas"
      >
        {steps.map((step, index) => {
          const active = step.id === screen
          return (
            <button
              key={step.id}
              type="button"
              onClick={() => onNavigate(step.id)}
              className={`flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-xs font-bold transition ${
                active ? "bg-[#eef7f2] text-[#116149]" : "text-[#7a8e87]"
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
          )
        })}
      </nav>
    </header>
  )
}

function CheckInScreen({
  students = [],
  apiBooks = [],
  coordinators = [],
  loading,
  apiError,
  currentStudent,
  onIdentify,
  onCoordinatorLogin,
  onBack,
  onContinue,
  onOpenLibrary,
}: {
  students: Student[]
  apiBooks: ApiBook[]
  coordinators: Coordinator[]
  loading: boolean
  apiError: string
  currentStudent: Student | null
  onIdentify: (student: Student) => void
  onCoordinatorLogin: (coordinator: Coordinator) => void
  onBack: () => void
  onContinue: () => void
  onOpenLibrary: () => void
}) {
  const [identified, setIdentified] = useState(Boolean(currentStudent))
  const [loginMode, setLoginMode] = useState<"student" | "coordinator">(
    "student",
  )
  const [registration, setRegistration] = useState("")
  const [firstName, setFirstName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [selectedAction, setSelectedAction] = useState<"add" | "return" | null>(
    null,
  )
  const [bookQuery, setBookQuery] = useState("")
  const [selectedBook, setSelectedBook] = useState("")
  const safeStudents = Array.isArray(students) ? students : []
  const safeBooks = Array.isArray(apiBooks) ? apiBooks : []
  const safeCoordinators = Array.isArray(coordinators) ? coordinators : []
  const bookCatalog = Array.from(
    new Set(safeBooks.map((book) => book.titulo)),
  ).sort((a, b) => a.localeCompare(b, "pt-BR"))
  const confetti = Array.from({ length: 70 }, (_, index) => ({
    left: `${(index * 37) % 100}%`,
    delay: `${(index % 14) * 0.07}s`,
    duration: `${1.4 + (index % 5) * 0.18}s`,
    color: ["#116149", "#d94c47", "#e4a937", "#76a993"][index % 4],
  }))
  const matchingBooks =
    bookQuery.trim().length > 0
      ? bookCatalog.filter((title) =>
          title
            .toLocaleLowerCase("pt-BR")
            .startsWith(bookQuery.trim().toLocaleLowerCase("pt-BR")),
        )
      : []

  const selectAction = (action: "add" | "return") => {
    setSelectedAction(action)
    setBookQuery("")
    setSelectedBook("")
  }

  const selectBook = (title: string) => {
    setBookQuery(title)
    setSelectedBook(title)
  }

  const returnToLogin = () => {
    setIdentified(false)
    setSelectedAction(null)
    setBookQuery("")
    setSelectedBook("")
    onBack()
  }

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoginError("")

    if (loginMode === "coordinator") {
      const coordinator = safeCoordinators.find(
        (item) =>
          item.email.toLocaleLowerCase("pt-BR") ===
            email.trim().toLocaleLowerCase("pt-BR") && item.senha === password,
      )

      if (!coordinator) {
        setLoginError(
          "E-mail ou senha inválidos. Confira os dados e tente novamente.",
        )
        return
      }

      onCoordinatorLogin(coordinator)
      return
    }

    const normalizedFirstName = firstName.trim().toLocaleLowerCase("pt-BR")
    const student = safeStudents.find(
      (item) =>
        item.matricula === registration.trim() &&
        item.nome.split(" ")[0].toLocaleLowerCase("pt-BR") ===
          normalizedFirstName,
    )

    if (!student) {
      setLoginError(
        "Matrícula ou primeiro nome não encontrados. Confira os dados e tente novamente.",
      )
      return
    }

    onIdentify(student)
    setIdentified(true)
  }

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
            Registre sua visita, avalie suas leituras e acompanhe sua jornada
            pela biblioteca.
          </p>
          <div className="mt-8 flex max-w-lg items-center gap-4 rounded-2xl border border-[#cfe0d9] bg-white p-4 shadow-[0_12px_35px_rgba(18,62,50,0.07)]">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#eef7f2] text-[#116149]">
              <Icon name="book" className="h-6 w-6" />
            </span>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#d94c47]">
                Nova funcionalidade
              </span>
              <p className="mt-1 text-sm font-black text-[#123e32]">
                Minha Biblioteca
              </p>
              <p className="mt-0.5 text-xs leading-5 text-[#71847e]">
                Pesquise obras, registre suas notas e guarde seus comentários.
              </p>
            </div>
          </div>
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
                  {loginMode === "student"
                    ? "Login do aluno"
                    : "Login do coordenador"}
                </h2>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-[#71847e]">
                  {loginMode === "student"
                    ? "Informe sua matrícula e seu primeiro nome para registrar a visita."
                    : "Entre com o e-mail e a senha cadastrados para acessar as metas."}
                </p>

                <div className="mt-6 grid grid-cols-2 rounded-xl bg-[#eef4f1] p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode("student")
                      setLoginError("")
                    }}
                    className={`rounded-lg px-3 py-2.5 text-xs font-extrabold transition ${
                      loginMode === "student"
                        ? "bg-white text-[#116149] shadow-sm"
                        : "text-[#71847e]"
                    }`}
                  >
                    Aluno
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLoginMode("coordinator")
                      setLoginError("")
                    }}
                    className={`rounded-lg px-3 py-2.5 text-xs font-extrabold transition ${
                      loginMode === "coordinator"
                        ? "bg-white text-[#116149] shadow-sm"
                        : "text-[#71847e]"
                    }`}
                  >
                    Coordenador
                  </button>
                </div>

                <form
                  className="mt-5 space-y-4 text-left"
                  onSubmit={handleLogin}
                >
                  {loginMode === "student" ? (
                    <>
                      <div>
                        <label
                          htmlFor="registration"
                          className="mb-2 block text-xs font-extrabold text-[#405f55]"
                        >
                          Número da matrícula
                        </label>
                        <input
                          id="registration"
                          inputMode="numeric"
                          value={registration}
                          onChange={(event) =>
                            setRegistration(event.target.value)
                          }
                          placeholder="Ex.: 2026001"
                          className="w-full rounded-xl border-2 border-[#b8d0c6] bg-white px-4 py-3 text-sm font-semibold text-[#123e32] outline-none transition placeholder:font-normal placeholder:text-[#9aaba5] focus:border-[#116149] focus:ring-4 focus:ring-[#116149]/10"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="first-name"
                          className="mb-2 block text-xs font-extrabold text-[#405f55]"
                        >
                          Primeiro nome
                        </label>
                        <input
                          id="first-name"
                          value={firstName}
                          onChange={(event) => setFirstName(event.target.value)}
                          placeholder="Ex.: Marina"
                          className="w-full rounded-xl border-2 border-[#b8d0c6] bg-white px-4 py-3 text-sm font-semibold text-[#123e32] outline-none transition placeholder:font-normal placeholder:text-[#9aaba5] focus:border-[#116149] focus:ring-4 focus:ring-[#116149]/10"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label
                          htmlFor="coordinator-email"
                          className="mb-2 block text-xs font-extrabold text-[#405f55]"
                        >
                          E-mail
                        </label>
                        <input
                          id="coordinator-email"
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          placeholder="nome@exemplo.com"
                          className="w-full rounded-xl border-2 border-[#b8d0c6] bg-white px-4 py-3 text-sm font-semibold text-[#123e32] outline-none transition placeholder:font-normal placeholder:text-[#9aaba5] focus:border-[#116149] focus:ring-4 focus:ring-[#116149]/10"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="coordinator-password"
                          className="mb-2 block text-xs font-extrabold text-[#405f55]"
                        >
                          Senha
                        </label>
                        <input
                          id="coordinator-password"
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          placeholder="Digite sua senha"
                          className="w-full rounded-xl border-2 border-[#b8d0c6] bg-white px-4 py-3 text-sm font-semibold text-[#123e32] outline-none transition placeholder:font-normal placeholder:text-[#9aaba5] focus:border-[#116149] focus:ring-4 focus:ring-[#116149]/10"
                        />
                      </div>
                    </>
                  )}

                  {(loginError || apiError) && (
                    <p
                      role="alert"
                      className="rounded-lg bg-[#fff1ef] px-3 py-2.5 text-xs font-semibold leading-5 text-[#a33f3a]"
                    >
                      {loginError || apiError}
                    </p>
                  )}

                  <button
                    disabled={
                      loading ||
                      (loginMode === "student"
                        ? !registration.trim() || !firstName.trim()
                        : !email.trim() || !password)
                    }
                    className="flex w-full items-center justify-center gap-3 rounded-xl border-2 border-[#116149] bg-white px-5 py-3.5 text-sm font-extrabold text-[#116149] transition hover:bg-[#116149] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#116149]/15 disabled:cursor-not-allowed disabled:border-[#c7d4cf] disabled:text-[#9aaba5] disabled:hover:bg-white"
                    type="submit"
                  >
                    {loading
                      ? "Carregando dados..."
                      : loginMode === "student"
                        ? "Entrar e registrar visita"
                        : "Acessar metas"}
                    <Icon
                      name={loginMode === "student" ? "card" : "arrow"}
                      className="h-4 w-4"
                    />
                  </button>
                </form>
              </div>
            ) : currentStudent ? (
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
                      {currentStudent.nome}
                    </h2>
                    <p className="mt-1 text-sm text-[#71847e]">
                      Matrícula {currentStudent.matricula}
                    </p>
                  </div>
                </div>

                <div className="mb-6 mt-2 rounded-2xl bg-[#fff4f2] px-5 py-5">
                  <p className="text-sm font-semibold text-[#8d4843]">
                    Visita registrada com sucesso
                  </p>
                  <p className="mt-1 text-2xl font-black text-[#d94c47]">
                    Você ganhou 10 pontos
                  </p>
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
                          setBookQuery(event.target.value)
                          setSelectedBook("")
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

                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={returnToLogin}
                    className="rounded-xl border-2 border-[#116149] bg-white px-5 py-3.5 text-sm font-extrabold text-[#116149] transition hover:bg-[#eef7f2] focus:outline-none focus:ring-4 focus:ring-[#116149]/15"
                    type="button"
                  >
                    Voltar
                  </button>
                  <button
                    onClick={onContinue}
                    disabled={!selectedAction || !selectedBook}
                    className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#116149] bg-white px-5 py-3.5 text-sm font-extrabold text-[#116149] transition hover:bg-[#116149] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#116149]/15 disabled:cursor-not-allowed disabled:border-[#c7d4cf] disabled:text-[#9aaba5] disabled:hover:bg-white"
                    type="button"
                  >
                    Continuar
                    <Icon name="arrow" className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={onOpenLibrary}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#d94c47] bg-white px-5 py-3.5 text-sm font-extrabold text-[#d94c47] transition hover:bg-[#d94c47] hover:text-white focus:outline-none focus:ring-4 focus:ring-[#d94c47]/15"
                >
                  <Icon name="book" className="h-4 w-4" />
                  Ir para Minha Biblioteca
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  )
}

function BooksScreen({
  apiBooks = [],
  onContinue,
}: {
  apiBooks?: ApiBook[]
  onContinue: () => void
}) {
  const [ratings, setRatings] = useState<Record<number, number>>({})
  const hasRating = Object.keys(ratings).length > 0
  const colors = ["bg-[#d94c47]", "bg-[#e4a937]", "bg-[#347b67]"]
  const books = [...(Array.isArray(apiBooks) ? apiBooks : [])]
    .sort((a, b) => Number.parseFloat(b.nota) - Number.parseFloat(a.nota))
    .map((book, index) => ({
      title: book.titulo,
      author: book.autor,
      category: "Acervo da biblioteca",
      average: (Number.parseFloat(book.nota) * 2).toFixed(1),
      color: colors[index % colors.length],
    }))

  return (
    <main className="flex-1 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#d94c47]">
              Comunidade leitora
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-[#123e32] sm:text-5xl">
              Relação completa de livros
            </h1>
            <p className="mt-3 max-w-2xl text-[#697f77]">
              Todos os títulos disponíveis na API, ordenados pela nota. Avalie
              de 0 a 10 os livros que você já leu.
            </p>
          </div>
          <button
            type="button"
            onClick={onContinue}
            disabled={!hasRating}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-[#116149] bg-white px-5 py-3 text-sm font-extrabold text-[#116149] transition hover:bg-[#116149] hover:text-white disabled:cursor-not-allowed disabled:border-[#c7d4cf] disabled:text-[#9aaba5] disabled:hover:bg-white"
          >
            {hasRating
              ? "Ver minha pontuação"
              : "Avalie um livro para continuar"}
            <Icon name="arrow" className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
                  <span className="text-sm font-black leading-tight">
                    {book.title}
                  </span>
                </div>
                <div className="min-w-0 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#d94c47]">
                    {book.category}
                  </span>
                  <h2 className="mt-2 text-xl font-black leading-tight text-[#123e32]">
                    {book.title}
                  </h2>
                  <p className="mt-1 text-xs text-[#768b83]">{book.author}</p>
                  <div className="mt-4 flex items-center gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#fff4f2] text-[#d94c47]">
                      <Icon name="star" className="h-3.5 w-3.5 fill-current" />
                    </span>
                    <strong className="text-lg text-[#123e32]">
                      {book.average}
                    </strong>
                    <span className="text-xs text-[#8a9b95]">média</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#e4ece8] bg-[#f9fbfa] p-5">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-bold text-[#405f55]">Sua nota</p>
                  <span className="text-xs font-bold text-[#116149]">
                    {ratings[index] !== undefined
                      ? `${ratings[index]} / 10`
                      : "Selecione"}
                  </span>
                </div>
                <div
                  className="grid grid-cols-11 gap-1"
                  aria-label={`Avaliar ${book.title}`}
                >
                  {Array.from({ length: 11 }, (_, rating) => (
                    <button
                      key={rating}
                      type="button"
                      aria-label={`Nota ${rating}`}
                      aria-pressed={ratings[index] === rating}
                      onClick={() =>
                        setRatings((current) => ({
                          ...current,
                          [index]: rating,
                        }))
                      }
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
          {Object.keys(ratings).length} de {books.length} livros avaliados nesta
          sessão
        </p>
      </div>
    </main>
  )
}

function MyLibraryScreen({
  student,
  initialBooks,
  onBookSaved,
}: {
  student: Student
  initialBooks: ApiBook[]
  onBookSaved: (book: ApiBook) => void
}) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<OpenLibraryBook[]>([])
  const [selectedBook, setSelectedBook] = useState<OpenLibraryBook | null>(null)
  const [rating, setRating] = useState<number | null>(null)
  const [comment, setComment] = useState("")
  const [searching, setSearching] = useState(false)
  const [saving, setSaving] = useState(false)
  const [searchError, setSearchError] = useState("")
  const [saveMessage, setSaveMessage] = useState("")

  const studentBooks = initialBooks
    .filter((book) => book.id_aluno === student.matricula)
    .sort((a, b) => {
      const firstDate = a.data_registro
        ? new Date(a.data_registro).getTime()
        : 0
      const secondDate = b.data_registro
        ? new Date(b.data_registro).getTime()
        : 0
      return secondDate - firstDate
    })

  useEffect(() => {
    const normalizedQuery = query.trim()
    if (normalizedQuery.length < 2) {
      setResults([])
      setSearching(false)
      setSearchError("")
      return
    }

    const controller = new AbortController()
    const timer = window.setTimeout(async () => {
      try {
        setSearching(true)
        setSearchError("")
        const response = await fetch(
          `https://openlibrary.org/search.json?q=${encodeURIComponent(normalizedQuery)}&limit=20`,
          { signal: controller.signal },
        )
        if (!response.ok) throw new Error("A pesquisa não pôde ser concluída.")
        const data: unknown = await response.json()
        if (
          typeof data !== "object" ||
          data === null ||
          !("docs" in data) ||
          !Array.isArray(data.docs)
        ) {
          throw new Error("A Open Library retornou dados inesperados.")
        }
        setResults(
          (data.docs as OpenLibraryBook[]).filter(
            (book) =>
              typeof book.key === "string" && typeof book.title === "string",
          ),
        )
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setResults([])
        setSearchError(
          "Não foi possível pesquisar agora. Tente novamente em instantes.",
        )
      } finally {
        if (!controller.signal.aborted) setSearching(false)
      }
    }, 450)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [query])

  const openReview = (book: OpenLibraryBook) => {
    setSelectedBook(book)
    setRating(null)
    setComment("")
    setSaveMessage("")
  }

  const closeReview = () => {
    if (saving) return
    setSelectedBook(null)
    setRating(null)
    setComment("")
  }

  const saveBook = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedBook || rating === null) return

    const savedBook: ApiBook = {
      titulo: selectedBook.title,
      autor: selectedBook.author_name?.join(", ") || "Autoria não informada",
      nota: `${rating} - ${comment.trim() || "Sem comentário."}`,
      avaliacao: rating,
      comentario: comment.trim(),
      data_registro: new Date().toISOString(),
      capa_id: selectedBook.cover_i ?? null,
      open_library_key: selectedBook.key,
      id_aluno: student.matricula,
    }

    try {
      setSaving(true)
      setSaveMessage("")
      const response = await fetch(`${API_URL}/livros`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(savedBook),
      })
      if (!response.ok) throw new Error("Não foi possível salvar a leitura.")
      const createdBook = (await response.json()) as ApiBook
      onBookSaved(createdBook)
      setSelectedBook(null)
      setQuery("")
      setResults([])
      setSaveMessage("Livro adicionado à sua biblioteca.")
    } catch {
      setSaveMessage("Não foi possível salvar o livro. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="flex-1 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <section>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#d94c47]">
              Estante pessoal
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-[#123e32] sm:text-5xl">
              Minha Biblioteca
            </h1>
            <p className="mt-3 max-w-xl leading-7 text-[#697f77]">
              Pesquise uma obra na Open Library e registre sua leitura, nota e
              comentário.
            </p>

            <div className="mt-8 rounded-2xl border border-[#d6e4de] bg-white p-5 shadow-[0_12px_40px_rgba(18,62,50,0.06)] sm:p-6">
              <label
                htmlFor="open-library-search"
                className="text-sm font-extrabold text-[#405f55]"
              >
                Pesquisar livro
              </label>
              <div className="relative mt-3">
                <Icon
                  name="search"
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#116149]"
                />
                <input
                  id="open-library-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Título, autor ou assunto..."
                  autoComplete="off"
                  className="w-full rounded-xl border-2 border-[#b8d0c6] bg-white py-3.5 pl-12 pr-4 text-sm font-semibold text-[#123e32] outline-none transition placeholder:font-normal placeholder:text-[#9aaba5] focus:border-[#116149] focus:ring-4 focus:ring-[#116149]/10"
                />
              </div>
              <p className="mt-2 text-xs text-[#81938c]">
                Digite pelo menos 2 caracteres. A busca retorna até 20
                resultados.
              </p>
            </div>

            {saveMessage && (
              <p
                role="status"
                className={`mt-4 rounded-xl px-4 py-3 text-sm font-bold ${
                  saveMessage.startsWith("Livro")
                    ? "bg-[#eef7f2] text-[#116149]"
                    : "bg-[#fff1ef] text-[#a33f3a]"
                }`}
              >
                {saveMessage}
              </p>
            )}
          </section>

          <section aria-live="polite">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-black text-[#123e32]">
                {query.trim().length >= 2
                  ? "Resultados da pesquisa"
                  : "Suas leituras"}
              </h2>
              <span className="text-xs font-bold text-[#788c84]">
                {query.trim().length >= 2
                  ? `${results.length} resultados`
                  : `${studentBooks.length} livros`}
              </span>
            </div>

            {searching ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <div
                    key={index}
                    className="h-48 animate-pulse rounded-2xl border border-[#d6e4de] bg-white"
                  />
                ))}
              </div>
            ) : searchError ? (
              <div className="rounded-2xl border border-[#f0cfcb] bg-[#fff7f5] p-8 text-center text-sm font-semibold text-[#a33f3a]">
                {searchError}
              </div>
            ) : query.trim().length >= 2 ? (
              results.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {results.map((book) => (
                    <BookResultCard
                      key={book.key}
                      book={book}
                      onSelect={() => openReview(book)}
                    />
                  ))}
                </div>
              ) : (
                <EmptyLibraryState text="Nenhum livro encontrado para essa pesquisa." />
              )
            ) : studentBooks.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {studentBooks.map((book, index) => (
                  <SavedBookCard
                    key={book.id ?? `${book.titulo}-${index}`}
                    book={book}
                  />
                ))}
              </div>
            ) : (
              <EmptyLibraryState text="Sua biblioteca ainda está vazia. Comece pesquisando uma obra." />
            )}
          </section>
        </div>
      </div>

      {selectedBook && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-[#0d2d25]/55 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="review-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeReview()
          }}
        >
          <form
            onSubmit={saveBook}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-[2rem] bg-white p-6 shadow-2xl sm:rounded-[2rem] sm:p-8"
          >
            <div className="flex items-start gap-5">
              <BookCover
                coverId={selectedBook.cover_i}
                title={selectedBook.title}
                className="h-36 w-24 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-[#d94c47]">
                      Registrar leitura
                    </p>
                    <h2
                      id="review-title"
                      className="mt-2 text-2xl font-black text-[#123e32]"
                    >
                      {selectedBook.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={closeReview}
                    aria-label="Fechar"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#c8d9d2] text-[#116149] hover:bg-[#eef7f2]"
                  >
                    <Icon name="close" className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 text-sm text-[#71867e]">
                  {selectedBook.author_name?.join(", ") ||
                    "Autoria não informada"}
                </p>
              </div>
            </div>

            <fieldset className="mt-7">
              <legend className="text-sm font-extrabold text-[#405f55]">
                Sua nota de 0 a 10
              </legend>
              <div className="mt-3 grid grid-cols-11 gap-1.5">
                {Array.from({ length: 11 }, (_, value) => (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={rating === value}
                    onClick={() => setRating(value)}
                    className={`aspect-square rounded-lg text-xs font-extrabold transition ${
                      rating === value
                        ? "bg-[#d94c47] text-white"
                        : "border border-[#b8d0c6] text-[#116149] hover:border-[#116149]"
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="mt-6">
              <label
                htmlFor="reading-comment"
                className="text-sm font-extrabold text-[#405f55]"
              >
                Comentário{" "}
                <span className="font-normal text-[#81938c]">(opcional)</span>
              </label>
              <textarea
                id="reading-comment"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                maxLength={500}
                rows={4}
                placeholder="Conte o que achou desta leitura..."
                className="mt-3 w-full resize-none rounded-xl border-2 border-[#b8d0c6] bg-white px-4 py-3 text-sm text-[#123e32] outline-none transition placeholder:text-[#9aaba5] focus:border-[#116149] focus:ring-4 focus:ring-[#116149]/10"
              />
              <p className="mt-1 text-right text-[10px] text-[#8a9b95]">
                {comment.length}/500
              </p>
            </div>

            <button
              type="submit"
              disabled={rating === null || saving}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#116149] bg-white px-5 py-3.5 text-sm font-extrabold text-[#116149] transition hover:bg-[#116149] hover:text-white disabled:cursor-not-allowed disabled:border-[#c7d4cf] disabled:text-[#9aaba5] disabled:hover:bg-white"
            >
              <Icon name="plus" className="h-4 w-4" />
              {saving ? "Salvando..." : "Adicionar à Minha Biblioteca"}
            </button>
          </form>
        </div>
      )}
    </main>
  )
}

function BookCover({
  coverId,
  title,
  className,
}: {
  coverId?: number | null
  title: string
  className: string
}) {
  return coverId ? (
    <img
      src={`https://covers.openlibrary.org/b/id/${coverId}-M.jpg`}
      alt={`Capa de ${title}`}
      loading="lazy"
      className={`${className} rounded-md object-cover shadow-md`}
    />
  ) : (
    <div
      className={`${className} flex items-center justify-center rounded-md bg-[#116149] p-3 text-center text-xs font-black text-white shadow-md`}
      aria-label={`Capa não disponível para ${title}`}
    >
      {title}
    </div>
  )
}

function BookResultCard({
  book,
  onSelect,
}: {
  book: OpenLibraryBook
  onSelect: () => void
}) {
  return (
    <article className="flex min-h-48 gap-4 rounded-2xl border border-[#d6e4de] bg-white p-4 transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(18,62,50,0.09)]">
      <BookCover
        coverId={book.cover_i}
        title={book.title}
        className="h-36 w-24 shrink-0"
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#d94c47]">
          {book.first_publish_year
            ? `Publicado em ${book.first_publish_year}`
            : "Open Library"}
        </p>
        <h3 className="mt-2 line-clamp-3 font-black leading-tight text-[#123e32]">
          {book.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#71867e]">
          {book.author_name?.join(", ") || "Autoria não informada"}
        </p>
        <button
          type="button"
          onClick={onSelect}
          className="mt-auto flex items-center justify-center gap-1.5 rounded-lg border-2 border-[#116149] bg-white px-3 py-2 text-xs font-extrabold text-[#116149] transition hover:bg-[#116149] hover:text-white"
        >
          <Icon name="plus" className="h-3.5 w-3.5" />
          Registrar leitura
        </button>
      </div>
    </article>
  )
}

function SavedBookCard({ book }: { book: ApiBook }) {
  const rating = book.avaliacao ?? Number.parseInt(book.nota, 10)
  const formattedDate = book.data_registro
    ? new Intl.DateTimeFormat("pt-BR").format(new Date(book.data_registro))
    : "Data não informada"

  return (
    <article className="flex min-h-48 gap-4 rounded-2xl border border-[#d6e4de] bg-white p-4">
      <BookCover
        coverId={book.capa_id}
        title={book.titulo}
        className="h-36 w-24 shrink-0"
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full bg-[#fff1ef] px-2.5 py-1 text-[10px] font-black text-[#d94c47]">
            {Number.isNaN(rating) ? "Sem nota" : `${rating}/10`}
          </span>
          <span className="text-[10px] text-[#8a9b95]">{formattedDate}</span>
        </div>
        <h3 className="mt-3 line-clamp-2 font-black leading-tight text-[#123e32]">
          {book.titulo}
        </h3>
        <p className="mt-1 line-clamp-1 text-xs text-[#71867e]">{book.autor}</p>
        {book.comentario && (
          <p className="mt-3 line-clamp-3 border-l-2 border-[#b8d0c6] pl-3 text-xs italic leading-5 text-[#60766e]">
            “{book.comentario}”
          </p>
        )}
      </div>
    </article>
  )
}

function EmptyLibraryState({ text }: { text: string }) {
  return (
    <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-[#b8d0c6] bg-white p-8 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef7f2] text-[#116149]">
        <Icon name="book" className="h-6 w-6" />
      </div>
      <p className="mt-4 max-w-sm text-sm font-semibold leading-6 text-[#60766e]">
        {text}
      </p>
    </div>
  )
}

function StudentScoreScreen({
  student,
  goals,
  onBack,
}: {
  student: Student
  goals: Goal[]
  onBack: () => void
}) {
  const currentPoints = Number.parseInt(student.pontuacao, 10) + 10
  const safePoints = Number.isNaN(currentPoints) ? 10 : currentPoints
  const achievedGoals = (Array.isArray(goals) ? goals : [])
    .filter((goal) => safePoints >= goal.pontuacao)
    .sort((a, b) => a.pontuacao - b.pontuacao)
  const nextGoal = (Array.isArray(goals) ? goals : [])
    .filter((goal) => safePoints < goal.pontuacao)
    .sort((a, b) => a.pontuacao - b.pontuacao)[0]

  return (
    <main className="flex-1 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#d94c47]">
              Jornada de leitura
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-[#123e32] sm:text-5xl">
              Sua pontuação
            </h1>
            <p className="mt-3 text-[#697f77]">
              {student.nome}, confira seu progresso e suas conquistas.
            </p>
          </div>
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border-2 border-[#116149] bg-white px-5 py-3 text-sm font-extrabold text-[#116149] transition hover:bg-[#116149] hover:text-white"
          >
            Voltar aos livros
          </button>
        </div>

        <section className="mt-9 overflow-hidden rounded-[2rem] bg-[#116149] p-7 text-white sm:p-10">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-white/65">
                Pontuação individual
              </p>
              <p className="mt-3 text-6xl font-black tracking-[-0.05em]">
                {safePoints}
              </p>
              <p className="mt-2 text-sm text-white/70">
                Inclui os 10 pontos desta visita
              </p>
            </div>
            {nextGoal ? (
              <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/65">
                  Próxima conquista
                </p>
                <p className="mt-2 text-lg font-black">{nextGoal.titulo}</p>
                <p className="mt-1 text-sm text-white/75">
                  Faltam {nextGoal.pontuacao - safePoints} pontos
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-white/20 bg-white/10 px-6 py-5">
                <p className="text-lg font-black">Todas as metas alcançadas</p>
              </div>
            )}
          </div>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-black text-[#123e32]">
            Conquistas alcançadas
          </h2>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            {achievedGoals.map((goal, index) => (
              <article
                key={goal.id}
                className="rounded-2xl border border-[#d6e4de] bg-white p-6 shadow-[0_10px_35px_rgba(18,62,50,0.05)]"
              >
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    index === 1
                      ? "bg-[#fff1ef] text-[#d94c47]"
                      : "bg-[#eef7f2] text-[#116149]"
                  }`}
                >
                  <Icon
                    name={index === 0 ? "book" : index === 1 ? "star" : "chart"}
                  />
                </div>
                <span className="mt-5 block text-xs font-extrabold uppercase tracking-[0.14em] text-[#d94c47]">
                  {goal.pontuacao} pontos
                </span>
                <h3 className="mt-2 text-xl font-black text-[#123e32]">
                  {goal.titulo}
                </h3>
                <p className="mt-2 text-sm leading-6 text-[#71867e]">
                  {goal.texto}
                </p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}

function FrequencyScreen({
  students = [],
  currentStudent,
  onBack,
}: {
  students: Student[]
  currentStudent: Student | null
  onBack: () => void
}) {
  const [showRanking, setShowRanking] = useState(false)
  const studentRanking = [...(Array.isArray(students) ? students : [])].sort(
    (a, b) =>
      Number.parseInt(b.pontuacao, 10) - Number.parseInt(a.pontuacao, 10),
  )

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
            <p className="mt-3 text-[#697f77]">
              Visitas registradas nos últimos seis meses.
            </p>
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
              onClick={onBack}
              className="rounded-xl border-2 border-[#116149] bg-white px-5 py-3 text-sm font-extrabold text-[#116149] transition hover:bg-[#116149] hover:text-white"
            >
              Voltar às metas
            </button>
          </div>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-3">
          {[
            ["429", "visitas no semestre", "+18%"],
            ["92", "visitas em julho", "recorde"],
            ["71", "média mensal", "+9 alunos"],
          ].map(([value, label, badge], index) => (
            <div
              key={label}
              className="rounded-2xl border border-[#d6e4de] bg-white p-6"
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                    index === 1
                      ? "bg-[#fff1ef] text-[#d94c47]"
                      : "bg-[#eef7f2] text-[#116149]"
                  }`}
                >
                  <Icon
                    name={index === 0 ? "user" : index === 1 ? "star" : "chart"}
                  />
                </span>
                <span className="rounded-full bg-[#f3f7f5] px-2.5 py-1 text-[10px] font-extrabold text-[#597168]">
                  {badge}
                </span>
              </div>
              <strong className="mt-5 block text-4xl font-black tracking-tight text-[#123e32]">
                {value}
              </strong>
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
                <h2 className="mt-1 text-xl font-black text-[#123e32]">
                  Ranking dos alunos
                </h2>
              </div>
              <p className="text-xs text-[#788c84]">
                10 pontos por visita registrada
              </p>
            </div>

            <div className="divide-y divide-[#e7eeeb]">
              {studentRanking.map((student, index) => (
                <div
                  key={student.matricula}
                  className={`grid grid-cols-[42px_1fr_auto] items-center gap-3 px-5 py-4 sm:grid-cols-[50px_1fr_100px] sm:px-7 ${
                    student.matricula === currentStudent?.matricula
                      ? "bg-[#f1f8f4]"
                      : ""
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
                    <p className="truncate text-sm font-extrabold text-[#123e32]">
                      {student.nome}
                    </p>
                    <p className="mt-0.5 text-[11px] text-[#81938c]">
                      Matrícula {student.matricula}
                      {student.matricula === currentStudent?.matricula && (
                        <span className="ml-2 font-bold text-[#d94c47]">
                          Você
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="text-right">
                    <strong className="block text-sm text-[#116149]">
                      {student.pontuacao}
                    </strong>
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
              <h2 className="text-xl font-black text-[#123e32]">
                Evolução mensal
              </h2>
              <p className="mt-1 text-sm text-[#788c84]">
                Número total de entradas por mês
              </p>
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
                <div
                  key={item.month}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
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
                  <span className="mt-3 h-4 text-xs font-bold text-[#667b73]">
                    {item.month}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}

function GoalsScreen({
  goals,
  coordinator,
  onLogout,
}: {
  goals: Goal[]
  coordinator: Coordinator
  onLogout: () => void
}) {
  const safeGoals = Array.isArray(goals) ? goals : []

  return (
    <main className="flex-1 px-5 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-[#d94c47]">
              Área restrita
            </p>
            <h1 className="mt-2 text-4xl font-black tracking-[-0.04em] text-[#123e32] sm:text-5xl">
              Metas de leitura
            </h1>
            <p className="mt-3 text-[#697f77]">
              Olá, {coordinator.nome}. Acompanhe as metas cadastradas para os
              estudantes.
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border-2 border-[#116149] bg-white px-5 py-3 text-sm font-extrabold text-[#116149] transition hover:bg-[#116149] hover:text-white"
          >
            Sair da área restrita
          </button>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {safeGoals.map((goal, index) => (
            <article
              key={goal.id}
              className="relative overflow-hidden rounded-2xl border border-[#d6e4de] bg-white p-7 shadow-[0_12px_40px_rgba(18,62,50,0.06)]"
            >
              <span
                className={`absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full ${
                  index === 1 ? "bg-[#d94c47]/10" : "bg-[#116149]/10"
                }`}
              />
              <div className="relative">
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    index === 1
                      ? "bg-[#fff1ef] text-[#d94c47]"
                      : "bg-[#eef7f2] text-[#116149]"
                  }`}
                >
                  <Icon
                    name={index === 0 ? "book" : index === 1 ? "star" : "chart"}
                  />
                </div>
                <p className="mt-6 text-4xl font-black tracking-tight text-[#123e32]">
                  {goal.pontuacao}
                  <span className="ml-1 text-sm font-bold text-[#788c84]">
                    pontos
                  </span>
                </p>
                <h2 className="mt-5 text-xl font-black text-[#123e32]">
                  {goal.titulo}
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#71867e]">
                  {goal.texto}
                </p>
              </div>
            </article>
          ))}
        </div>

        {safeGoals.length === 0 && (
          <div className="mt-10 rounded-2xl border border-dashed border-[#b8d0c6] bg-white p-10 text-center">
            <p className="font-bold text-[#405f55]">
              Nenhuma meta cadastrada na API.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("checkin")
  const [students, setStudents] = useState<Student[]>([])
  const [apiBooks, setApiBooks] = useState<ApiBook[]>([])
  const [coordinators, setCoordinators] = useState<Coordinator[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null)
  const [currentCoordinator, setCurrentCoordinator] =
    useState<Coordinator | null>(null)
  const [scoreUnlocked, setScoreUnlocked] = useState(false)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    async function loadLibraryData() {
      try {
        setLoading(true)
        setApiError("")
        const [
          studentsResponse,
          booksResponse,
          coordinatorsResponse,
          goalsResponse,
        ] = await Promise.all([
          fetch(`${API_URL}/estudantes`, { signal: controller.signal }),
          fetch(`${API_URL}/livros`, { signal: controller.signal }),
          fetch(`${API_URL}/coordenadores`, { signal: controller.signal }),
          fetch(`${API_URL}/metas`, { signal: controller.signal }),
        ])

        if (
          !studentsResponse.ok ||
          !booksResponse.ok ||
          !coordinatorsResponse.ok ||
          !goalsResponse.ok
        ) {
          throw new Error("Não foi possível consultar os dados da biblioteca.")
        }

        const [
          studentsData,
          booksData,
          coordinatorsData,
          goalsData,
        ]: [unknown, unknown, unknown, unknown] = await Promise.all([
          studentsResponse.json(),
          booksResponse.json(),
          coordinatorsResponse.json(),
          goalsResponse.json(),
        ])

        if (
          !Array.isArray(studentsData) ||
          !Array.isArray(booksData) ||
          !Array.isArray(coordinatorsData) ||
          !Array.isArray(goalsData)
        ) {
          throw new Error("A API retornou dados em um formato inesperado.")
        }

        setStudents(studentsData)
        setApiBooks(booksData)
        setCoordinators(coordinatorsData)
        setGoals(goalsData)
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return
        setApiError(
          "Não foi possível conectar à API. Tente novamente em alguns instantes.",
        )
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadLibraryData()
    return () => controller.abort()
  }, [])

  const studentLogin = (student: Student) => {
    setCurrentCoordinator(null)
    setCurrentStudent(student)
    setScoreUnlocked(false)
  }

  const clearStudent = () => {
    setCurrentStudent(null)
    setScoreUnlocked(false)
  }

  const completeRating = () => {
    setScoreUnlocked(true)
    setScreen("score")
  }

  const coordinatorLogin = (coordinator: Coordinator) => {
    setCurrentStudent(null)
    setScoreUnlocked(false)
    setCurrentCoordinator(coordinator)
    setScreen("goals")
  }

  const coordinatorLogout = () => {
    setCurrentCoordinator(null)
    setScreen("checkin")
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#fbfcfb] text-[#123e32]">
      <Header
        screen={screen}
        coordinatorLoggedIn={Boolean(currentCoordinator)}
        studentLoggedIn={Boolean(currentStudent)}
        scoreUnlocked={scoreUnlocked}
        onNavigate={setScreen}
      />
      {screen === "checkin" && (
        <CheckInScreen
          students={students}
          apiBooks={apiBooks}
          coordinators={coordinators}
          loading={loading}
          apiError={apiError}
          currentStudent={currentStudent}
          onIdentify={studentLogin}
          onCoordinatorLogin={coordinatorLogin}
          onBack={clearStudent}
          onContinue={() => setScreen("books")}
          onOpenLibrary={() => setScreen("library")}
        />
      )}
      {screen === "books" && currentStudent && (
        <BooksScreen apiBooks={apiBooks} onContinue={completeRating} />
      )}
      {screen === "library" && currentStudent && (
        <MyLibraryScreen
          student={currentStudent}
          initialBooks={apiBooks}
          onBookSaved={(book) => setApiBooks((current) => [...current, book])}
        />
      )}
      {screen === "score" && currentStudent && scoreUnlocked && (
        <StudentScoreScreen
          student={currentStudent}
          goals={goals}
          onBack={() => setScreen("books")}
        />
      )}
      {screen === "frequency" && currentCoordinator && (
        <FrequencyScreen
          students={students}
          currentStudent={currentStudent}
          onBack={() => setScreen("goals")}
        />
      )}
      {screen === "goals" && currentCoordinator && (
        <GoalsScreen
          goals={goals}
          coordinator={currentCoordinator}
          onLogout={coordinatorLogout}
        />
      )}
      <footer className="border-t border-[#e0e9e5] px-5 py-4 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a9b95]">
        Sistema de controle de visitas · Biblioteca escolar
      </footer>
    </div>
  )
}
