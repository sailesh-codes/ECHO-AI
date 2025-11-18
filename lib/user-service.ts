import { getDatabase } from './mongodb'

export interface User {
  email: string
  promptCount: number
  createdAt: Date
  lastLoginAt: Date
}

export class UserService {
  static async createUser(email: string): Promise<User> {
    const db = await getDatabase()
    const user: User = {
      email,
      promptCount: 0,
      createdAt: new Date(),
      lastLoginAt: new Date()
    }
    
    await db.collection('users').insertOne(user)
    return user
  }

  static async getUser(email: string): Promise<User | null> {
    const db = await getDatabase()
    return await db.collection<User>('users').findOne({ email })
  }

  static async updateUserPromptCount(email: string): Promise<User | null> {
    const db = await getDatabase()
    const result = await db.collection<User>('users').findOneAndUpdate(
      { email },
      { 
        $inc: { promptCount: 1 },
        $set: { lastLoginAt: new Date() }
      },
      { returnDocument: 'after' }
    )
    return result
  }

  static async canSendPrompt(email: string): Promise<boolean> {
    const user = await this.getUser(email)
    if (!user) return true // New users can send prompts
    return user.promptCount < 5
  }

  static async getPromptCount(email: string): Promise<number> {
    const user = await this.getUser(email)
    return user?.promptCount || 0
  }
}
