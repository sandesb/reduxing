import { UserAuthForm } from './components/user-auth-form'
import ViteLogo from '../../../assets/logo/dark without name.png'
export default function SignIn() {
  return (
    <div>
      <div className='container relative grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
        <div className='relative hidden h-full flex-col bg-muted p-10 text-gray-50 dark:border-r lg:flex'>
          <div className='absolute inset-0 bg-zinc-900' />
        

          <img
            src={ViteLogo}
            className='relative m-auto'
            width={500}
            height={60}
            alt='Vite'
          />

          <div className='relative z-20 mt-auto'>
            <blockquote className='space-y-2'>
              <p className='text-lg'>
                &ldquo;ACADEMIX is an innovative educational platform designed to streamline learning and content management for students and educators.&rdquo;
              </p>
              <footer className='text-sm'>- Yuvraj Acharya (CTO, Clock B Tech)</footer>
            </blockquote>
          </div>
        </div>
        <div className='lg:p-8'>
          <div className='mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[350px]'>
            <div className='flex flex-col space-y-2 text-left'>
              <h1 className='text-2xl font-semibold tracking-tight'>Login</h1>
            
            </div>
            <UserAuthForm />
        
          </div>
        </div>
      </div>
      </div>
  )
}
