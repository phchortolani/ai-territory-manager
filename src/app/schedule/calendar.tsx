'use client'
import { ChevronRightIcon, ChevronLeftIcon, ExclamationTriangleIcon, CheckCircleIcon, XCircleIcon, BriefcaseIcon, VideoCameraIcon, ArrowDownCircleIcon } from '@heroicons/react/24/outline'
import {
    add,
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
import { useState } from 'react'

import { ptBR } from 'date-fns/locale'
import { RoundsDto } from '@/dtos/roundsDto'
import { EStatus_territory } from '@/enums/status_territory'
import { SimpleButton } from '@/components/buttons/simple_button'
import { MarkRoundAsDone } from '@/services/roundsService'
import { useRouter } from 'next/navigation'




function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}

type props = {
    schedule: RoundsDto[]
}

interface IListRoundsByLeaders {
    leader: string,
    rounds: RoundsDto[]
}

export default function Calendar({ schedule = [] }: props) {
    let today = startOfToday();
    const [modalOpen, setOpenModal] = useState<boolean>(false)
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    const [edit, setEdit] = useState<boolean>(false)


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


    function generateListOfRoundsByLeader(selectedRoundsofDay: RoundsDto[]) {
        const leaders: string[] = []
        const rounds_by_leaders: { leader: string, rounds: RoundsDto[] }[] = []

        selectedRoundsofDay.forEach(x => {
            if (!leaders.some(registro => registro == x.leader)) leaders.push(x.leader);
        })

        leaders.forEach(leader => {
            const roundsofleader = selectedDayRounds.filter(x => x.leader === leader)
            if (!rounds_by_leaders.some(x => x.leader == leader)) rounds_by_leaders.push({ leader, rounds: roundsofleader.sort((a, b) => a.territory_id - b.territory_id) })
        })

        return rounds_by_leaders
    }

    const rounds_by_leaders = generateListOfRoundsByLeader(selectedDayRounds)




    return (
        <div>
            <dialog className='w-screen h-screen fixed z-50 bg-gray-400/30 top-0 overflow-hidden ' open={modalOpen}>
                <div className='h-[calc(100%-2rem)] mx-1 md:mx-8 my-2  flex justify-center items-center bg-white rounded-md shadow-lg'>
                    <SimpleButton typeBtn='secondary' onClick={() => setOpenModal(false)}>
                        Cancelar
                    </SimpleButton>
                </div>

            </dialog>
            <div className="max-w-md px-4 sm:px-7 md:max-w-4xl md:px-6">
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
                                <span className="sr-only">Mês Anterior</span>
                                <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
                            </button>
                            <button
                                onClick={nextMonth}
                                type="button"
                                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
                            >
                                <span className="sr-only">Próximo Mês</span>
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
                            {rounds_by_leaders[0]?.rounds[0]?.campaign && <div className='text-sm text-gray-400'>{rounds_by_leaders[0].rounds[0].campaign}</div>}
                        </h2>
                        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
                            {
                                rounds_by_leaders.length > 0 && <div className='flex justify-end border-b'>
                                    {edit ?
                                        <SimpleButton onClick={() => setEdit(false)} typeBtn='secondary' className='mb-2'>
                                            <div className='flex flex-row gap-2 justify-between items-center'><ArrowDownCircleIcon className='w-5 h-5' /> Fechar edição</div>
                                        </SimpleButton>
                                        : <div className='flex flex-row gap-2'>
                                            <SimpleButton onClick={() => setEdit(true)} typeBtn='secondary' className='border-none mb-2'>Editar</SimpleButton>
                                        </div>
                                    }
                                </div>
                            }


                            {rounds_by_leaders.length > 0 ? rounds_by_leaders.map(x =>
                                <div key={x.leader} className='border-b  p-2 '>
                                    <p className="text-gray-900 font-semibold capitalize">{x.leader.toLocaleLowerCase()}</p>
                                    <p className="mt-0.5">
                                        <time dateTime={x.rounds[0].first_day.toString()}>
                                            {format(x.rounds[0].first_day, 'dd/MM/yyyy')}
                                        </time>{' '}
                                        -{' '}
                                        <time dateTime={x.rounds[0].last_day?.toString() ?? x.rounds[0].first_day.toString()}>
                                            {format(x.rounds[0]?.last_day ?? x.rounds[0].first_day, 'dd/MM/yyyy')}
                                        </time>
                                    </p>
                                    {x.rounds.map((round: any) => (
                                        <Round key={round.id} round={round} edit={edit} />
                                    ))}
                                </div>

                            ) : (
                                <>
                                    {isMonday(selectedDay) || isTuesday(selectedDay) ? <>
                                        Não é possível agendar em dias que o campo é somente pelo ZOOM.</> :
                                        <div className='flex flex-col gap-2'>
                                            <p>Nenhum território agendado para este dia.</p>
                                            <SimpleButton onClick={() => setOpenModal(true)} typeBtn='primary'>
                                                Agendar
                                            </SimpleButton>
                                        </div>
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


function Round({ round, edit }: { round: RoundsDto, edit: boolean }) {
    const [isLoadingMarkAsDone, setIsLoadingMarkAsDone] = useState<boolean>(false);
    const router = useRouter()
    let showQuestionIfWorked = false

    async function ChangeStatusRound(round: RoundsDto, status: number) {
        setIsLoadingMarkAsDone(true)
        await MarkRoundAsDone(round, status).then(result => {
            if (result) router.refresh()
        }).finally(() => {
            setIsLoadingMarkAsDone(false)
        })

    }

    let icon = <></>

    if (round.status == EStatus_territory[2]) {
        if (isBefore(round.expected_return, startOfToday())) {
            showQuestionIfWorked = true
            icon = <ExclamationTriangleIcon className={`w-4 h-4  text-white p-0.5 rounded-full bg-orange-500 animate-bounce`} />
        } else {
            icon = <BriefcaseIcon className={`w-4 h-4 text-white p-0.5 rounded-full bg-red-500`} />
        }
    }
    else if (round.status == EStatus_territory[1]) icon = <CheckCircleIcon className={`w-4 h-4 text-white rounded-full bg-green-500`} />
    else icon = <CheckCircleIcon className={`w-4 h-4 text-white rounded-full bg-blue-500`} />


    return (
        <li className="flex py-2.5 pr-2 transition-all  ">
            <div className="flex flex-row gap-2 flex-1 pl-4 ">
                <img className="w-36   h-max items-center flex-none rounded-md  bg-gray-50 " src={`${round.territory_id}.png`} alt="" />
                <div className='flex flex-col flex-1 '>
                    <div className='flex gap-2 justify-between '>
                        <div className=" truncate text-md font-bold leading-5 text-gray-500 flex items-center  justify-start gap-2">{round.territory_id}</div>
                        <div className='flex flex-row gap-2 rounded-full items-center'>
                            {!edit && round.status}
                            {icon}
                        </div>
                    </div>
                    {/*  <div className="mb-2 truncate text-xs leading-5 text-gray-500 flex items-center  justify-start gap-2">{round.status}</div> */}
                    {
                        (showQuestionIfWorked || edit && round.status == EStatus_territory[2])
                        && <div className='flex flex-col '>
                            <b className='text-xs py-2'>Foi Trabalhado?</b>
                            <div className='flex flex-row'>
                                <SimpleButton typeBtn='success_secondary' loading={{ isLoading: isLoadingMarkAsDone, message: "Finalizando..." }} onClick={() => ChangeStatusRound(round, 1)} className='border-none'>Sim</SimpleButton>
                                {!isLoadingMarkAsDone && <SimpleButton typeBtn='danger_secondary' onClick={() => ChangeStatusRound(round, 3)} className='border-none'>Não</SimpleButton>}
                            </div>
                        </div>
                    }
                    {
                        (edit && round.status != EStatus_territory[2])
                        && <div className='flex flex-col '>
                            <b className='text-xs py-2'>Alterar para em uso?</b>
                            <div className='flex flex-row'>
                                <SimpleButton typeBtn='success_secondary' loading={{ isLoading: isLoadingMarkAsDone, message: "Alterando para uso..." }} onClick={() => ChangeStatusRound(round, 2)} className='border-none'>Sim</SimpleButton>
                            </div>
                        </div>
                    }

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
