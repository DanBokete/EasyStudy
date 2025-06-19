function Navbar() {
    return (
        <header className="p-2.5 border-b mb-2">
            <ul className="flex justify-end gap-x-5">
                <li>
                    <div className="text-xs text-muted-foreground">LEVEL</div>
                    <div>2</div>
                </li>
                <li>
                    <div className="text-xs text-muted-foreground">XP</div>
                    <div>1,403</div>
                </li>
            </ul>
        </header>
    );
}

export default Navbar;
