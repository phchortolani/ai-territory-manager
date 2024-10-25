import React from 'react'
import Select, { MultiValue } from 'react-select'

export type OptionType = {
    value: string,
    label: string
}

export const Select2 = ({ options, defaultValue, onChange, isDisabled }: { options: OptionType[], defaultValue: OptionType[], onChange: (value: MultiValue<OptionType>) => void, isDisabled?: boolean }) => (
    <Select
        defaultValue={defaultValue}
        isMulti
        isDisabled={isDisabled}
        onChange={onChange}
        name="colors"
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
    />
)