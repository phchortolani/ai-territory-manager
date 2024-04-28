import { HTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

interface iProps extends HTMLAttributes<HTMLButtonElement> {
    typeBtn: 'primary' | 'secondary' | 'success_primary' | 'success_secondary' | 'danger' | 'danger_secondary',
    type?: "submit" | "reset" | "button" | undefined,
    children: React.ReactNode,
    loading?: {
        isLoading: boolean,
        message: string
    }
}

export function SimpleButton({ typeBtn, children, className, loading, ...rest }: iProps) {
    const type = {
        primary: 'text-white border-blue-500 bg-blue-500 hover:text-blue-500 hover:bg-blue-200 transition-all hover:font-semibold',
        secondary: 'text-blue-500 border-blue-500 hover:bg-blue-500 hover:text-white transition-all hover:font-semibold',
        success_primary: 'text-white border-green-500 bg-green-500 hover:text-green-500 hover:bg-green-200 transition-all hover:font-semibold',
        success_secondary: 'text-green-500 border-green-500 hover:bg-green-500 hover:text-white transition-all hover:font-semibold',
        danger: 'text-white border-red-500 bg-red-500 hover:text-red-500 hover:bg-red-200 transition-all hover:font-semibold',
        danger_secondary: 'text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition-all hover:font-semibold'
    }
    return <button {...rest} type={rest.type} disabled={loading?.isLoading} className={twMerge('px-2.5 py-2 border rounded-md w-max ', type[typeBtn], className)}>
        {loading?.isLoading ? <div className='flex flex-col md:flex-row gap-2'>
            {loading.message} <span className='animate-spin'>⏳</span>
        </div> :
            children
        }

    </button>
}