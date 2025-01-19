import { cn } from "@/utils";
import Image from "next/image";

const GhostContent = ({ featureImage, title, content }: { featureImage: string | any; title: string | any; content: string; isMobile?: boolean; }) => (
    <div id="ghost_global" className="w-full">
        <div className={cn("ghost_content w-full flex flex-col items-start m-auto", {})}>
            <div className="gh-canvas ghost_cards">
                {featureImage && (
                    <figure className="article-image relative">
                        <Image layout="intrinsic" width={832} height={469} className="!rounded-xl" src={featureImage} alt={title} placeholder="blur" />
                    </figure>
                )}
                <section className="gh-content w-full my-6" dangerouslySetInnerHTML={{ __html: content }} />
            </div>
        </div>
    </div>
);

export default GhostContent;