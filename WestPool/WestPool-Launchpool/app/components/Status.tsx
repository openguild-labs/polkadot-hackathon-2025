// type Status = "ongoing" | "completed" | "upcoming" | "unknown";

interface StatusDisplayProps {
    status: string;
}

const StatusDisplay = ({ status }: StatusDisplayProps) => {
    let bgColor, textColor, statusText;

    switch (status) {
        case "Ongoing":
            bgColor = "bg-[#102821]";
            textColor = "text-[#0E9A36]";
            statusText = "On going";
            break;
        case "Completed":
            bgColor = "bg-red-500"; // Adjust the red color as needed
            textColor = "text-white"; // Adjust text color for better contrast
            statusText = "Completed";
            break;
        case "Upcoming":
            bgColor = "bg-yellow-500"; // Adjust the yellow color as needed
            textColor = "text-black"; // Adjust text color for better contrast
            statusText = "Upcoming";
            break;
        default:
            bgColor = "bg-gray-200";
            textColor = "text-gray-600";
            statusText = "Unknown Status";
            break;
    }

    return (
        <div
            className={`ml-5 rounded-xl px-5 flex items-center justify-center ${bgColor} ${textColor}`}
        >
            {statusText}
        </div>
    );
};

export default StatusDisplay;
// // Example usage
// const App = () => {
//     const status = "ongoing"; // Change this to "completed" or "upcoming" to test
//     return <StatusDisplay status={status} />;
// };

// export default App;
