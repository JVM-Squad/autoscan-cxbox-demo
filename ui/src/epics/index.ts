import { sessionEpics } from './session'
import { viewEpics } from './view'
import { combineEpics } from 'redux-observable'
import { epics } from '@cxbox-ui/core'
import { screenEpics } from './screen'
import { RootEpic } from '@store'

const coreEpics = { ...epics } as unknown as Record<string, RootEpic>

const mergedEpics = {
    ...coreEpics,
    ...sessionEpics,
    ...viewEpics,
    ...screenEpics
}
export const rootEpic = combineEpics(...Object.values(mergedEpics))
