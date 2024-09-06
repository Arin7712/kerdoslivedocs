import { Editor } from '@/components/editor/Editor';
import Header from '@/components/Header';
import {Montserrat} from '@next/font/google'
import { SignedIn, SignInButton, SignedOut, UserButton } from '@clerk/nextjs';
import CollaborativeRoom from '@/components/CollaborativeRoom';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { getDocument } from '@/lib/actions/room.actions';
import { getClerkUsers } from '@/lib/actions/users.actions';

const montserrat = Montserrat({
    subsets: ['latin'], // Specify subsets if needed
    weight: ['400', '700'], // Specify the font weights you're using
  });

  const Document = async ({ params: { id } }: SearchParamProps) => {
    const clerkUser = await currentUser();
    if(!clerkUser) redirect('/sign-in');
  
    const room = await getDocument({
      roomId: id,
      userId: clerkUser.emailAddresses[0].emailAddress,
    });
  
    if(!room) redirect('/');
  
    const userIds = Object.keys(room.usersAccesses);
    const users = await getClerkUsers({ userIds });
  
    const usersData = users.map((user: User) => ({
      ...user,
      userType: room.usersAccesses[user.email]?.includes('room:write')
        ? 'editor'
        : 'viewer'
    }))
  
    const currentUserType = room.usersAccesses[clerkUser.emailAddresses[0].emailAddress]?.includes('room:write') ? 'editor' : 'viewer';
  
    return (
      <main className="flex w-full flex-col items-center">
        <CollaborativeRoom 
          roomId={id}
          roomMetadata={room.metadata}
          users={usersData}
          currentUserType={currentUserType}
        />
      </main>
    )
  }
  
  export default Document