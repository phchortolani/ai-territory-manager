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
    parse,
    parseISO,
    startOfToday,
    startOfWeek
} from 'date-fns'
import { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { ptBR } from 'date-fns/locale'
import { RoundsDto } from '@/dtos/roundsDto'
import { EStatus_territory } from '@/enums/status_territory'
import { SimpleButton } from '@/components/buttons/simple_button'
import { DeleteRound, getRoundsByStatus, MarkRoundAsDone, Schedule } from '@/services/roundsService'
import { useRouter } from 'next/navigation'
import { getLeaders } from '@/services/scheduleService'
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod'
import { ISchedule } from '@/dtos/schedule'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ThreeDot } from 'react-loading-indicators'
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DialogTitle } from '@radix-ui/react-dialog'
import { Pencil1Icon, PlusIcon, TrashIcon } from '@radix-ui/react-icons'
import { toast } from '@/hooks/use-toast'



function classNames(...classes: any[]) {
    return classes.filter(Boolean).join(' ')
}


const schema = z.object({
    leader_id: z.number(),
    repeat_next_week: z.boolean().optional().default(false),
}).required()

export default function Calendar() {
    let today = startOfToday();
    const queryClient = useQueryClient()
    const [modalOpen, setOpenModal] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [selectedDay, setSelectedDay] = useState(today)
    const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'))
    const [edit, setEdit] = useState<boolean>(false)
    const [msg, setMsg] = useState<string>("")
    const [isDeleting, setIsDeleting] = useState<boolean>(false)

    const { data: schedule, isLoading, refetch } = useQuery({ queryFn: async () => await getRoundsByStatus(), queryKey: ["getRoundsByStatus"], cacheTime: 10000, refetchOnWindowFocus: false });
    const { data: leaders } = useQuery({
        queryFn: async () => await getLeaders(),
        queryKey: ["getLeaders"],
        refetchOnWindowFocus: false,
        cacheTime: 10000,
    });


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

    let selectedDayRounds = schedule?.filter((round: RoundsDto) => isSameDay(parseISO(round.first_day.toString()), selectedDay) || (round?.last_day && isSameDay(parseISO(round.last_day.toString()), selectedDay)))

    function checkStatus(day: Date) {
        const round = schedule?.filter(x => isSameDay(parseISO(x.first_day.toString()), day) || (x?.last_day && isSameDay(parseISO(x?.last_day.toString()), day)))
        const isDone = round?.filter(x => x.status == EStatus_territory[1])
        const running = round?.filter(x => x.status == EStatus_territory[2])

        if ((running?.length ?? 0) > 0) {
            if (running?.some(x => isBefore(x.expected_return, today))) return <ExclamationTriangleIcon className={`w-5 h-5  text-white p-0.5 rounded-full bg-orange-500 animate-bounce`} />
            return <BriefcaseIcon className={`w-5 h-5  text-white p-0.5 rounded-full bg-red-500`} />
        }
        else if (isDone?.length == round?.length) return <CheckCircleIcon className={`w-5 h-5 text-white rounded-full bg-green-500`} />
        else return <CheckCircleIcon className={`w-5 h-5 text-white rounded-full bg-blue-500`} />
    }


    function generateListOfRoundsByLeader(selectedRoundsofDay: RoundsDto[]) {
        const leaders: string[] = []
        const rounds_by_leaders: { leader: string, rounds: RoundsDto[] }[] = []

        selectedRoundsofDay?.forEach(x => {
            if (!leaders.some(registro => registro == x.leader)) leaders.push(x.leader);
        })

        leaders.forEach(leader => {
            const roundsofleader = selectedDayRounds?.filter(x => x.leader === leader)
            if (!rounds_by_leaders.some(x => x.leader == leader)) rounds_by_leaders.push({
                leader,
                rounds: roundsofleader ? roundsofleader?.sort((a, b) => a.territory_id - b.territory_id) : []
            })
        })

        return rounds_by_leaders
    }

    const rounds_by_leaders = generateListOfRoundsByLeader(selectedDayRounds || [])

    async function OpenSchedule() {
        setOpenModal(true)

    }

    const { register, handleSubmit, formState: { errors }, getValues, setValue } = useForm<ISchedule>({ resolver: zodResolver(schema) })

    async function submit(schedule: ISchedule) {
        setLoading(true)
        await Schedule({ ...schedule, first_day: selectedDay })
            .then(response => {
                if (response)
                    setMsg(response)
            }).finally(() => setLoading(false))
    }

    function CloseModal() {
        setOpenModal(false)
        queryClient.invalidateQueries({ queryKey: ["getRoundsByStatus"] })
        setMsg("")
    }

    async function handleDeleteRound() {
        setIsDeleting(true)
        const uid = rounds_by_leaders[0]?.rounds[0]?.uid
        if (!uid) return setIsDeleting(false)
        await DeleteRound(uid).then(result => {
            if (result) {
                toast({
                    title: "Sucesso",
                    description: "Agendamento excluído com sucesso",
                    className: 'bg-green-500 text-white',
                })
            } else {
                toast({
                    title: "Erro",
                    className: 'bg-red-500 text-white',
                    description: "Erro ao excluir agendamento",
                })
            }
            setIsDeleting(false)
        }).catch(x => {
            toast({
                title: "Erro",
                className: 'bg-red-500 text-white',
                description: "Erro ao excluir agendamento",
            })
        }).finally(() => {
            queryClient.invalidateQueries({ queryKey: ["getRoundsByStatus"] })
        })
    }

    useEffect(() => {
        if (msg) {
            navigator.clipboard.writeText(msg);
        }
    }, [msg])

    if (isLoading) return <div>
        <div className="w-full h-full flex justify-center items-center  flex-col gap-2 animate-pulse">
            <ThreeDot color="#2563eb " size="medium" text="" textColor="" /> <div className="text-sm text-blue-500">Carregando</div>
        </div>
    </div>

    const AgendarBtn = ({ size }: { size?: "lg" | "sm" | "default" | "icon" | null | undefined }) => <div className='flex flex-col gap-2'>
        <Button size={size} className='w-full md:w-max' onClick={OpenSchedule} >
            <PlusIcon className='w-4 h-4' /> {rounds_by_leaders?.length > 0 ? 'Agendar mais' : 'Agendar'}
        </Button>
    </div>

    return (
        <div className='min-w-full'>
            <Dialog open={modalOpen} onOpenChange={CloseModal}>

                <DialogContent className="max-w-[600px] ">
                    <DialogHeader>
                        <DialogTitle className='text-lg font-medium'>Agendar</DialogTitle>
                    </DialogHeader>
                    <form className='flex-1' action='post' method='POST' onSubmit={handleSubmit(submit)}>
                        <div className='flex flex-col justify-between h-full gap-2'>
                            <div className='flex flex-col flex-1 gap-2'>
                                <label htmlFor='leader'>Dirigente</label>
                                <Select {...register("leader_id")} onValueChange={(value) => setValue('leader_id', Number(value))}>
                                    <SelectTrigger className="w-full" >
                                        <SelectValue placeholder="Selecione..." />
                                    </SelectTrigger>
                                    <SelectContent  >
                                        {leaders?.map(x => <SelectItem value={x?.id.toString()} key={x.id}>{x.id} - {x.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                                {msg && <div className='p-2 flex bg-slate-200 rounded-md shadow-sm font-mono gap-2 '><b>Agendamento:</b>
                                    <pre dangerouslySetInnerHTML={{ __html: msg }}></pre>
                                </div>}
                            </div>

                            {/*         <div className='mt-2 '>
                                <div className='flex flex-row gap-2 items-center'>
                                    <input type='checkbox'
                                        {...register('repeat_next_week')}
                                        name='repeat_next_week'
                                        defaultChecked={true} />
                                    <span>Repetir Semana</span>
                                </div>

                            </div> */}
                            <hr></hr>
                            <div>

                                <Button disabled={loading} type="submit" className='w-full md:w-auto disabled:cursor-not-allowed disabled:opacity-50'>
                                    {loading ? 'Agendando...' : 'Agendar'}
                                </Button>
                            </div>
                        </div>

                    </form>
                </DialogContent>
            </Dialog>
            <div className="px-4 sm:px-7 min-w-full   md:px-6 md:min-w-[calc(100vw-200px)]">
                <div className="md:grid md:grid-cols-2 max-w-4xl md:divide-x md:divide-gray-200 mx-auto container">
                    <div className="md:mr-4 md:max-w-md lg:max-w-lg">
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
                                        {schedule?.some((round) => isSameDay(parseISO(round.first_day.toString()), day) || (round.last_day && isSameDay(parseISO(round.last_day.toString()), day))) ?
                                            (
                                                <div className={`flex flex-initial rounded-md `}>
                                                    {checkStatus(day)}
                                                </div>
                                            ) : <>
                                                {(isMonday(day)) ? <VideoCameraIcon className={`w-5 h-5 p-1 text-white rounded-full bg-blue-300/50`} /> : <XCircleIcon className={`w-5 h-5 text-white rounded-full bg-gray-300/50`} />}

                                            </>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <section className="mt-12 md:mt-0 md:pl-4 w-full">
                        <h2 className="font-semibold text-gray-900">
                            Agendamento para{' '}
                            <time dateTime={format(selectedDay, 'dd-MM-yyyy', { locale: ptBR })}>
                                {format(selectedDay, 'dd/MM/yyyy', { locale: ptBR })}
                            </time>
                            {rounds_by_leaders[0]?.rounds[0]?.campaign && <div className='text-sm text-gray-400'>{rounds_by_leaders[0].rounds[0].campaign}</div>}
                        </h2>
                        <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">

                            {
                                rounds_by_leaders?.length > 0 && <div className='md:flex w-full md:justify-end border-b'>
                                    {edit ?
                                        <Button onClick={() => setEdit(false)} type='button' size={'sm'} className='mb-2 w-full md:w-max bg-blue-500 text-white hover:bg-blue-600'>
                                            <div className='flex flex-row gap-2 justify-between items-center'><XCircleIcon className='w-5 h-5' />Fechar edição</div>
                                        </Button>
                                        : <div className='flex flex-col md:flex-row gap-2'>
                                            <Button disabled={isDeleting} onClick={() => handleDeleteRound()} type='button' size={'sm'} className='mb-2  w-full md:w-max bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed' >
                                                <div className='flex flex-row gap-2 justify-between items-center'><TrashIcon className='w-5 h-5' />{isDeleting ? 'Excluindo...' : 'Excluir'}</div>
                                            </Button>
                                            <Button onClick={() => setEdit(true)} type='button' size={'sm'} className='mb-2  w-full md:w-max bg-blue-500 text-white hover:bg-blue-600' >
                                                <div className='flex flex-row gap-2 justify-between items-center'><Pencil1Icon className='w-5 h-5' />Editar</div>
                                            </Button>

                                            <AgendarBtn size={'sm'} />
                                        </div>
                                    }
                                </div>
                            }

                            {rounds_by_leaders?.length === 0 && <AgendarBtn size={'default'} />}

                            {
                                rounds_by_leaders?.map(x =>
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
                                            <Round key={round.id} round={round} edit={edit} refetch={refetch} />
                                        ))}
                                    </div>)
                            }

                        </ol>
                    </section>
                </div>
            </div>

        </div >
    )
}


function Round({ round, edit, refetch }: { round: RoundsDto, edit: boolean, refetch: () => void }) {
    const [isLoadingMarkAsDone, setIsLoadingMarkAsDone] = useState<boolean>(false);
    const router = useRouter()
    let showQuestionIfWorked = false

    async function ChangeStatusRound(round: RoundsDto, status: number) {
        setIsLoadingMarkAsDone(true)
        await MarkRoundAsDone(round, status).then(result => {
            if (result) refetch()
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
