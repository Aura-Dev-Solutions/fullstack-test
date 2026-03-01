import type {
  Workflow,
  Stage,
  CreateWorkflowDTO,
  UpdateWorkflowDTO,
  CreateStageDTO,
  UpdateStageDTO,
  WorkflowRepository,
} from '../domain'

export class InMemoryWorkflowRepository implements WorkflowRepository {
  private workflows: Map<string, Workflow> = new Map()
  private stages: Map<string, Stage> = new Map()

  async findAllByOrganization(organizationId: string): Promise<Workflow[]> {
    return Array.from(this.workflows.values()).filter(
      (w) => w.organizationId === organizationId
    )
  }

  async findById(id: string): Promise<Workflow | null> {
    return this.workflows.get(id) ?? null
  }

  async create(data: CreateWorkflowDTO): Promise<Workflow> {
    const workflowId = crypto.randomUUID()
    const stages: Stage[] = (data.stages ?? []).map((s) => {
      const stage: Stage = {
        id: crypto.randomUUID(),
        workflowId,
        name: s.name,
        order: s.order,
        color: s.color ?? null,
      }
      this.stages.set(stage.id, stage)
      return stage
    })

    const workflow: Workflow = {
      id: workflowId,
      organizationId: data.organizationId,
      name: data.name,
      stages,
      createdAt: new Date(),
    }
    this.workflows.set(workflow.id, workflow)
    return workflow
  }

  async update(id: string, data: UpdateWorkflowDTO): Promise<Workflow | null> {
    const workflow = this.workflows.get(id)
    if (!workflow) return null

    const updated: Workflow = {
      ...workflow,
      name: data.name ?? workflow.name,
    }
    this.workflows.set(id, updated)
    return updated
  }

  async delete(id: string): Promise<boolean> {
    return this.workflows.delete(id)
  }

  async addStage(data: CreateStageDTO): Promise<Stage> {
    const stage: Stage = {
      id: crypto.randomUUID(),
      workflowId: data.workflowId,
      name: data.name,
      order: data.order,
      color: data.color ?? null,
    }
    this.stages.set(stage.id, stage)

    const workflow = this.workflows.get(data.workflowId)
    if (workflow) {
      workflow.stages.push(stage)
    }

    return stage
  }

  async updateStage(id: string, data: UpdateStageDTO): Promise<Stage | null> {
    const stage = this.stages.get(id)
    if (!stage) return null

    const updated: Stage = {
      ...stage,
      name: data.name ?? stage.name,
      order: data.order ?? stage.order,
      color: data.color !== undefined ? data.color ?? null : stage.color,
    }
    this.stages.set(id, updated)

    const workflow = this.workflows.get(stage.workflowId)
    if (workflow) {
      const index = workflow.stages.findIndex((s) => s.id === id)
      if (index !== -1) workflow.stages[index] = updated
    }

    return updated
  }

  async deleteStage(id: string): Promise<boolean> {
    const stage = this.stages.get(id)
    if (!stage) return false

    this.stages.delete(id)

    const workflow = this.workflows.get(stage.workflowId)
    if (workflow) {
      workflow.stages = workflow.stages.filter((s) => s.id !== id)
    }

    return true
  }

  clear(): void {
    this.workflows.clear()
    this.stages.clear()
  }
}
