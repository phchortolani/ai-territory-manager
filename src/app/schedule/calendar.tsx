'use client'
import { Menu, Transition } from '@headlessui/react'
import { ChevronRightIcon, ChevronLeftIcon, ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon, BriefcaseIcon, VideoCameraIcon } from '@heroicons/react/24/outline'
import {
    add,
    addDays,
    addMilliseconds,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    getDay,
    isBefore,
    isEqual,
    isMonday,
    isSameDay,
    isSameMonth,
    isToday,
    isTuesday,
    parse,
    parseISO,
    startOfToday,
    startOfWeek
} from 'date-fns'
import { Fragment, useState } from 'react'

import { ptBR } from 'date-fns/locale'
import { RoundsDto } from '@/dtos/roundsDto'
import { EStatus_territory } from '@/enums/status_territory'




function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

type props = {
    schedule: RoundsDto[]
}

export default function Calendar({ schedule = [] }: props) {
    let today = startOfToday();


    let [selectedDay, setSelectedDay] = useState(today)
    let [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date())





    let days = eachDayOfInterval({
        start: startOfWeek(firstDayCurrentMonth),
        end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
    })

    function previousMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    function nextMonth() {
        let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
        setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'))
    }

    let selectedDayRounds = schedule?.filter((round) =>
        isSameDay(parseISO(round.first_day.toString()), selectedDay) || (round?.last_day && isSameDay(parseISO(round.last_day.toString()), selectedDay))
    )

    function checkStatus(day: Date) {
        const round = schedule.filter(x => isSameDay(parseISO(x.first_day.toString()), day) || (x?.last_day && isSameDay(parseISO(x?.last_day.toString()), day)))
        const isDone = round.filter(x => x.status == EStatus_territory[1])
        const running = round.filter(x => x.status == EStatus_territory[2])

        if (running.length > 0) {
            if (running.some(x => isBefore(x.expected_return, today))) return <ExclamationTriangleIcon className={`w-5 h-5  text-white p-0.5 rounded-full bg-orange-500 animate-bounce`} />
            return <BriefcaseIcon className={`w-5 h-5  text-white p-0.5 rounded-full bg-red-500`} />
        }
        else if (isDone.length == round.length) return <CheckCircleIcon className={`w-5 h-5 text-white rounded-full bg-green-500`} />
        else return <CheckCircleIcon className={`w-5 h-5 text-white rounded-full bg-blue-500`} />
    }

    return (
        <div className="pt-16">
            <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-4xl md:px-6">
                <div className="md:grid md:grid-cols-2 md:divide-x md:divide-gray-200">
                    <div className="md:pr-14">
                        <div className="flex items-center">
                            <h2 className="flex-auto font-semibold text-gray-900">
                                {format(firstDayCurrentMonth, 'MMMM yyyy', { locale: ptBR })}
                            </h2>
                            <button
                                type="button"
                                onClick={previousMonth}
                                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Previous month</span>
                                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                            </button>
                            <button
                                onClick={nextMonth}
                                type="button"
                                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Next month</span>
                                <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
                            </button>
                        </div>
                        <div className="grid grid-cols-7 mt-10 text-xs leading-6 text-center text-gray-500">
                            <div>DOM</div>
                            <div>SEG</div>
                            <div>TER</div>
                            <div>QUA</div>
                            <div>QUI</div>
                            <div>SEX</div>
                            <div>SAB</div>
                        </div>
                        <div className="grid grid-cols-7 mt-2 text-sm rounded-md shadow">
                            {days.map((day, dayIdx) => (
                                <div
                                    key={day.toString()}
                                    className={classNames(
                                        dayIdx === 0 && colStartClasses[getDay(day)],
                                        'py-2 flex flex-col justify-center items-center text-md  shadow'
                                    )}
                                >
                                    <button
                                        type="button"
                                        onClick={() => setSelectedDay(day)}
                                        className={classNames(
                                            isEqual(day, selectedDay) && 'text-white',
                                            !isEqual(day, selectedDay) &&
                                            isToday(day) &&
                                            'text-red-500',
                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-gray-900  font-bold',
                                            !isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            !isSameMonth(day, firstDayCurrentMonth) &&
                                            'text-gray-400',
                                            isEqual(day, selectedDay) && isToday(day) && 'bg-red-500',
                                            isEqual(day, selectedDay) &&
                                            !isToday(day) &&
                                            'bg-gray-900',
                                            !isEqual(day, selectedDay) && 'hover:bg-gray-200',
                                            (isEqual(day, selectedDay) || isToday(day)) &&
                                            'font-semibold',
                                            'mx-auto flex h-8 w-8 mb-2 items-center justify-center rounded-full'
                                        )}
                                    >
                                        <time dateTime={format(day, 'yyyy-MM-dd')}>
                                            {format(day, 'd')}
                                        </time>
                                    </button>

                                    <div>
                                        {schedule.some((round) => isSameDay(parseISO(round.first_day.toString()), day) || (round.last_day && isSameDay(parseISO(round.last_day.toString()), day))) ?
                                            (
                                                <div className={`flex flex-initial rounded-md `}>
                                                    {checkStatus(day)}
                                                </div>
                                            ) : <>
                                                {(isMonday(day) || isTuesday(day)) ? <VideoCameraIcon className={`w-5 h-5 p-1 text-white rounded-full bg-blue-300/50`} />
                                                    : <XCircleIcon className={`w-5 h-5 text-white rounded-full bg-gray-300/50`} />}

                                            </>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <section className="mt-12 md:mt-0 md:pl-14">
                        <h2 className="font-semibold text-gray-900">
                            Agendamento para{' '}
                            <time dateTime={format(selectedDay, 'dd-MM-yyyy', { locale: ptBR })}>
                                {format(selectedDay, 'dd/MM/yyyy', { locale: ptBR })}
                            </time>
                        </h2>
                        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">

                            {selectedDayRounds.length > 0 ? (
                                <>
                                    <p className="text-gray-900 font-semibold capitalize">{selectedDayRounds[0].leader.toLocaleLowerCase()}</p>
                                    <p className="mt-0.5">
                                        <time dateTime={selectedDayRounds[0].first_day.toString()}>
                                            {format(selectedDayRounds[0].first_day, 'dd/MM/yyyy')}
                                        </time>{' '}
                                        -{' '}
                                        <time dateTime={selectedDayRounds[0].last_day?.toString() ?? selectedDayRounds[0].first_day.toString()}>
                                            {format(selectedDayRounds[0]?.last_day ?? selectedDayRounds[0].first_day, 'dd/MM/yyyy')}
                                        </time>
                                    </p>
                                    {selectedDayRounds.map((round: any) => (
                                        <Round key={round.id} round={round} />
                                    ))}
                                </>

                            ) : (
                                <>
                                    {isMonday(selectedDay) || isTuesday(selectedDay) ? <>Não é possível agendar em dias que o campo é somente pelo ZOOM.</> : <><p>Nenhum território agendado para este dia.</p>
                                        <button className='px-2.5 py-1.5 text-blue-500 border border-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-all hover:font-semibold'>Agendar</button></>
                                    }

                                </>
                            )}
                        </ol>
                    </section>
                </div>
            </div>
        </div>
    )
}

function Round({ round }: { round: RoundsDto }) {

    let icon = <></>

    if (round.status == EStatus_territory[2]) {


        if (isBefore(round.expected_return, startOfToday())) {
            icon = <ExclamationTriangleIcon className={`w-4 h-4  text-white p-0.5 rounded-full bg-orange-500 animate-bounce`} />
        } else {
            icon = <BriefcaseIcon className={`w-4 h-4 text-white p-0.5 rounded-full bg-red-500`} />
        }
    }
    else if (round.status == EStatus_territory[1]) icon = <CheckCircleIcon className={`w-4 h-4 text-white rounded-full bg-green-500`} />
    else icon = <CheckCircleIcon className={`w-4 h-4 text-white rounded-full bg-blue-500`} />


    return (
        <li className="flex items-center px-2 shadow py-2 transition-all hover:scale-105  space-x-4 group rounded-xl  focus-within:bg-gray-100 hover:bg-gray-100 ">
            <div className="flex flex-row gap-2 flex-1 pl-4">
                <img className="w-32   items-center flex-none rounded-md  bg-gray-50" src={`${round.territory_id}.png`} alt="" />
                <div className='flex flex-col flex-1 '>

                    <div className='flex gap-2 justify-between '>
                        <div className=" truncate text-md font-bold leading-5 text-gray-500 flex items-center  justify-start gap-2">{round.territory_id}</div>
                        <div>
                            {icon}
                        </div>
                    </div>
                    <div className="mb-2 truncate text-xs leading-5 text-gray-500 flex items-center  justify-start gap-2">{round.status}</div>

                </div>
            </div>
            {/* <Menu
                as="div"
                className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100"
            >
                <div className='px-4'>
                    <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
                        <span className="sr-only">Open options</span>
                        <AdjustmentsVerticalIcon className="w-6 h-6" aria-hidden="true" />
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
                    <Menu.Items className="absolute right-0 z-10 mt-2 origin-top-right bg-white rounded-md shadow-lg w-36 ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div className="py-1">
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        Edit
                                    </a>
                                )}
                            </Menu.Item>
                            <Menu.Item>
                                {({ active }) => (
                                    <a
                                        href="#"
                                        className={classNames(
                                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                            'block px-4 py-2 text-sm'
                                        )}
                                    >
                                        Cancel
                                    </a>
                                )}
                            </Menu.Item>
                        </div>
                    </Menu.Items>
                </Transition>
            </Menu> */}
        </li>
    )
}

let colStartClasses = [
    '',
    'col-start-2',
    'col-start-3',
    'col-start-4',
    'col-start-5',
    'col-start-6',
    'col-start-7',
]
