import { useCreateModule, useGetAllModules } from "@/api/modules";
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
import { useEffect, useState } from "react";

function ModuleCombobox({
    setModuleId,
    setValue,
    value,
}: {
    setModuleId: React.Dispatch<React.SetStateAction<string | null>>;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    value: string;
}) {
    const [open, setOpen] = useState(false);

    const [name, setName] = useState("");
    const modules = useGetAllModules();
    const createModule = useCreateModule();

    useEffect(() => {
        if (!modules.data) return;
        setModuleId(() => {
            const currentModule = modules.data.find(
                (module) => module.name === value
            );
            if (!currentModule) return null;
            return currentModule.id;
        });
    }, [value]);
    function onCreateModule() {
        createModule.mutate({ name });
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
                        ? modules.data?.find((module) => module.name === value)
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
                        onValueChange={(e) => setName(e)}
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
                                        setValue(
                                            currentValue === value
                                                ? ""
                                                : currentValue
                                        );

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
