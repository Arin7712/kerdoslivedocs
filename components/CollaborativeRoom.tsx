'use client'
import { RoomProvider, ClientSideSuspense } from '@liveblocks/react/suspense'
import { Editor } from '@/components/editor/Editor';
import Header from '@/components/Header';
import { SignedIn, SignInButton, SignedOut, UserButton } from '@clerk/nextjs';
import ActiveCollaborators from './ActiveCollaborators';
import { useState, useRef, useEffect } from 'react';
import { Input } from './ui/input';
import Image from 'next/image';
import { updateDocument } from '@/lib/actions/room.actions';
import Loader from './Loader';
import ShareModal from './ShareModal';
import { Button } from './ui/button';
import jsPDF from 'jspdf';


const CollaborativeRoom = ({roomId, roomMetadata, users, currentUserType}: CollaborativeRoomProps) => {

  // setting states to edit the document title
  const[documentTitle, setDocumentTitle] = useState(roomMetadata.title);
  const[editing, setEditing] = useState(false);
  const[loading, setLoading] = useState(false);

  const[download, setDownload] = useState();
  const[generatedDoc, setGeneratedDoc] = useState();
  const documentRef = useRef<HTMLElement>(null);

  const containerRef = useRef(null);
  const inputRef = useRef(null);


  const updateTitleHanlder = async(e : React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter'){
      setLoading(true);

      try{
        if(documentTitle !== roomMetadata.title){
          const updatedDocument = await updateDocument(roomId, documentTitle);
          if(updatedDocument){
            setEditing(false);
          }
        }

      }catch(e){
        console.log(e)
      }

      setLoading(false);
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if(containerRef.current && !containerRef.current.contains(e.target as Node)){
        setEditing(false);
        updateDocument(roomId, documentTitle);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [roomId, documentTitle])

  useEffect(() => {
    if(editing && inputRef.current){
      inputRef.current.focus();
    }
  }, [editing])

  return (
    <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<Loader/>}>
          <div className="collaborative-room">
          <Header>
            <div ref={containerRef} className='flex w-fit items-center justify-center gap-2'>
                {editing && !loading ? 
                <Input
                type='text'
                value={documentTitle}
                ref={inputRef}
                placeholder='Enter title'
                onChange={(e) => setDocumentTitle(e.target.value)}
                onKeyDown={updateTitleHanlder}
                disabled={!editing}
                className='document-title-input'
                />
                
                : (
                  <div ref={documentRef}>
                  <p className='document-title'>{documentTitle}</p>
                  </div>
                )
                }
                {currentUserType === 'editor' && !editing && (
                  <Image src='/assets/icons/edit.svg' alt='edit' width={24} height={24} onClick={() => setEditing(true)} className='pointer'/>
                )}

                {currentUserType !== 'editor' && !editing && (
                  <p className='view-only'>view-only</p>
                )}

                {loading && <p className='text-sm text-gray-400'>saving...</p>}
            </div>
            <div className='flex w-full flex-1 justify-end gap-2 sm:gap-3' >
              <ActiveCollaborators/>
              <ShareModal roomId={roomId} collaborators={users} creatorId={roomMetadata.creatorId} currentUserType={currentUserType}/>
            <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
            </div>
        </Header>
        <div >
      <Editor roomId={roomId} currentUserType={currentUserType} />
      </div>
          </div>
        </ClientSideSuspense>
      </RoomProvider>
  )
}

export default CollaborativeRoom
