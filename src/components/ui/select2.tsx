import React from 'react'
import Select, { MultiValue } from 'react-select'

export type OptionType = {
    value: string,
    label: string
}

export const Select2 = ({ options, defaultValue, onChange, isDisabled }: { options: OptionType[], defaultValue?: OptionType[], onChange: (value: MultiValue<OptionType>) => void, isDisabled?: boolean }) => (
    <Select
        defaultValue={defaultValue}
        isMulti
        closeMenuOnSelect={false}
        isDisabled={isDisabled}
        onChange={onChange}
        name="colors"
        placeholder="Selecione..."
        options={options}
        className="basic-multi-select"
        classNamePrefix="select"
    />
)