// This component is bring used in CollaborativeRoom.tsx

"use client";
import { useSelf } from "@liveblocks/react/suspense";
import { useState } from "react";
import { updateDocumentAccess } from "@/lib/actions/room.actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import Image from "next/image";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import UserTypeSelector from "./UserTypeSelector";
import Collaborator from "./Collaborator";

const ShareModal = ({
  roomId,
  creatorId,
  currentUserType,
  collaborators,
}: ShareDocumentDialogProps) => {
  const user = useSelf(); // getting the user who's trying change the permissions

  const [open, setOpen] = useState(false); // to track if the modal is open or closed
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState(""); // email of the user we're trying to add
  const [userType, setUserType] = useState<UserType>("viewer"); // state to decide the type of user (editor or viewer)

  const shareDocumentHandler = async (type: string) => {
    setLoading(true);

    await updateDocumentAccess({roomId, email, userType: userType as UserType, updatedBy: user.info})
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button
          className="gradient-blue flex h-9 gap-1 px-4"
          disabled={currentUserType !== "editor"}
        >
          <Image
            src="/assets/icons/share.svg"
            alt="share"
            width={20}
            height={20}
            className="min-w-4 md:size-5"
          />
          <p className="hidden mr-1 sm:block">Share</p>
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog">
        <DialogHeader>
          <DialogTitle>Manage who can view this project</DialogTitle>
          <DialogDescription>
            Select which users can view and edit this document
          </DialogDescription>
        </DialogHeader>
        <Label htmlFor="email" className="mt-6 text-blue-100">
          Email address
        </Label>
        <div className="flex items-center gap-3">
          <div className="flex flex-1 rounded-md bg-dark-400">
            <Input id="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)} className="share-input"/>
            <UserTypeSelector userType={userType} setUserType={setUserType}/>
          </div>
          <Button type='submit' onClick={shareDocumentHandler} className="gradient-blue flex h-full gap-1 px-5" disabled={loading}>
            {loading ? 'Sending...' : 'Invite'}
          </Button>
        </div>
        <div className="my-2 space-y-2">
            <ul className="flex flex-col">
                {collaborators.map((c) => (<Collaborator
                key={c.id}
                roomId={roomId}
                creatorId={creatorId}
                email={c.email}
                collaborator={c}
                user={user.info}
                />))}
            </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareModal;