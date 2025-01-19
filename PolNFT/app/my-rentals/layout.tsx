export default function MyRentalsLayout({
    children
}: {
    children?: React.ReactNode
}) {
    return (
        <main>
            <div className="max-w-7xl mx-auto py-6 px-4 md:px-6">
                <div className="my-5" />
                <section>
                    <nav
                        className="flex space-x-8 overflow-x-auto border-b-gray-200/20 border-b-2 mb-4"
                        aria-label="Tabs"
                    >
                        <div
                            className="cursor-pointer text-white hover:no-underline border-white hover:text-white whitespace-nowrap py-4 px-1 border-b-2 font-bold"
                            aria-current="page"
                        >
                            Rentals
                        </div>
                        <div
                            className="cursor-pointer text-white hover:no-underline border-transparent hover:text-gray-400 hover:border-gray-400 whitespace-nowrap py-4 px-1 border-b-2 font-bold"
                        >
                            Invoices
                        </div>
                    </nav>
                    {children}
                </section>
            </div>
        </main>

    )
}
