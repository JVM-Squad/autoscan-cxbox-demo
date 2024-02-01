import React from 'react'
import { Icon, Select as AntdSelect } from 'antd'
import { BaseFieldProps } from '@cxboxComponents/Field/Field'
import Select, { SelectProps } from '@cxboxComponents/ui/Select/Select'
import ReadOnlyField from '@cxboxComponents/ui/ReadOnlyField/ReadOnlyField'
import { interfaces } from '@cxbox-ui/core'

export interface DictionaryProps extends BaseFieldProps {
    value?: interfaces.MultivalueSingleValue[] | string | null
    onChange?: (value: interfaces.MultivalueSingleValue[] | string) => void
    values: Array<{ value: string; icon?: string }>
    fieldName: string
    placeholder?: string
    style?: React.CSSProperties
    metaIcon?: JSX.Element
    valueIcon?: string
    popupContainer?: HTMLElement
    multiple?: boolean
}

/**
 *
 * @param props
 * @category Components
 */
const Dictionary: React.FunctionComponent<DictionaryProps> = props => {
    const { multiple, onChange, values, value, valueIcon, meta, metaIcon, readOnly, className, backgroundColor, onDrillDown, widgetName } =
        props
    const selectRef = React.useRef<AntdSelect<string | string[]>>(null)

    const handleChange = React.useCallback(
        (v: string | string[]) => {
            if (multiple) {
                onChange?.((v as string[]).map(item => ({ id: item, value: item })))
            } else {
                onChange?.((v as string) || '')
            }
        },
        [multiple, onChange]
    )

    const resultValue = React.useMemo(() => {
        if (multiple) {
            return (value as interfaces.MultivalueSingleValue[])?.map(i => i.value) ?? []
        } else {
            return value ?? undefined
        }
    }, [value, multiple])

    const extendedProps: SelectProps<string | string[]> = {
        ...props,
        mode: multiple ? 'multiple' : 'default',
        value: resultValue as string | string[],
        allowClear: !!value,
        showSearch: true,
        onChange: handleChange,
        dropdownMatchSelectWidth: false,
        getPopupContainer: trigger => trigger.parentElement as HTMLElement,
        forwardedRef: selectRef,
        suffixIcon: <Icon type="down" data-test-field-dictionary-popup={true} />,
        clearIcon: <Icon type="close-circle" theme="filled" data-test-field-dictionary-item-clear={true} />
    }

    const options = React.useMemo(() => {
        const noValues = !values?.length
        const hasMultipleValue = noValues && multiple && value?.length
        const hasSingleValue = noValues && !multiple && value
        if (hasMultipleValue) {
            return (value as interfaces.MultivalueSingleValue[])?.map(item => {
                return (
                    <Select.Option key={item.value} title={item.value}>
                        {item.options?.icon && getIconByParams(item.options.icon)}
                        <span data-test-field-dictionary-item={true}>{item.value}</span>
                    </Select.Option>
                )
            })
        }
        if (hasSingleValue) {
            return (
                <Select.Option key={value as string} title={value as string}>
                    {metaIcon}
                    {valueIcon && getIconByParams(valueIcon)}
                    <span data-test-field-dictionary-item={true}>{value}</span>
                </Select.Option>
            )
        }
        return values?.map(item => {
            return (
                <Select.Option key={item.value} title={item.value}>
                    {item.icon && getIconByParams(item.icon)}
                    <span data-test-field-dictionary-item={true}>{item.value}</span>
                </Select.Option>
            )
        })
    }, [value, values, multiple, metaIcon, valueIcon])

    if (readOnly) {
        let readOnlyValue = value ?? ''
        if (multiple) {
            readOnlyValue = (readOnlyValue as interfaces.MultivalueSingleValue[]).map(i => i.value).join(', ')
        }
        return (
            <ReadOnlyField
                widgetName={widgetName}
                meta={meta}
                className={className}
                backgroundColor={backgroundColor}
                onDrillDown={onDrillDown}
            >
                {readOnlyValue}
            </ReadOnlyField>
        )
    }

    return <Select {...extendedProps}>{options}</Select>
}

/**
 * Returns Icon component
 *
 * @param params Contains `type` and `color`
 * @param extraStyleClasses extra css classes
 */
export function getIconByParams(params: string, extraStyleClasses?: string) {
    if (params) {
        const [antIconType, cssColor] = params.split(' ')
        return <Icon type={antIconType} style={{ color: cssColor }} className={extraStyleClasses} />
    }
    return null
}

/**
 * @category Components
 */
const MemoizedDictionary = React.memo(Dictionary)

export default MemoizedDictionary
