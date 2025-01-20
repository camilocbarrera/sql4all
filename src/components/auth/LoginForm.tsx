'use client'

import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import Image from 'next/image'

export function LoginForm() {
  const { signInWithGoogle } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-4xl p-8 bg-gray-800 border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Value Proposition */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-white mb-2">
                SQL 4 All
              </h2>
              <p className="text-xl text-gray-300 font-semibold">
                Aprende SQL sin instalar nada
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <Image src="/globe.svg" alt="Global" width={20} height={20} className="text-blue-500" />
                </div>
                <p className="text-gray-300">
                  Plataforma 100% en la nube para aprender SQL de forma interactiva
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <Image src="/file.svg" alt="File" width={20} height={20} />
                </div>
                <p className="text-gray-300">
                  Ejercicios prácticos y progresivos para dominar SQL
                </p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="mt-1">
                  <Image src="/window.svg" alt="Window" width={20} height={20} />
                </div>
                <p className="text-gray-300">
                  SQL será el próximo Excel - Prepárate para el futuro de los datos
                </p>
              </div>
            </div>

            <Separator className="bg-gray-700" />

            <div className="bg-gray-900/50 p-4 rounded-lg">
              <p className="text-gray-400 text-sm italic">
                "SQL sigue siendo y será una de las habilidades del futuro debido a la generación masiva de datos. Dominar SQL te abrirá las puertas al mundo del análisis de datos."
              </p>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-white mb-2">
                Comienza tu viaje en SQL
              </h3>
              <p className="text-sm text-gray-400">
                Únete a nuestra comunidad de aprendizaje
              </p>
            </div>

            <Button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center space-x-2 bg-white hover:bg-gray-100 text-gray-900 font-medium py-6 rounded-lg transition-colors"
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