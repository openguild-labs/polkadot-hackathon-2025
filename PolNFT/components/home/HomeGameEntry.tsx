import { compactNumber } from "@/utils/converter";
import { GameInfo } from "@/interfaces/game";
import GameCategoryTag from "../common/GameCategoryTag";
import GamePlatformIcon from "../common/icons/GamePlatform";

type HomeGameEntryProps = Pick<GameInfo, "name" | "img" | "plug" | "visits" | "items" | "offers" | "categories" | "platforms">;

export default function HomeGameEntry({
    name,
    img,
    plug,
    visits,
    items,
    offers,
    categories,
    platforms
}: HomeGameEntryProps) {
    return (
        <a
            className="flex flex-col gap-2 justify-start bg-[rgb(34,34,48)] rounded-2xl overflow-hidden cursor-pointer no-underline text-white hover:text-white hover:no-underline transition-all hover:border-none shadow-none hover:shadow-lg h-[320px] md:h-[390px] 2xl:[400px]"
            href={`games/${plug}`}
        >
            <div className="h-[150px] md:h-[250px] overflow-hidden relative">
                <img
                    src={img}
                    alt={name}
                    className="absolute w-full h-full object-cover hover:scale-110 transform transition-transform duration-300"
                />
            </div>
            <div className="flex flex-col gap-1 px-2 py-2 text-sm">
                <span className="font-bold text-lg">{name}</span>
                <span className="text-muted text-xs overflow-x-auto scrollbar-hide">
                    {
                        visits > 0 &&
                        <>
                            <span>{compactNumber(visits)} visits</span>
                            <span> · </span>
                        </>
                    }
                    <span>{compactNumber(items)} items</span>
                    <span> · </span>
                    {
                        offers > 0 &&
                        <span>{compactNumber(offers)} offers</span>
                    }
                </span>
                <span className="flex gap-2 mt-2 overflow-x-auto scrollbar-hide items-center">
                    {
                        categories.map((category) => (
                            <GameCategoryTag key={category} category={category} />
                        ))
                    }
                    {
                        platforms.map((platform) => (
                            <GamePlatformIcon key={platform} platform={platform} />
                        ))
                    }


                </span>
            </div>
        </a>

    )
}
