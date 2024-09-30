import { ICommandBus } from '@filecoin-plus/core'
import { Response, Request } from 'express'
import { inject } from 'inversify'
import { controller, httpPost, request, response } from 'inversify-express-utils'

import { TYPES } from '@src/types'

import { ok } from '../processors/response'
import { SubmitKYCResultCommand } from '@src/application/use-cases/submit-kyc-result/submit-kyc-result.command'
import { PhaseStatus } from '@src/application/commands/common'

@controller('/api/v1/kyc')
export class KycController {
  constructor(@inject(TYPES.CommandBus) private readonly _commandBus: ICommandBus) {}

  @httpPost('/result/:endpointSecret')
  async submitKYCResult(@request() req: Request, @response() res: Response) {
    const { endpointSecret } = req.params
    const expectedSecret = process.env.KYC_ENDPOINT_SECRET

    if (endpointSecret !== expectedSecret) {
      return res.status(404).json({ error: 'Not Found' })
    }

    const { event, data, custom } = req.body
    const applicationId = custom.applicationId
    console.log('applicationId', applicationId)

    const result = await this._commandBus.send(
      new SubmitKYCResultCommand(applicationId, {
        status: event === 'success' ? PhaseStatus.Approved : PhaseStatus.Rejected,
        data: data.kyc,
      }),
    )
    return res.json(ok('KYC result submitted successfully', {}))
  }
}
