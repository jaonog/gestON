import Image from "next/image";

export default function Login() {
  return (
    <div className="min-h-screen bg-stone-950 text-white flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-12">
        <div className="md:w-1/2 flex items-center justify-center">
          <div className="bg-neutral-900 p-8 rounded-2xl w-full max-w-sm shadow-lg">
            <label className="block text-sm font-semibold mb-2" htmlFor="email">
              E-MAIL
            </label>
            <input
              id="email"
              type="email"
              className="w-full p-3 rounded bg-neutral-800 text-white mb-4 focus:outline-none"
              placeholder="Digite seu e-mail"
            />

            <label className="block text-sm font-semibold mb-2" htmlFor="senha">
              SENHA
            </label>
            <input
              id="senha"
              type="password"
              className="w-full p-3 rounded bg-neutral-800 text-white mb-10 focus:outline-none"
              placeholder="Digite sua senha"
            />

            <button className="w-full bg-sky-700 hover:bg-sky-800 text-white font-bold py-2 rounded">
              ACESSAR
            </button>
          </div>
        </div>

        <div className="md:w-1/2 flex items-center justify-center relative">
          <div className="relative w-full max-w-xl">
            <h1 className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-4xl font-bold z-10">
              GEST <span className="underline decoration-sky-600">ON</span>
            </h1>

            <Image
              src="/login-illustration.png"
              alt="Ilustração"
              width={1000}
              height={1000}
              className="w-full h-auto"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
