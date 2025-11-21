"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "../ui/button";
import { Trash2, UserCircle2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export interface Person {
    _id: string;
    name: string;
    relation: string;
}

interface PersonCardProps {
    person: Person;
    onDelete: (
        _id: string) => void;
}

export function PersonCard({ person, onDelete }: PersonCardProps) {
    return (
        <Card className="flex flex-col overflow-hidden">
            <CardHeader className="p-4 bg-secondary/30">
                <div className="flex justify-center items-center h-24">
                     <UserCircle2 className="w-20 h-20 text-muted-foreground"/>
                </div>
            </CardHeader>
            <CardContent className="flex-grow p-4">
                <CardTitle className="text-xl">{person.name}</CardTitle>
                <CardDescription>{person.relation}</CardDescription>
            </CardContent>
            <CardFooter className="p-2">
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full text-destructive hover:text-destructive hover:bg-destructive/10">
                            <Trash2 className="mr-2 h-4 w-4"/>
                            Delete
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete the card for {person.name}. This action cannot be undone.
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onDelete(person._id)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    );
}
