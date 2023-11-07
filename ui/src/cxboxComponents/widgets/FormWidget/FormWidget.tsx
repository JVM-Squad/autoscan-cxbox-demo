import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { Form, Row, Col } from 'antd'
import Field from '@cxboxComponents/Field/Field'
import styles from './FormWidget.less'
import cn from 'classnames'
import TemplatedTitle from '@cxboxComponents/TemplatedTitle/TemplatedTitle'
import { RootState } from '@store'
import { interfaces } from '@cxbox-ui/core'
import { useFlatFormFields } from '@hooks/useFlatFormFields'
import { buildBcUrl } from '@utils/buildBcUrl'

const { FieldType, PendingValidationFailsFormat } = interfaces

interface FormWidgetOwnProps {
    meta: interfaces.WidgetFormMeta
}

interface FormWidgetProps extends FormWidgetOwnProps {
    cursor: string
    fields?: interfaces.RowMetaField[]
    metaErrors?: Record<string, string>
    missingFields?: Record<string, string> | interfaces.PendingValidationFails
}

/**
 *
 * @param props
 * @category Widgets
 */
export const FormWidget: FunctionComponent<FormWidgetProps> = ({ meta, fields, missingFields, metaErrors, cursor }) => {
    const hiddenKeys: string[] = []
    const flattenWidgetFields = useFlatFormFields<interfaces.WidgetFormField>(meta.fields).filter(item => {
        const isHidden = item.type === FieldType.hidden || item.hidden
        if (isHidden) {
            hiddenKeys.push(item.key)
        }
        return !isHidden
    })
    const { bcName, name } = meta

    const memoizedFields = React.useMemo(() => {
        return (
            <Row gutter={24}>
                {meta.options?.layout?.rows.map((row, index) => {
                    return (
                        <Row key={index}>
                            {row.cols
                                .filter(field => {
                                    const fieldMeta = fields?.find(item => item.key === field?.fieldKey)
                                    return fieldMeta ? !fieldMeta.hidden : true
                                })
                                .filter(col => !hiddenKeys.includes(col.fieldKey))
                                .map((col, colIndex) => {
                                    const field = flattenWidgetFields.find(item => item.key === col.fieldKey)
                                    const disabled = fields?.find(item => item.key === field?.key && item.disabled)
                                    const error = (!disabled && missingFields?.[field?.key as string]) || metaErrors?.[field?.key as string]
                                    return (
                                        <Col
                                            key={colIndex}
                                            span={col.span}
                                            className={cn({ [styles.colWrapper]: row.cols.length > 1 || col.span !== 24 })}
                                        >
                                            <Form.Item
                                                data-test="FIELD"
                                                data-test-field-type={field?.type}
                                                data-test-field-title={field?.label || field?.title}
                                                data-test-field-key={field?.key}
                                                label={
                                                    field?.type === 'checkbox' ? null : (
                                                        <TemplatedTitle widgetName={meta.name} title={field?.label as string} />
                                                    )
                                                }
                                                validateStatus={error ? 'error' : undefined}
                                                help={error ? <div data-test-error-text={true}>{error}</div> : undefined}
                                            >
                                                <Field
                                                    bcName={bcName}
                                                    cursor={cursor}
                                                    widgetName={name}
                                                    widgetFieldMeta={field as interfaces.WidgetField}
                                                    disableHoverError={meta.options?.disableHoverError}
                                                />
                                            </Form.Item>
                                        </Col>
                                    )
                                })}
                        </Row>
                    )
                })}
            </Row>
        )
    }, [bcName, name, cursor, flattenWidgetFields, missingFields, metaErrors, hiddenKeys, fields, meta])

    return (
        <Form colon={false} layout="vertical">
            {memoizedFields}
        </Form>
    )
}

function mapStateToProps(state: RootState, ownProps: FormWidgetOwnProps) {
    const bcName = ownProps.meta.bcName
    const bc = state.screen.bo.bc[bcName]
    const bcUrl = buildBcUrl(bcName, true)
    const rowMeta = bcUrl ? state.view.rowMeta[bcName]?.[bcUrl] : undefined
    const fields = rowMeta?.fields
    const metaErrors = rowMeta?.errors
    const cursor = bc?.cursor as string
    const missingFields =
        state.view.pendingValidationFailsFormat === PendingValidationFailsFormat.target
            ? (state.view.pendingValidationFails as interfaces.PendingValidationFails)?.[bcName]?.[cursor]
            : state.view.pendingValidationFails
    return {
        cursor,
        fields,
        metaErrors,
        missingFields
    }
}

/**
 * @category Widgets
 */
const ConnectedFormWidget = connect(mapStateToProps)(FormWidget)

export default ConnectedFormWidget
