'use client'

import { useEffectiveness } from '@/services/roundsService'
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    LabelList,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { ThreeDot } from 'react-loading-indicators'
import { useState } from 'react'
import moment from 'moment'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useIsMobile } from '@/utils/useMobile'

export default function EffectivenessBarChart() {
    const { query } = useEffectiveness()
    const [semanas, setSemanas] = useState('1')
    const now = moment()
    const isMobile = useIsMobile()

    const effectivenessData = (query.data || [])
        .filter((item) => {
            const data = moment(item.first_day).utc(false)
            const limite = now.clone().subtract(30, 'days')
            return data.isSameOrAfter(limite)
        })
        .filter((item) => {
            if (semanas === 'todas') return true
            const data = moment(item.first_day).utc(false)
            const limite = now.clone().subtract(Number(semanas), 'weeks').startOf('isoWeek')
            return data.isSameOrAfter(limite)
        })
        .map((item) => {
            const fullDate = moment(item.first_day).utc(false).format('DD/MM/YYYY')
            const shortDate = moment(item.first_day).utc(false).format('DD/MM')

            const [firstName, lastName] = item.name.split(' ')
            const shortName = `${firstName}${lastName ? ' ' + lastName[0] + '.' : ''}`

            const total = item.total
            const ok = item.ok
            const percent = total > 0 ? Math.round((ok / total) * 100) : 0

            return {
                name: `${shortName} (${shortDate})`,
                fullLabel: `${item.name} - ${fullDate}`,
                total,
                trabalhado: ok,
                percent,
            }
        })

    if (query.isLoading) {
        return (
            <div className="w-full h-[400px] flex justify-center items-center flex-col gap-2 animate-pulse">
                <ThreeDot color="#2563eb" size="medium" />
                <div className="text-sm text-blue-500">Carregando efetividade...</div>
            </div>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                    <CardTitle>
                        Efetividade dos Dirigentes ({semanas === 'todas' ? 'últimos 30 dias' : `últimas ${semanas} semana(s)`})
                    </CardTitle>
                    <Select value={semanas} onValueChange={setSemanas}>
                        <SelectTrigger title={isMobile ? 'Não é possível selecionar esta opção no modo mobile' : `últimas ${semanas} semana(s)`} disabled={isMobile} className="w-52">
                            <SelectValue placeholder="Últimas semanas" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="todas">Últimos 30 dias</SelectItem>
                            <SelectItem value="4">Últimas 4 semanas</SelectItem>
                            <SelectItem value="3">Últimas 3 semanas</SelectItem>
                            <SelectItem value="2">Últimas 2 semanas</SelectItem>
                            <SelectItem value="1">Última semana</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardHeader>

            <CardContent>
                <div className="w-full h-[460px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={effectivenessData}
                            margin={{ top: 40, right: 30, left: 60, bottom: 100 }}
                            barSize={20}
                        >
                            {/* <CartesianGrid strokeDasharray="1 1" /> */}
                            <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                height={80}
                                tick={{ fontStyle: 'italic', fontSize: 12 }}
                            />
                            {/* <YAxis allowDecimals={false} /> */}
                            <Tooltip
                                formatter={(value: number, key: string) => {
                                    const labelMap: Record<string, string> = {
                                        total: 'Enviados',
                                        trabalhado: 'Completados',
                                    }
                                    return [`${value}`, labelMap[key] || key]
                                }}
                                labelFormatter={(label: string) => {
                                    const item = effectivenessData.find((d) => d.name === label)
                                    return item?.fullLabel || label
                                }}
                            />
                            <Legend
                                verticalAlign="top"
                                align="left"
                                wrapperStyle={{ paddingBottom: 20 }}
                            />
                            <Bar dataKey="total" fill="#2196F3" name="Enviados" />
                            <Bar dataKey="trabalhado" fill="#4CAF50" name="Completados">
                                <LabelList
                                    dataKey="percent"
                                    position="top"
                                    formatter={(value: any) => `${value}%`}
                                    style={{
                                        fontSize: 10,
                                        fontWeight: 'bold',
                                        fill: '#333',
                                    }}
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
