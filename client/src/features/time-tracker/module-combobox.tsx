import { useCreateSubject, useGetAllSubjects } from "@/api/subject";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";

function SubjectCombobox({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);

    const [name, setName] = useState("");
    const modules = useGetAllSubjects();
    const createSubject = useCreateSubject();

    // useEffect(() => {
    //     if (!modules.data) return;
    //     setSubjectId(() => {
    //         const currentSubject = modules.data.find(
    //             (module) => module.name === value
    //         );
    //         if (!currentSubject) return null;
    //         return currentSubject.id;
    //     });
    // }, [value]);
    function onCreateSubject() {
        if (/^[a-zA-Z]/.test(name)) {
            createSubject.mutate({ name });
        }
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? modules.data?.find((module) => module.id === value)
                              ?.name
                        : "Select Subject..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search Subject..."
                        className="h-9"
                        onValueChange={(e) => {
                            setName(e);
                            // onChange(e);
                        }}
                    />
                    <CommandList>
                        <CommandEmpty>
                            <Button
                                variant={"outline"}
                                onClick={onCreateSubject}
                            >
                                Create Subject
                            </Button>
                        </CommandEmpty>
                        <CommandGroup>
                            {modules.data?.map((module) => (
                                <CommandItem
                                    key={module.id}
                                    value={module.name}
                                    onSelect={(currentValue) => {
                                        // const moduleName =
                                        //     currentValue === value
                                        //         ? ""
                                        //         : currentValue;

                                        const selectedSubject =
                                            modules.data.find(
                                                (mod) =>
                                                    mod.name === currentValue
                                            );

                                        if (!selectedSubject) return;

                                        onChange(selectedSubject.id);
                                        setOpen(false);
                                    }}
                                >
                                    {module.name}
                                    <Check
                                        className={cn(
                                            "ml-auto",
                                            value === module.id
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}

export default SubjectCombobox;
