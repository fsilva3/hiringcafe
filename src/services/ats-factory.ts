import { ATSProvider } from '@app/shared/types'
import avature from './avature'

export const getATSFactory = (type: string): ATSProvider => {
  switch (type) {
    case 'avature': {
      return avature
    }
    default:
      throw new Error('ATS provider not found')
  }
}
