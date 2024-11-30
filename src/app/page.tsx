'use client'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, UserSchema } from '@/models/user';
import { AtSymbolIcon, EyeIcon } from '@heroicons/react/24/outline';
import { LockClosedIcon } from '@radix-ui/react-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { toast } from '@/hooks/use-toast';
export default function LoginPage() {
  const { signIn, home, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { handleSubmit, register } = useForm<User>({ resolver: zodResolver(UserSchema) });

  const submit = async (data: User) => {
    signIn(data).then((res) => {
      if (res.status) {
        router.replace(home)
      } else if (res?.message) toast({
        title: res?.message,
        className: 'bg-red-500 text-white',
      })
    }).catch(x => toast({
      title: "Ops...",
      description: x.message,
      className: 'bg-red-500 text-white',
    }))

  };

  if (isAuthenticated == undefined) return null

  if (isAuthenticated) {
    router.replace(home)
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-sm w-full space-y-8">
        <div className='flex justify-center items-center flex-col'>
          <div>
            <svg className='w-max rounded-lg p-0.5' viewBox="0.196 -3.387 502.027 509.369" width="72.027" height="79.369">
              <rect x="0.196" y="-3.387" width="502.027" height="509.369" style={{ stroke: 'rgb(74, 109, 167)', strokeWidth: '0px', fill: 'rgb(74, 109, 167)' }} transform="matrix(1.0000000000000002, 0, 0, 1, 0, -7.105427357601002e-15)"></rect>
              <text style={{ fill: 'rgb(255, 255, 255)', fontFamily: 'Calibri', fontSize: '9.50196px', letterSpacing: '-0.6px', strokeMiterlimit: '5.69', strokeWidth: '0px', textAnchor: 'middle', whiteSpace: 'pre' }} transform="matrix(9.15590763092041, 0, 0, 9.156008720397951, 247.4332617436835, 333.302434165812)">Alto do Baeta</text>
              <text style={{ fill: 'rgb(255, 255, 255)', fontFamily: 'Calibri', fontSize: '9.50196px', fontWeight: '700', letterSpacing: '-0.6px', strokeMiterlimit: '4.72', strokeWidth: '0px', textAnchor: 'middle', whiteSpace: 'pre' }} transform="matrix(9.15590763092041, 0, 0, 9.156008720397951, 251.10866157872465, 219.5394624999085)">Território e TPL</text>
            </svg>
          </div>

          <div>
            <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900">
              Faça seu login
            </h2>
          </div>
        </div>
        <form className="mt-8 space-y-6" onSubmit={(handleSubmit(submit))}>
          <div className="rounded-md shadow-sm flex gap-2 flex-col -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSymbolIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  {...register('email')}
                  type="email"
                  className="appearance-none rounded-t-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="E-mail"
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  onClick={(e) => setShowPassword(false)}
                  className={`appearance-none rounded-b-md relative block w-full px-10 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 ${showPassword ? 'focus:ring-blue-500' : 'focus:ring-transparent'} focus:ring-blue-500 focus:border-blue-500`}
                  placeholder="Senha"
                />
                <div onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer">
                  <EyeIcon className={`h-5 w-5 ${showPassword ? 'text-blue-500' : 'text-gray-400'}`} />
                </div>
              </div>
            </div>
          </div>

          <div>
            <Button type="submit" className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Entrar
            </Button>
          </div>
          <div className="flex items-center justify-between">

            {/* 
            <div className="text-sm flex justify-center w-full">
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Esqueceu sua senha?
              </a>
            </div> */}
          </div>



          {/*    <div className="text-center">
            <p className="mt-2 text-sm text-gray-600">
              Não tem uma conta?{' '}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                Cadastre-se
              </a>
            </p>
          </div> */}
        </form>
      </div>
    </div>
  );


}