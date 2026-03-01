import 'reflect-metadata'
import { AppDataSource } from '../src/shared/infrastructure/database/data-source'
import { OrganizationEntity } from '../src/modules/organization/infrastructure/OrganizationEntity'
import { UserEntity } from '../src/modules/users/infrastructure/UserEntity'
import { WorkflowEntity } from '../src/modules/workflow/infrastructure/WorkflowEntity'
import { StageEntity } from '../src/modules/workflow/infrastructure/StageEntity'
import { ContactEntity } from '../src/modules/contact/infrastructure/ContactEntity'
import { DealEntity } from '../src/modules/deal/infrastructure/DealEntity'
import bcrypt from 'bcryptjs'

async function seed() {
  console.log('Connecting to database...')
  await AppDataSource.initialize()
  console.log('Database connected.')

  const orgRepo = AppDataSource.getRepository(OrganizationEntity)
  const userRepo = AppDataSource.getRepository(UserEntity)
  const workflowRepo = AppDataSource.getRepository(WorkflowEntity)
  const stageRepo = AppDataSource.getRepository(StageEntity)
  const contactRepo = AppDataSource.getRepository(ContactEntity)
  const dealRepo = AppDataSource.getRepository(DealEntity)

  // 1. Create organization
  console.log('Creating organization...')
  const organization = orgRepo.create({ name: 'Aura Research' })
  const savedOrg = await orgRepo.save(organization)
  console.log(`  Organization created: ${savedOrg.name} (${savedOrg.id})`)

  // 2. Create workflow with 4 stages
  console.log('Creating workflow and stages...')
  const workflow = workflowRepo.create({
    name: 'Sales Pipeline',
    organizationId: savedOrg.id,
  })
  const savedWorkflow = await workflowRepo.save(workflow)

  const stageData = [
    { name: 'Lead', order: 1, color: '#6B7280' },
    { name: 'Qualified', order: 2, color: '#3B82F6' },
    { name: 'Proposal', order: 3, color: '#F59E0B' },
    { name: 'Closed Won', order: 4, color: '#10B981' },
  ]

  const savedStages: StageEntity[] = []
  for (const s of stageData) {
    const stage = stageRepo.create({
      workflowId: savedWorkflow.id,
      name: s.name,
      order: s.order,
      color: s.color,
    })
    const saved = await stageRepo.save(stage)
    savedStages.push(saved)
    console.log(`  Stage created: ${saved.name} (order: ${saved.order})`)
  }

  // 3. Create users
  console.log('Creating users...')
  const adminPassword = await bcrypt.hash('Admin123!', 10)
  const salesPassword = await bcrypt.hash('Sales123!', 10)

  const admin = userRepo.create({
    name: 'Admin User',
    email: 'admin@aura.com',
    password: adminPassword,
    organizationId: savedOrg.id,
  })
  const savedAdmin = await userRepo.save(admin)
  console.log(`  User created: ${savedAdmin.email}`)

  const salesUser = userRepo.create({
    name: 'Sales User',
    email: 'sales@aura.com',
    password: salesPassword,
    organizationId: savedOrg.id,
  })
  const savedSales = await userRepo.save(salesUser)
  console.log(`  User created: ${savedSales.email}`)

  // 4. Create contacts
  console.log('Creating contacts...')
  const contactData = [
    { name: 'Elena Torres', email: 'elena.torres@techvision.io', phone: '+1-555-0101' },
    { name: 'Marcus Chen', email: 'marcus.chen@cloudnova.com', phone: '+1-555-0102' },
    { name: 'Sofia Ramirez', email: 'sofia.ramirez@dataforge.dev', phone: '+1-555-0103' },
    { name: 'James Okafor', email: 'james.okafor@quantumleap.ai', phone: '+1-555-0104' },
    { name: 'Ava Petrov', email: 'ava.petrov@synthwave.tech', phone: '+1-555-0105' },
    { name: 'Lucas Kim', email: 'lucas.kim@nebulasoft.co', phone: '+1-555-0106' },
    { name: 'Isabella Muller', email: 'isabella.muller@corestack.io', phone: '+1-555-0107' },
    { name: 'Daniel Park', email: 'daniel.park@pixelcraft.dev', phone: '+1-555-0108' },
  ]

  const savedContacts: ContactEntity[] = []
  for (const c of contactData) {
    const contact = contactRepo.create({
      organizationId: savedOrg.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
    })
    const saved = await contactRepo.save(contact)
    savedContacts.push(saved)
    console.log(`  Contact created: ${saved.name}`)
  }

  // 5. Create deals
  console.log('Creating deals...')
  const dealData = [
    { title: 'TechVision Platform License', value: 25000, stageIndex: 0, contactIndex: 0 },
    { title: 'CloudNova Migration', value: 45000, stageIndex: 1, contactIndex: 1 },
    { title: 'DataForge Analytics Suite', value: 12000, stageIndex: 0, contactIndex: 2 },
    { title: 'QuantumLeap AI Integration', value: 38000, stageIndex: 2, contactIndex: 3 },
    { title: 'SynthWave IoT Dashboard', value: 8500, stageIndex: 1, contactIndex: 4 },
    { title: 'NebulaSoft ERP Module', value: 50000, stageIndex: 3, contactIndex: 5 },
    { title: 'CoreStack DevOps Setup', value: 15000, stageIndex: 2, contactIndex: 6 },
    { title: 'PixelCraft Design System', value: 5000, stageIndex: 0, contactIndex: 7 },
    { title: 'CloudNova Security Audit', value: 22000, stageIndex: 3, contactIndex: 1 },
    { title: 'TechVision Support Plan', value: 9500, stageIndex: 1, contactIndex: 0 },
  ]

  for (const d of dealData) {
    const deal = dealRepo.create({
      organizationId: savedOrg.id,
      contactId: savedContacts[d.contactIndex].id,
      stageId: savedStages[d.stageIndex].id,
      title: d.title,
      value: d.value,
      status: 'open',
    })
    const saved = await dealRepo.save(deal)
    console.log(`  Deal created: ${saved.title} ($${d.value})`)
  }

  console.log('\nSeed completed successfully!')
  await AppDataSource.destroy()
}

seed().catch((error) => {
  console.error('Seed failed:', error)
  AppDataSource.destroy().finally(() => process.exit(1))
})
