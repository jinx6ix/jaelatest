import React from 'react'
import type { AuthorBox as AuthorBoxProps, User } from '@/payload-types'

export const AuthorBoxBlock: React.FC<AuthorBoxProps> = ({ author, bio }) => {
  const user = author as User
  return (
    <div className="bg-muted p-6 rounded-lg flex items-center gap-4 my-8">
      <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-xl font-bold">
        {user.name ? user.name[0].toUpperCase() : 'A'}
      </div>
      <div>
        <h4 className="font-bold text-lg">{user.name}</h4>
        <p className="text-muted-foreground">{bio}</p>
      </div>
    </div>
  )
}
