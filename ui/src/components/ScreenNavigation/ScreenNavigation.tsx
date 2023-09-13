import React from 'react'
import { Menu } from 'antd'
import { changeLocation } from '@cxbox-ui/core'
import styles from './ScreenNavigation.module.css'
import { ClickParam } from 'antd/lib/menu'
import { useAppSelector } from '../../store'

function ScreenNavigation() {
    const screens = useAppSelector(state => state.session.screens)
    const screenName = useAppSelector(state => state.router.screenName)
    const selectedScreen = screens.find(item => item.name === screenName) || screens.find(screen => screen.defaultScreen) || screens[0]
    const screenUrl = selectedScreen?.url ?? `/screen/${screenName}`
    const handleScreen = (e: ClickParam) => {
        changeLocation(e.key)
    }

    return (
        <div className={styles.menuContainer}>
            <Menu className={styles.Container} selectedKeys={[screenUrl]} onClick={handleScreen} theme="light">
                {screens.map(item => {
                    return (
                        <Menu.Item key={item.url} className={styles.Item}>
                            <span className={styles.MenuItemLink}>
                                {/*<Icon type={item.icon ? item.icon : 'coffee'} />*/}
                                <span>iconca</span>
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
