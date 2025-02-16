'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'

export function LoginForm() {
  const { signInWithGoogle } = useAuth()

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-950 via-blue-950 to-gray-900 p-4 overflow-hidden">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNTkuOTEgMEg2MHYxLjFBNjAgNjAgMCAwIDAgLjEgMGg1OS44MXpNNjAgNTguOVY2MGgtLjA5QTYwIDYwIDAgMCAwIDAgLjFWMGgxLjFhNjAgNjAgMCAwIDAgNTguOCA1OC45eiIgZmlsbD0iIzIyMiIgZmlsbC1vcGFjaXR5PSIuMyIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+')] opacity-30"></div>
      
      <Card className="relative w-full max-w-4xl p-8 bg-gray-900/40 border-gray-800/40 backdrop-blur-md shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-lg"></div>
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Value Proposition */}
          <div className="space-y-8">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-white">
                  SQL 4 All
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-yellow-500/80">powered by</span>
                  <Image
                    src="https://pglite.dev/img/brand/logo.svg"
                    alt="PGLite"
                    width={80}
                    height={24}
                    priority
                  />
                </div>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent opacity-50"></div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="prose prose-sm prose-invert">
                  <p className="text-gray-300">
                    Aprende SQL desde Cero
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-2 bg-blue-500/10 rounded-lg">
                    <Image src="/globe.svg" alt="Global" width={20} height={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">100% en la Nube</h4>
                    <p className="text-sm text-gray-300">
                      Sólo necesitas un navegador para aprender SQL :)
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-2 bg-blue-500/10 rounded-lg">
                    <Image src="/window.svg" alt="Window" width={20} height={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Tecnología WebAssembly</h4>
                    <p className="text-sm text-gray-300">
                      PgLite utiliza WebAssembly (WASM) y es lo que hace posible que se ejecute en cualquier navegador.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="mt-1 p-2 bg-blue-500/10 rounded-lg">
                    <Image src="/file.svg" alt="File" width={20} height={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Aprende a tu ritmo sin afanes 🧘</h4>
                    <p className="text-sm text-gray-300">
                      Ejercicios estructurados para dominar los fundamentos de SQL
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/10 p-4 rounded-lg">
              <a 
                href="https://pglite.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-300 hover:text-white flex items-center justify-between"
              >
                <span>Conoce más sobre la tecnología PGLite</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-2">
                  <path d="M7 7h10v10"/><path d="M7 17 17 7"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white">
                Comienza tu Viaje en SQL
              </h3>
              <p className="text-sm text-gray-400">
                Únete a nuestra comunidad de aprendizaje
              </p>
            </div>

            <div className="space-y-4">
              <Button
                onClick={signInWithGoogle}
                className="w-full flex items-center justify-center space-x-2 bg-white/90 hover:bg-white text-gray-900 font-medium py-6 rounded-xl transition-all hover:shadow-xl hover:shadow-blue-500/10 backdrop-blur-sm"
              >
                <Image
                  src="/google.svg"
                  alt="Google"
                  width={24}
                  height={24}
                  className="mr-2"
                />
                <span>Continuar con Google</span>
              </Button>

              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full py-6 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/10 hover:text-yellow-400 transition-all"
                  >
                    <span className="mr-2">✨</span>
                    Ver cómo funciona
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] bg-gray-900/95 border-gray-800">
                  <DialogTitle className="text-xl font-semibold text-white">
                    Así funciona SQL 4 All
                  </DialogTitle>
                  <div className="space-y-6 pt-4">
                    <div className="aspect-video w-full bg-gray-900 rounded-lg overflow-hidden relative">
                      <Image
                        src="/demo-sql4all.gif"
                        alt="Demo de SQL 4 All"
                        fill
                        className="object-contain"
                        priority
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <span className="text-yellow-500">1</span>
                        </div>
                        <p className="text-gray-300">Escribe consultas SQL en editor</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <span className="text-yellow-500">2</span>
                        </div>
                        <p className="text-gray-300">Ejecuta el código directamente en tu navegador</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                          <span className="text-yellow-500">3</span>
                        </div>
                        <p className="text-gray-300">Recibe retroalimentación instantánea</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <p className="text-center text-xs text-gray-400">
              Al iniciar sesión, aceptas nuestros{' '}
              <a href="#" className="text-blue-400 hover:underline">Términos de Servicio</a>
              {' '}y{' '}
              <a href="#" className="text-blue-400 hover:underline">Política de Privacidad</a>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
} 