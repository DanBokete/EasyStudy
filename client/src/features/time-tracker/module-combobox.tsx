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

function ModuleCombobox({
    value,
    onChange,
}: {
    value: string;
    onChange: (value: string) => void;
}) {
    const [open, setOpen] = useState(false);

    const [name, setName] = useState("");
    const modules = useGetAllSubjects();
    const createModule = useCreateSubject();

    // useEffect(() => {
    //     if (!modules.data) return;
    //     setModuleId(() => {
    //         const currentModule = modules.data.find(
    //             (module) => module.name === value
    //         );
    //         if (!currentModule) return null;
    //         return currentModule.id;
    //     });
    // }, [value]);
    function onCreateModule() {
        if (/^[a-zA-Z]/.test(name)) {
            createModule.mutate({ name });
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
                        : "Select Module..."}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search Module..."
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
                                onClick={onCreateModule}
                            >
                                Create Module
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

                                        const selectedModule =
                                            modules.data.find(
                                                (mod) =>
                                                    mod.name === currentValue
                                            );

                                        if (!selectedModule) return;

                                        onChange(selectedModule.id);
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

export default ModuleCombobox;
