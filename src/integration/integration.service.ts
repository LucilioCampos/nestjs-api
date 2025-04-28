import { Injectable } from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { IntegrationProducer } from "./producer/integration.producer";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export type PrivateClient = Omit<PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>, "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends">


interface JobProps {
    id: number,
    step: {
        id: number,
        informaticaTaskFlowId: string
    },
}
@Injectable()
export class PrivateIntegrationService {
    async getFlow(client: PrivateClient, service: string) {
        const { id, steps } = await client.flow.findFirstOrThrow({
            where: { slug: service },
            include: {
                steps: {
                    where: {
                        parentId: {
                            not: null
                        }
                    },
                    select: {
                        id: true
                    }
                }
            }
        })
        return { flowId: id, stepsIds: steps.map(({ id }) => id) }
    }

    async createMessage(client: PrivateClient, data: Record<string, any>) {
        const { id, body } = await client.message.create({
            data: {
                body: data.content,
                origin: data.origin,
                flowId: data.flowId,
                headers: data.headers,
            },
            select: {
                id: true,
                body: true
            }
        })

        return { id, body }
    }

    async createJobs(client: PrivateClient, stepsIds: number[], messageId: number) {
        return client.job.createManyAndReturn({
            select: {
                id: true,
                step: {
                    select: {
                        id: true,
                        informaticaTaskFlowId: true
                    }
                }
            },
            data: stepsIds.map((stepId) => ({
                messageId: messageId, stepId,

            }))
        })
    }

    async createExecutions(client: PrivateClient, jobs: JobProps[], messageBody: string) {
        await client.execution.createManyAndReturn({
            include: {
                job: {
                    include: {
                        step: true
                    }
                }
            },
            data: jobs.map((job) => {
                const executionData: Prisma.ExecutionCreateManyInput = {
                    body: messageBody,
                    informaticaTaskFlowId: job.step.informaticaTaskFlowId,
                    jobId: job.id,
                }
                return executionData;
            })
        })
    }

}

@Injectable()
export class IntegrationService {

    constructor(
        private readonly prismaService: PrismaService,
        private readonly integrationProducer: IntegrationProducer,
        private readonly privateIntegrationService: PrivateIntegrationService
    ) { }


    async execute(data: Record<string, any>) {

        const result = await this.prismaService.$transaction(async (client) => {
            const flow = await this.privateIntegrationService.getFlow(client, data.service)

            const { id: messageId, body: messageBody } = await this.privateIntegrationService.createMessage(client,
                {
                    body: data.content,
                    origin: data.origin,
                    flowId: flow.flowId,
                    headers: data.headers,
                }
            )
            const jobs = await this.privateIntegrationService.createJobs(client, flow.stepsIds, messageId)
            const executions = await this.privateIntegrationService.createExecutions(client, jobs, messageBody)

            return executions

        })

        return result
    }

}
