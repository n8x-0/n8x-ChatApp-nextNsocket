type Props = { children: React.ReactNode }

const ClientSideHeader = ({ children }: Props) => {
    return (
        <header className="w-full md:px-12 px-5 md:py-5 py-3 flex justify-between items-center fixed top-0 bg-zinc-800 border-b-[1px] border-zinc-700">
            <div className="text-3xl font-medium pr-3">n8x</div>
            <div className='flex md:gap-4 gap-2 font-medium items-center'>
                {children}
            </div>
        </header>
    )
}
export default ClientSideHeader;

