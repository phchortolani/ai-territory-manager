'use client'
import { Fragment, useEffect, useState } from 'react'
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, UserCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { ChevronDownIcon, ExitIcon } from '@radix-ui/react-icons'

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function Navbar({ children }: { children: React.ReactNode }) {
    const path = usePathname()
    const { signOut, user } = useAuth()
    const [navigation, setNavigation] = useState(
        [
            { name: 'Calendário', href: 'schedule', current: true },
            /*    { name: 'Saídas', href: 'saida', current: false }, */
            { name: 'Territórios', href: 'territories', current: false },
            { name: 'Download', href: 'downloads', current: false },
            { name: 'TPL', href: 'brothers', current: false },
        ])

    useEffect(() => {
        if (path) {
            let temp = [...navigation]
            temp.forEach(x => {
                x.current = (path.split('/')[1] == x.href)
            });
            setNavigation(temp)
        }
    }, [path])

    return (
        <>
            <div className="min-h-full">
                <Disclosure as="nav" className="bg-[#292929]">
                    {({ open }) => (
                        <>
                            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className=''>
                                            <svg className='w-max rounded-lg p-0.5' viewBox="0.196 -3.387 502.027 509.369" width="72.027" height="79.369">
                                                <rect x="0.196" y="-3.387" width="502.027" height="509.369" style={{ stroke: 'rgb(74, 109, 167)', strokeWidth: '0px', fill: 'rgb(74, 109, 167)' }} transform="matrix(1.0000000000000002, 0, 0, 1, 0, -7.105427357601002e-15)"></rect>
                                                <text style={{ fill: 'rgb(255, 255, 255)', fontFamily: 'Calibri', fontSize: '9.50196px', letterSpacing: '-0.6px', strokeMiterlimit: '5.69', strokeWidth: '0px', textAnchor: 'middle', whiteSpace: 'pre' }} transform="matrix(9.15590763092041, 0, 0, 9.156008720397951, 247.4332617436835, 333.302434165812)">Alto do Baeta</text>
                                                <text style={{ fill: 'rgb(255, 255, 255)', fontFamily: 'Calibri', fontSize: '9.50196px', fontWeight: '700', letterSpacing: '-0.6px', strokeMiterlimit: '4.72', strokeWidth: '0px', textAnchor: 'middle', whiteSpace: 'pre' }} transform="matrix(9.15590763092041, 0, 0, 9.156008720397951, 251.10866157872465, 219.5394624999085)">Território e TPL</text>
                                            </svg>
                                        </div>
                                        <div className="hidden md:block">
                                            <div className="ml-10 flex items-baseline space-x-4">
                                                {navigation.map((item) => (
                                                    <Link
                                                        key={item.name}
                                                        href={item.href}
                                                        className={classNames(
                                                            item.current
                                                                ? 'bg-gray-500 text-white'
                                                                : 'text-gray-300 hover:bg-gray-900 hover:text-white',
                                                            'rounded-md px-3 py-2 text-sm font-medium'
                                                        )}
                                                        aria-current={item.current ? 'page' : undefined}
                                                    >
                                                        {item.name}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="hidden md:block">
                                        <div className="ml-4 flex items-center md:ml-6">
                                            {/*      <button
                                                type="button"
                                                className="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                            >
                                                <span className="absolute -inset-1.5" />
                                                <span className="sr-only">View notifications</span>
                                                <BellIcon className="h-6 w-6" aria-hidden="true" />
                                            </button> */}

                                            {/* Profile dropdown */}
                                            <Menu as="div" className="relative ml-3">
                                                <div>
                                                    <Menu.Button className="relative  hover:ring-2 group font-semibold transition-all duration-150  px-4 py-1 flex max-w-xs items-center rounded-full  text-sm focus:outline-none ">
                                                        <span className="absolute -inset-1.5" />
                                                        <span className="sr-only">Open user menu</span>
                                                        <div className='flex group flex-row gap-2  justify-between items-center '>
                                                            <UserCircleIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                                            <span className='text-white'>{user?.name}</span>
                                                            <ChevronDownIcon className="h-5 w-5  text-white opacity-90 group-hover:opacity-100" aria-hidden="true" />
                                                        </div>
                                                    </Menu.Button>
                                                </div>
                                                <Transition
                                                    as={Fragment}
                                                    enter="transition ease-out duration-100"
                                                    enterFrom="transform opacity-0 scale-95"
                                                    enterTo="transform opacity-100 scale-100"
                                                    leave="transition ease-in duration-75"
                                                    leaveFrom="transform opacity-100 scale-100"
                                                    leaveTo="transform opacity-0 scale-95"
                                                >
                                                    <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                                        <Menu.Item key={'sair_key'}>
                                                            {({ active }) => (
                                                                <div onClick={signOut} className={classNames(active ? 'font-medium' : '', 'flex flex-row justify-start items-center text-red-700 px-4 py-2 text-sm  cursor-pointer')}>
                                                                    <ExitIcon className="mr-2 h-4 w-4" aria-hidden="true" /> Sair
                                                                </div>
                                                            )}
                                                        </Menu.Item>
                                                    </Menu.Items>
                                                </Transition>
                                            </Menu>
                                        </div>
                                    </div>
                                    <div className="-mr-2 flex md:hidden">
                                        {/* Mobile menu button */}
                                        <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                                            <span className="absolute -inset-0.5" />
                                            <span className="sr-only">Open main menu</span>
                                            {open ? (
                                                <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                                            ) : (
                                                <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                                            )}
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </div>

                            <Disclosure.Panel className="md:hidden">
                                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                                    {navigation.map((item) => (
                                        <Disclosure.Button
                                            key={item.name}
                                            as="a"
                                            href={item.href}
                                            className={classNames(
                                                item.current ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                                                'block rounded-md px-3 py-2 text-base font-medium'
                                            )}
                                            aria-current={item.current ? 'page' : undefined}
                                        >
                                            {item.name}
                                        </Disclosure.Button>
                                    ))}
                                </div>
                                <div className="border-t border-gray-700 pb-3 pt-4">
                                    <div className="flex items-center px-5">
                                        <div className="flex-shrink-0">
                                            <UserCircleIcon className="h-8 w-8 text-white" aria-hidden="true" />
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-base font-medium leading-none text-white">{user?.name}</div>
                                        </div>
                                        {/*         <button
                                            type="button"
                                            className="relative ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                        >
                                            <span className="absolute -inset-1.5" />
                                            <span className="sr-only">View notifications</span>
                                            <BellIcon className="h-6 w-6" aria-hidden="true" />
                                        </button> */}
                                    </div>
                                    <div className="mt-3 space-y-1 px-2">
                                        <Disclosure.Button
                                            key={'sair_key_2'}
                                            onClick={signOut}
                                            className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
                                        >
                                            Sair
                                        </Disclosure.Button>
                                    </div>
                                </div>
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>

                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-4 lg:px-8">
                        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{navigation.find(x => x.current == true)?.name}</h1>
                    </div>
                </header>
                <main>
                    <div className='grid justify-center pt-4'>{children}</div>
                </main>
            </div>
        </>
    )
}
