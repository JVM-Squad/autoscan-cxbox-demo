import React, { useEffect, useState } from 'react'
import cn from 'classnames'
import { Menu, Icon } from 'antd'
import { ClickParam } from 'antd/lib/menu'
import Search from 'antd/lib/input/Search'
import styles from './ScreenNavigation.less'
import { useBcLocation } from '@hooks/useBcLocation'
import { useMeta, useScreenMeta } from '../../queries'

const selectedItemClass = 'selectedItem'

function ScreenNavigation() {
    const [location, navigate] = useBcLocation()
    const { data } = useMeta()
    const { data: screen } = useScreenMeta(location.bcMap.get('screen'))

    const screenUrl = screen?.url ?? `/screen/${location.bcMap.get('screen')}`

    const handleClick = (e: ClickParam) => {
        navigate(e.key)
    }

    const { filteredValues: filteredScreens, handleSearch } = useLocalSearch({ values: data?.screens ?? [], comparisonField: 'text' })

    useEffect(() => {
        // can't use .ant-menu-item-selected because dom nodes changes it too slowly
        const selectedItem = document.querySelector(`.${styles.item}.${selectedItemClass}`)
        selectedItem?.scrollIntoView()
    }, [screenUrl])

    return (
        <div className={styles.menuContainer}>
            <div className={styles.search}>
                <Search onSearch={handleSearch} />
            </div>
            <Menu className={styles.container} data-test="MAIN_MENU" selectedKeys={[screenUrl]} onClick={handleClick} theme="dark">
                {filteredScreens.map(item => {
                    return (
                        <Menu.Item
                            key={item.url}
                            className={cn(styles.item, {
                                [selectedItemClass]: screenUrl === item.url
                            })}
                            data-test="MAIN_MENU_ITEM"
                            title={item.text}
                        >
                            <span className={styles.menuItemLink}>
                                <Icon type={item.icon ? item.icon : 'coffee'} />
                                <span>{item.text}</span>
                            </span>
                        </Menu.Item>
                    )
                })}
            </Menu>
        </div>
    )
}

export default React.memo(ScreenNavigation)

interface UseLocalSearch<T> {
    values: T[]
    comparisonField: string
}

function useLocalSearch<T extends Record<string, any>>({ comparisonField = 'text', values }: UseLocalSearch<T>) {
    const [searchText, setSearchText] = useState<string>('')

    const filteredValues = searchText.length
        ? values.filter((value: T) => value[comparisonField]?.toLowerCase()?.includes(searchText.toLowerCase()))
        : values

    const handleSearch = (value: unknown) => setSearchText(typeof value === 'string' ? value : '')

    return {
        filteredValues,
        handleSearch
    }
}
